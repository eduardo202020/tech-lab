import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres';

export const runtime = 'nodejs';

type EquipmentRecord = {
    id: string;
    payload: Record<string, unknown>;
    created_at: string;
    updated_at: string;
};

const ensureTable = async () => {
    await query(`
    CREATE TABLE IF NOT EXISTS techlab_equipment (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const mapRow = (row: EquipmentRecord) => ({
    ...(row.payload || {}),
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
});

const whereFromFilters = (searchParams: URLSearchParams) => {
    const clauses: string[] = [];
    const params: unknown[] = [];

    const condition = searchParams.get('condition');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const availableOnly = searchParams.get('available_only');
    const search = searchParams.get('search');

    if (condition) {
        params.push(condition);
        clauses.push(`payload->>'condition' = $${params.length}`);
    }

    if (category) {
        params.push(category);
        clauses.push(`payload->>'category' = $${params.length}`);
    }

    if (location) {
        params.push(`%${location}%`);
        clauses.push(`COALESCE(payload->>'location', '') ILIKE $${params.length}`);
    }

    if (availableOnly === 'true' || availableOnly === '1') {
        clauses.push(`COALESCE((payload->>'available_quantity')::INT, 0) > 0`);
    }

    if (search) {
        params.push(`%${search}%`);
        const token = `$${params.length}`;
        clauses.push(`(
      COALESCE(payload->>'name', '') ILIKE ${token}
      OR COALESCE(payload->>'brand', '') ILIKE ${token}
      OR COALESCE(payload->>'model', '') ILIKE ${token}
      OR COALESCE(payload->>'category', '') ILIKE ${token}
      OR COALESCE(payload->>'serial_number', '') ILIKE ${token}
      OR COALESCE(payload->>'description', '') ILIKE ${token}
      OR COALESCE(payload->>'location', '') ILIKE ${token}
    )`);
    }

    return {
        where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
        params,
    };
};

export async function GET(request: Request) {
    try {
        await ensureTable();

        const { searchParams } = new URL(request.url);
        const { where, params } = whereFromFilters(searchParams);

        const result = await query<EquipmentRecord>(
            `SELECT id, payload, created_at, updated_at
       FROM techlab_equipment
       ${where}
       ORDER BY updated_at DESC`,
            params
        );

        return NextResponse.json({ equipment: result.rows.map(mapRow) });
    } catch (error) {
        console.error('GET /api/equipment error', error);
        return NextResponse.json({ error: 'No se pudo consultar equipos en PostgreSQL' }, { status: 500 });
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

        const result = await query<EquipmentRecord>(
            `INSERT INTO techlab_equipment (id, payload, created_at, updated_at)
       VALUES ($1, $2::jsonb, $3::timestamptz, $4::timestamptz)
       RETURNING id, payload, created_at, updated_at`,
            [id, JSON.stringify(payload), now, now]
        );

        return NextResponse.json({ equipment: mapRow(result.rows[0]) }, { status: 201 });
    } catch (error) {
        console.error('POST /api/equipment error', error);
        return NextResponse.json({ error: 'No se pudo crear equipo en PostgreSQL' }, { status: 500 });
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

        const current = await query<EquipmentRecord>(
            'SELECT id, payload, created_at, updated_at FROM techlab_equipment WHERE id = $1',
            [body.id]
        );

        if (!current.rows[0]) {
            return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 });
        }

        const now = new Date().toISOString();
        const merged = {
            ...(current.rows[0].payload || {}),
            ...body.updates,
            id: body.id,
            updated_at: now,
            created_at: current.rows[0].created_at,
        };

        const updated = await query<EquipmentRecord>(
            `UPDATE techlab_equipment
       SET payload = $2::jsonb, updated_at = $3::timestamptz
       WHERE id = $1
       RETURNING id, payload, created_at, updated_at`,
            [body.id, JSON.stringify(merged), now]
        );

        return NextResponse.json({ equipment: mapRow(updated.rows[0]) });
    } catch (error) {
        console.error('PUT /api/equipment error', error);
        return NextResponse.json({ error: 'No se pudo actualizar equipo en PostgreSQL' }, { status: 500 });
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

        const deleted = await query('DELETE FROM techlab_equipment WHERE id = $1', [id]);

        if (deleted.rowCount === 0) {
            return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('DELETE /api/equipment error', error);
        return NextResponse.json({ error: 'No se pudo eliminar equipo en PostgreSQL' }, { status: 500 });
    }
}
