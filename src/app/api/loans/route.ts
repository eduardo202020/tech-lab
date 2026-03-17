import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres';

export const runtime = 'nodejs';

type LoanRow = {
  id: string;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type LoanRecord = Record<string, unknown> & {
  id: string;
  item_id?: string;
  item_name?: string;
  borrower_id?: string | null;
  borrower_name?: string | null;
  user_name?: string | null;
  loan_date?: string;
  expected_return_date?: string;
  status?: string;
  created_at: string;
  updated_at: string;
};

const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS techlab_loans (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const mapRow = (row: LoanRow): LoanRecord => ({
  ...(row.payload || {}),
  id: row.id,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export async function GET() {
  try {
    await ensureTable();

    const result = await query<LoanRow>(
      `SELECT id, payload, created_at, updated_at
       FROM techlab_loans
       ORDER BY (payload->>'loan_date')::timestamptz DESC NULLS LAST`
    );

    const loans = result.rows.map(mapRow);

    const itemIds = Array.from(
      new Set(
        loans
          .map((loan) => String(loan.item_id || ''))
          .filter(Boolean)
      )
    );

    if (itemIds.length === 0) {
      return NextResponse.json({ loans });
    }

    const equipment = await query<{ id: string; payload: Record<string, unknown> }>(
      `SELECT id, payload FROM techlab_equipment WHERE id = ANY($1::text[])`,
      [itemIds]
    );

    const equipmentById = new Map(
      equipment.rows.map((row) => [row.id, row.payload])
    );

    const enriched = loans.map((loan) => ({
      ...loan,
      item_name:
        loan.item_name ||
        String((equipmentById.get(String(loan.item_id))?.name as string) || ''),
    }));

    return NextResponse.json({ loans: enriched });
  } catch (error) {
    console.error('GET /api/loans error', error);
    return NextResponse.json({ error: 'No se pudo consultar préstamos en PostgreSQL' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();

    const body = (await request.json()) as {
      item_id?: string;
      borrower_id?: string | null;
      user_name?: string;
      borrower_name?: string;
      loan_date?: string;
      expected_return_date?: string;
      status?: string;
    };

    if (!body.item_id || !body.loan_date || !body.expected_return_date) {
      return NextResponse.json({ error: 'item_id, loan_date y expected_return_date son requeridos' }, { status: 400 });
    }

    const overlaps = await query<LoanRow>(
      `SELECT id, payload, created_at, updated_at
       FROM techlab_loans
       WHERE payload->>'item_id' = $1
         AND COALESCE(payload->>'status', 'active') <> 'returned'
         AND tstzrange((payload->>'loan_date')::timestamptz, (payload->>'expected_return_date')::timestamptz, '[]')
             && tstzrange($2::timestamptz, $3::timestamptz, '[]')`,
      [body.item_id, body.loan_date, body.expected_return_date]
    );

    if (overlaps.rows.length > 0) {
      return NextResponse.json(
        { error: 'Conflict', conflicts: overlaps.rows.map(mapRow) },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const payload = {
      id,
      item_id: body.item_id,
      borrower_id: body.borrower_id || null,
      user_name: body.user_name || null,
      borrower_name: body.borrower_name || body.user_name || null,
      loan_date: body.loan_date,
      expected_return_date: body.expected_return_date,
      status: body.status || 'active',
      created_at: now,
      updated_at: now,
    };

    const created = await query<LoanRow>(
      `INSERT INTO techlab_loans (id, payload, created_at, updated_at)
       VALUES ($1, $2::jsonb, $3::timestamptz, $4::timestamptz)
       RETURNING id, payload, created_at, updated_at`,
      [id, JSON.stringify(payload), now, now]
    );

    return NextResponse.json({ loan: mapRow(created.rows[0]) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/loans error', error);
    return NextResponse.json({ error: 'No se pudo crear préstamo en PostgreSQL' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureTable();

    const body = (await request.json()) as {
      id?: string;
      updates?: Record<string, unknown>;
    };

    if (!body.id || !body.updates) {
      return NextResponse.json({ error: 'id y updates son requeridos' }, { status: 400 });
    }

    const current = await query<LoanRow>(
      `SELECT id, payload, created_at, updated_at FROM techlab_loans WHERE id = $1`,
      [body.id]
    );

    if (!current.rows[0]) {
      return NextResponse.json({ error: 'Préstamo no encontrado' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const merged = {
      ...(current.rows[0].payload || {}),
      ...body.updates,
      id: body.id,
      updated_at: now,
      created_at: current.rows[0].created_at,
    };

    const updated = await query<LoanRow>(
      `UPDATE techlab_loans
       SET payload = $2::jsonb, updated_at = $3::timestamptz
       WHERE id = $1
       RETURNING id, payload, created_at, updated_at`,
      [body.id, JSON.stringify(merged), now]
    );

    return NextResponse.json({ loan: mapRow(updated.rows[0]) });
  } catch (error) {
    console.error('PUT /api/loans error', error);
    return NextResponse.json({ error: 'No se pudo actualizar préstamo en PostgreSQL' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureTable();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 });
    }

    const deleted = await query('DELETE FROM techlab_loans WHERE id = $1', [id]);

    if (deleted.rowCount === 0) {
      return NextResponse.json({ error: 'Préstamo no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/loans error', error);
    return NextResponse.json({ error: 'No se pudo eliminar préstamo en PostgreSQL' }, { status: 500 });
  }
}
