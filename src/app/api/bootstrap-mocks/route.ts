import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { query } from '@/lib/postgres';

export const runtime = 'nodejs';

type SeedTarget = 'equipment' | 'projects' | 'researchers' | 'technologies' | 'loans';

const validTargets: SeedTarget[] = [
    'equipment',
    'projects',
    'researchers',
    'technologies',
    'loans',
];

const tableByTarget: Record<SeedTarget, string> = {
    equipment: 'techlab_equipment',
    projects: 'techlab_projects',
    researchers: 'techlab_researchers',
    technologies: 'techlab_technologies',
    loans: 'techlab_loans',
};

const readMockJson = async <T,>(fileName: string): Promise<T> => {
    const filePath = path.join(process.cwd(), 'public', 'mocks', fileName);
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
};

const ensureTables = async () => {
    await query(`
    CREATE TABLE IF NOT EXISTS techlab_equipment (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

    await query(`
    CREATE TABLE IF NOT EXISTS techlab_projects (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

    await query(`
    CREATE TABLE IF NOT EXISTS techlab_researchers (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

    await query(`
    CREATE TABLE IF NOT EXISTS techlab_technologies (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

    await query(`
    CREATE TABLE IF NOT EXISTS techlab_loans (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

const upsertPayload = async (
    table: string,
    payload: Record<string, unknown>
): Promise<void> => {
    const now = new Date().toISOString();
    const id = typeof payload.id === 'string' && payload.id ? payload.id : crypto.randomUUID();
    const createdAt = String(payload.created_at || now);
    const updatedAt = String(payload.updated_at || now);

    const normalized = {
        ...payload,
        id,
        created_at: createdAt,
        updated_at: updatedAt,
    };

    await query(
        `INSERT INTO ${table} (id, payload, created_at, updated_at)
     VALUES ($1, $2::jsonb, $3::timestamptz, $4::timestamptz)
     ON CONFLICT (id)
     DO UPDATE SET payload = EXCLUDED.payload, updated_at = EXCLUDED.updated_at`,
        [id, JSON.stringify(normalized), createdAt, updatedAt]
    );
};

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

const mapUserToResearcherPayload = (
    user: MockUserProfile,
    projectsData: MockProject[]
): Record<string, unknown> => {
    const fullNameLower = (user.full_name || '').toLowerCase();
    const declaredProjectNames = parseUserProjectNames(user.projects);

    const relatedProjectsByTeam = projectsData.filter((project) => {
        const teamLead = (project.team_lead || '').toLowerCase();
        const teamMembers = (project.team_members || []).map((member) => member.toLowerCase());
        return teamLead === fullNameLower || teamMembers.includes(fullNameLower);
    });

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

const seedProjects = async () => {
    const json = await readMockJson<{ projects?: Record<string, unknown>[] }>('projects.json');
    const rows = json.projects || [];
    for (const row of rows) {
        await upsertPayload(tableByTarget.projects, row);
    }
    return rows.length;
};

const seedEquipment = async () => {
    const rows = await readMockJson<Record<string, unknown>[]>('equipos.json');
    for (const row of rows || []) {
        await upsertPayload(tableByTarget.equipment, row);
    }
    return (rows || []).length;
};

const seedTechnologies = async () => {
    const json = await readMockJson<{ technologies?: Record<string, unknown>[] }>('technologies.json');
    const rows = json.technologies || [];
    for (const row of rows) {
        const payload = {
            ...row,
            example_projects: row.example_projects || row.projects || [],
        };
        await upsertPayload(tableByTarget.technologies, payload);
    }
    return rows.length;
};

const seedResearchers = async () => {
    const [usersJson, projectsJson] = await Promise.all([
        readMockJson<{ usuarios?: MockUserProfile[]; user_profiles?: MockUserProfile[] }>('usuarios.json'),
        readMockJson<{ projects?: MockProject[] }>('projects.json'),
    ]);

    const users = usersJson.usuarios || usersJson.user_profiles || [];
    const projectsData = projectsJson.projects || [];
    const filtered = users.filter((u) => u.role === 'researcher' || u.role === 'admin');

    for (const user of filtered) {
        const payload = mapUserToResearcherPayload(user, projectsData);
        await upsertPayload(tableByTarget.researchers, payload);
    }

    return filtered.length;
};

const seedLoans = async () => {
    const [loansJson, usersJson] = await Promise.all([
        readMockJson<{ prestamos?: Record<string, unknown>[] }>('investigadores.json'),
        readMockJson<{ usuarios?: MockUserProfile[]; user_profiles?: MockUserProfile[] }>('usuarios.json'),
    ]);

    const users = usersJson.usuarios || usersJson.user_profiles || [];
    const byId = new Map(users.map((u) => [u.id, u]));
    const rows = loansJson.prestamos || [];

    for (const row of rows) {
        const borrowerId = typeof row.borrower_id === 'string' ? row.borrower_id : '';
        const borrower = byId.get(borrowerId);
        const payload = {
            ...row,
            borrower_name: row.borrower_name || borrower?.full_name || borrower?.username || null,
            user_name: row.user_name || borrower?.full_name || borrower?.username || null,
        };
        await upsertPayload(tableByTarget.loans, payload);
    }

    return rows.length;
};

const resetTargetTable = async (target: SeedTarget) => {
    await query(`DELETE FROM ${tableByTarget[target]}`);
};

export async function POST(request: Request) {
    try {
        await ensureTables();

        const body = (await request.json().catch(() => ({}))) as {
            reset?: boolean;
            targets?: SeedTarget[];
        };

        const targets = (body.targets || validTargets).filter((t): t is SeedTarget =>
            validTargets.includes(t)
        );

        if (targets.length === 0) {
            return NextResponse.json(
                { error: `targets inválidos. Usa: ${validTargets.join(', ')}` },
                { status: 400 }
            );
        }

        if (body.reset) {
            for (const target of targets) {
                await resetTargetTable(target);
            }
        }

        const seeded: Record<string, number> = {};

        if (targets.includes('projects')) seeded.projects = await seedProjects();
        if (targets.includes('equipment')) seeded.equipment = await seedEquipment();
        if (targets.includes('technologies')) seeded.technologies = await seedTechnologies();
        if (targets.includes('researchers')) seeded.researchers = await seedResearchers();
        if (targets.includes('loans')) seeded.loans = await seedLoans();

        return NextResponse.json({
            ok: true,
            reset: !!body.reset,
            targets,
            seeded,
        });
    } catch (error) {
        console.error('POST /api/bootstrap-mocks error', error);
        return NextResponse.json(
            { error: 'No se pudieron cargar mocks en PostgreSQL' },
            { status: 500 }
        );
    }
}
