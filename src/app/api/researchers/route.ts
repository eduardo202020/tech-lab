import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres';

export const runtime = 'nodejs';

type ResearcherRecord = {
  id: string;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS techlab_researchers (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const mapRow = (row: ResearcherRecord) => ({
  ...(row.payload || {}),
  id: row.id,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export async function GET() {
  try {
    await ensureTable();

    const result = await query<ResearcherRecord>(
      `SELECT id, payload, created_at, updated_at
       FROM techlab_researchers
       ORDER BY updated_at DESC`
    );

    return NextResponse.json({ researchers: result.rows.map(mapRow) });
  } catch (error) {
    console.error('GET /api/researchers error', error);
    return NextResponse.json({ error: 'No se pudo consultar investigadores en PostgreSQL' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();

    const body = (await request.json()) as Record<string, unknown>;
    const now = new Date().toISOString();
    const id = typeof body.id === 'string' && body.id ? body.id : crypto.randomUUID();

    const payload = {
      ...body,
      id,
      created_at: now,
      updated_at: now,
    };

    const result = await query<ResearcherRecord>(
      `INSERT INTO techlab_researchers (id, payload, created_at, updated_at)
       VALUES ($1, $2::jsonb, $3::timestamptz, $4::timestamptz)
       RETURNING id, payload, created_at, updated_at`,
      [id, JSON.stringify(payload), now, now]
    );

    return NextResponse.json({ researcher: mapRow(result.rows[0]) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/researchers error', error);
    return NextResponse.json({ error: 'No se pudo crear investigador en PostgreSQL' }, { status: 500 });
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

    const current = await query<ResearcherRecord>(
      'SELECT id, payload, created_at, updated_at FROM techlab_researchers WHERE id = $1',
      [body.id]
    );

    if (!current.rows[0]) {
      return NextResponse.json({ error: 'Investigador no encontrado' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const merged = {
      ...(current.rows[0].payload || {}),
      ...body.updates,
      id: body.id,
      updated_at: now,
      created_at: current.rows[0].created_at,
    };

    const updated = await query<ResearcherRecord>(
      `UPDATE techlab_researchers
       SET payload = $2::jsonb, updated_at = $3::timestamptz
       WHERE id = $1
       RETURNING id, payload, created_at, updated_at`,
      [body.id, JSON.stringify(merged), now]
    );

    return NextResponse.json({ researcher: mapRow(updated.rows[0]) });
  } catch (error) {
    console.error('PUT /api/researchers error', error);
    return NextResponse.json({ error: 'No se pudo actualizar investigador en PostgreSQL' }, { status: 500 });
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

    const deleted = await query('DELETE FROM techlab_researchers WHERE id = $1', [id]);

    if (deleted.rowCount === 0) {
      return NextResponse.json({ error: 'Investigador no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/researchers error', error);
    return NextResponse.json({ error: 'No se pudo eliminar investigador en PostgreSQL' }, { status: 500 });
  }
}
