import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres';
import { requirePermission } from '@/lib/mockAuthServer';
import type { DeviceType, ProjectDeviceRecord } from '@/lib/projectDevices';

export const runtime = 'nodejs';

type DeviceRow = {
  id: string;
  project_id: string;
  device_type: DeviceType;
  name: string;
  identifier: string;
  secondary_identifier: string | null;
  refresh_ms: number | null;
  enabled: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const ensureTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS techlab_project_devices (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      device_type TEXT NOT NULL,
      name TEXT NOT NULL,
      identifier TEXT NOT NULL,
      secondary_identifier TEXT,
      refresh_ms INTEGER,
      enabled BOOLEAN NOT NULL DEFAULT TRUE,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_techlab_project_devices_project_id
    ON techlab_project_devices (project_id, updated_at DESC)
  `);
};

const mapRow = (row: DeviceRow) => ({
  id: row.id,
  project_id: row.project_id,
  device_type: row.device_type,
  name: row.name,
  identifier: row.identifier,
  secondary_identifier: row.secondary_identifier,
  refresh_ms: row.refresh_ms,
  enabled: row.enabled,
  notes: row.notes,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export async function GET(request: Request) {
  try {
    await ensureTable();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const result = projectId
      ? await query<DeviceRow>(
          `SELECT *
           FROM techlab_project_devices
           WHERE project_id = $1
           ORDER BY device_type ASC, name ASC, updated_at DESC`,
          [projectId]
        )
      : await query<DeviceRow>(
          `SELECT *
           FROM techlab_project_devices
           ORDER BY project_id ASC, device_type ASC, name ASC, updated_at DESC`
        );

    return NextResponse.json({ devices: result.rows.map(mapRow) });
  } catch (error) {
    console.error('GET /api/devices error', error);
    return NextResponse.json(
      { error: 'No se pudo consultar dispositivos en PostgreSQL' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authResult = requirePermission(request, 'devices', 'create');
    if (authResult.response) return authResult.response;

    await ensureTable();

    const body = (await request.json()) as Partial<ProjectDeviceRecord>;
    if (!body.project_id || !body.device_type || !body.name || !body.identifier) {
      return NextResponse.json(
        { error: 'project_id, device_type, name e identifier son requeridos' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id = body.id?.trim() || crypto.randomUUID();

    const result = await query<DeviceRow>(
      `INSERT INTO techlab_project_devices (
        id, project_id, device_type, name, identifier,
        secondary_identifier, refresh_ms, enabled, notes, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::timestamptz, $11::timestamptz)
      RETURNING *`,
      [
        id,
        body.project_id,
        body.device_type,
        body.name,
        body.identifier,
        body.secondary_identifier || null,
        body.refresh_ms ?? null,
        body.enabled ?? true,
        body.notes || null,
        now,
        now,
      ]
    );

    return NextResponse.json({ device: mapRow(result.rows[0]) }, { status: 201 });
  } catch (error) {
    console.error('POST /api/devices error', error);
    return NextResponse.json(
      { error: 'No se pudo crear dispositivo en PostgreSQL' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authResult = requirePermission(request, 'devices', 'update');
    if (authResult.response) return authResult.response;

    await ensureTable();

    const body = (await request.json()) as {
      id?: string;
      updates?: Partial<DeviceRow>;
    };

    if (!body.id || !body.updates) {
      return NextResponse.json({ error: 'id y updates son requeridos' }, { status: 400 });
    }

    const current = await query<DeviceRow>(
      'SELECT * FROM techlab_project_devices WHERE id = $1',
      [body.id]
    );

    if (!current.rows[0]) {
      return NextResponse.json({ error: 'Dispositivo no encontrado' }, { status: 404 });
    }

    const next = {
      ...current.rows[0],
      ...body.updates,
      id: body.id,
      updated_at: new Date().toISOString(),
    };

    const updated = await query<DeviceRow>(
      `UPDATE techlab_project_devices
       SET project_id = $2,
           device_type = $3,
           name = $4,
           identifier = $5,
           secondary_identifier = $6,
           refresh_ms = $7,
           enabled = $8,
           notes = $9,
           updated_at = $10::timestamptz
       WHERE id = $1
       RETURNING *`,
      [
        body.id,
        next.project_id,
        next.device_type,
        next.name,
        next.identifier,
        next.secondary_identifier || null,
        next.refresh_ms ?? null,
        next.enabled,
        next.notes || null,
        next.updated_at,
      ]
    );

    return NextResponse.json({ device: mapRow(updated.rows[0]) });
  } catch (error) {
    console.error('PUT /api/devices error', error);
    return NextResponse.json(
      { error: 'No se pudo actualizar dispositivo en PostgreSQL' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const authResult = requirePermission(request, 'devices', 'delete');
    if (authResult.response) return authResult.response;

    await ensureTable();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 });
    }

    const deleted = await query('DELETE FROM techlab_project_devices WHERE id = $1', [id]);

    if (deleted.rowCount === 0) {
      return NextResponse.json({ error: 'Dispositivo no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/devices error', error);
    return NextResponse.json(
      { error: 'No se pudo eliminar dispositivo en PostgreSQL' },
      { status: 500 }
    );
  }
}
