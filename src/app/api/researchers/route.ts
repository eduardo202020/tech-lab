import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { requirePermission } from '@/lib/mockAuthServer';

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

type MockUserProfile = {
  id: string;
  username: string;
  full_name: string;
  email?: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  projects?: string | string[];
  phone?: string;
  linkedin_url?: string;
  created_at?: string;
  updated_at?: string;
};

type MockProject = {
  id: string;
  title: string;
  status: string;
  progress: number;
  team_lead?: string;
  team_members?: string[];
};

const readMockJson = async <T,>(fileName: string): Promise<T> => {
  const filePath = path.join(process.cwd(), 'public', 'mocks', fileName);
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const parseUserProjectNames = (projects: MockUserProfile['projects']): string[] => {
  if (!projects) return [];
  if (Array.isArray(projects)) return projects.map((item) => item.trim()).filter(Boolean);
  return projects
    .split('/')
    .map((item) => item.trim())
    .filter(Boolean);
};

const mapUserToResearcherRecord = (user: MockUserProfile, projectsData: MockProject[]) => {
  const fullNameLower = (user.full_name || '').toLowerCase();

  const relatedProjectsByTeam = projectsData.filter((project) => {
    const teamLead = (project.team_lead || '').toLowerCase();
    const teamMembers = (project.team_members || []).map((member) => member.toLowerCase());
    return teamLead === fullNameLower || teamMembers.includes(fullNameLower);
  });

  const declaredProjectNames = parseUserProjectNames(user.projects);
  const relatedProjectsByDeclaredNames = projectsData.filter((project) => {
    const normalizedProjectTitle = normalizeText(project.title);
    return declaredProjectNames.some((declaredName) => {
      const normalizedDeclared = normalizeText(declaredName);
      return (
        normalizedProjectTitle.includes(normalizedDeclared) ||
        normalizedDeclared.includes(normalizedProjectTitle)
      );
    });
  });

  const relatedProjects = relatedProjectsByDeclaredNames.length
    ? relatedProjectsByDeclaredNames
    : relatedProjectsByTeam;

  const currentProjects = relatedProjects
    .filter((project) => project.status === 'active' || project.status === 'planning')
    .map((project) => ({
      id: project.id,
      title: project.title,
      role: (project.team_lead || '').toLowerCase() === fullNameLower ? 'team_lead' : 'team_member',
      status: project.status,
      progress: project.progress || 0,
    }));

  const pastProjects = relatedProjects
    .filter((project) => project.status === 'completed' || project.status === 'paused')
    .map((project) => ({
      id: project.id,
      title: project.title,
      role: (project.team_lead || '').toLowerCase() === fullNameLower ? 'team_lead' : 'team_member',
      status: project.status,
    }));

  const createdAt = user.created_at || new Date().toISOString();
  const updatedAt = user.updated_at || createdAt;

  return {
    id: user.id,
    user_id: user.id,
    name: user.full_name,
    email: user.email || `${user.username}@techlab.local`,
    avatar_url: user.avatar_url || '',
    position: user.role === 'admin' ? 'Coordinador' : 'Investigador',
    department: 'Tech Lab',
    specializations: declaredProjectNames.length ? declaredProjectNames : user.bio ? [user.bio] : [],
    biography: user.bio || (declaredProjectNames.length ? `Investigador Tech Lab (${declaredProjectNames.join(' / ')}).` : ''),
    academic_level: 'bachelor',
    status: 'active',
    join_date: createdAt.slice(0, 10),
    end_date: undefined,
    phone: user.phone || '',
    linkedin_url: user.linkedin_url || '',
    research_gate_url: '',
    orcid: '',
    personal_website: '',
    university: 'Universidad Nacional de Ingeniería',
    degree: '',
    research_interests: declaredProjectNames.length ? declaredProjectNames : user.bio ? [user.bio] : [],
    publications: [],
    achievements: [],
    projects_completed: relatedProjects.length,
    publications_count: 0,
    years_experience: 1,
    created_by: 'mock-system',
    created_at: createdAt,
    updated_at: updatedAt,
    current_projects: currentProjects,
    past_projects: pastProjects,
  };
};

const seedResearchersIfEmpty = async () => {
  const countResult = await query<{ count: string }>('SELECT COUNT(*)::text AS count FROM techlab_researchers');
  const count = Number(countResult.rows[0]?.count || '0');
  if (count > 0) return;

  const [usersJson, projectsJson] = await Promise.all([
    readMockJson<{ usuarios?: MockUserProfile[]; user_profiles?: MockUserProfile[] }>('usuarios.json'),
    readMockJson<{ projects?: MockProject[] }>('projects.json'),
  ]);

  const users = usersJson.usuarios || usersJson.user_profiles || [];
  const projectsData = projectsJson.projects || [];

  for (const user of users.filter((u) => u.role === 'researcher' || u.role === 'admin')) {
    const payload = mapUserToResearcherRecord(user, projectsData);
    await query(
      `INSERT INTO techlab_researchers (id, payload, created_at, updated_at)
       VALUES ($1, $2::jsonb, $3::timestamptz, $4::timestamptz)
       ON CONFLICT (id) DO NOTHING`,
      [payload.id, JSON.stringify(payload), String(payload.created_at), String(payload.updated_at)]
    );
  }
};

export async function GET() {
  try {
    await ensureTable();
    await seedResearchersIfEmpty();

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
    const authResult = requirePermission(request, 'researchers', 'create');
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
    const authResult = requirePermission(request, 'researchers', 'update');
    if (authResult.response) return authResult.response;

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
    const authResult = requirePermission(request, 'researchers', 'delete');
    if (authResult.response) return authResult.response;

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
