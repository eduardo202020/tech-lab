import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { requirePermission } from '@/lib/mockAuthServer';

export const runtime = 'nodejs';

type TechnologyRow = {
    id: string;
    payload: Record<string, unknown>;
    created_at: string;
    updated_at: string;
};

const ensureTable = async () => {
    await query(`
    CREATE TABLE IF NOT EXISTS techlab_technologies (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const mapRow = (row: TechnologyRow) => ({
    ...(row.payload || {}),
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
});

const readMockJson = async <T,>(fileName: string): Promise<T> => {
    const filePath = path.join(process.cwd(), 'public', 'mocks', fileName);
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
};

const seedTechnologiesIfEmpty = async () => {
    const countResult = await query<{ count: string }>('SELECT COUNT(*)::text AS count FROM techlab_technologies');
    const count = Number(countResult.rows[0]?.count || '0');
    if (count > 0) return;

    const now = new Date().toISOString();
    const json = await readMockJson<{ technologies?: Record<string, unknown>[] }>('technologies.json');
    const technologies = json.technologies || [];

    for (const item of technologies) {
        const id = typeof item.id === 'string' && item.id ? item.id : crypto.randomUUID();
        const payload = {
            ...item,
            id,
            example_projects: item.example_projects || item.projects || [],
            created_at: item.created_at || now,
            updated_at: item.updated_at || now,
        };

        await query(
            `INSERT INTO techlab_technologies (id, payload, created_at, updated_at)
             VALUES ($1, $2::jsonb, $3::timestamptz, $4::timestamptz)
             ON CONFLICT (id) DO NOTHING`,
            [id, JSON.stringify(payload), String(payload.created_at), String(payload.updated_at)]
        );
    }
};

export async function GET() {
    try {
        await ensureTable();
        await seedTechnologiesIfEmpty();

        const result = await query<TechnologyRow>(
            `SELECT id, payload, created_at, updated_at
       FROM techlab_technologies
       ORDER BY updated_at DESC`
        );

        return NextResponse.json({ technologies: result.rows.map(mapRow) });
    } catch (error) {
        console.error('GET /api/technologies error', error);
        return NextResponse.json({ error: 'No se pudo consultar tecnologías en PostgreSQL' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const authResult = requirePermission(request, 'technologies', 'create');
        if (authResult.response) return authResult.response;

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

        const result = await query<TechnologyRow>(
            `INSERT INTO techlab_technologies (id, payload, created_at, updated_at)
       VALUES ($1, $2::jsonb, $3::timestamptz, $4::timestamptz)
       RETURNING id, payload, created_at, updated_at`,
            [id, JSON.stringify(payload), now, now]
        );

        return NextResponse.json({ technology: mapRow(result.rows[0]) }, { status: 201 });
    } catch (error) {
        console.error('POST /api/technologies error', error);
        return NextResponse.json({ error: 'No se pudo crear tecnología en PostgreSQL' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const authResult = requirePermission(request, 'technologies', 'update');
        if (authResult.response) return authResult.response;

        await ensureTable();

        const body = (await request.json()) as {
            id?: string;
            updates?: Record<string, unknown>;
        };

        if (!body.id || !body.updates) {
            return NextResponse.json({ error: 'id y updates son requeridos' }, { status: 400 });
        }

        const current = await query<TechnologyRow>(
            'SELECT id, payload, created_at, updated_at FROM techlab_technologies WHERE id = $1',
            [body.id]
        );

        if (!current.rows[0]) {
            return NextResponse.json({ error: 'Tecnología no encontrada' }, { status: 404 });
        }

        const now = new Date().toISOString();
        const merged = {
            ...(current.rows[0].payload || {}),
            ...body.updates,
            id: body.id,
            updated_at: now,
            created_at: current.rows[0].created_at,
        };

        const updated = await query<TechnologyRow>(
            `UPDATE techlab_technologies
       SET payload = $2::jsonb, updated_at = $3::timestamptz
       WHERE id = $1
       RETURNING id, payload, created_at, updated_at`,
            [body.id, JSON.stringify(merged), now]
        );

        return NextResponse.json({ technology: mapRow(updated.rows[0]) });
    } catch (error) {
        console.error('PUT /api/technologies error', error);
        return NextResponse.json({ error: 'No se pudo actualizar tecnología en PostgreSQL' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const authResult = requirePermission(request, 'technologies', 'delete');
        if (authResult.response) return authResult.response;

        await ensureTable();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'id es requerido' }, { status: 400 });
        }

        const deleted = await query('DELETE FROM techlab_technologies WHERE id = $1', [id]);

        if (deleted.rowCount === 0) {
            return NextResponse.json({ error: 'Tecnología no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('DELETE /api/technologies error', error);
        return NextResponse.json({ error: 'No se pudo eliminar tecnología en PostgreSQL' }, { status: 500 });
    }
}
