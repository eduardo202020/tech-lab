export type AppRole = 'visitor' | 'student' | 'researcher' | 'admin';
export type ProtectedResource =
  | 'projects'
  | 'equipment'
  | 'researchers'
  | 'technologies'
  | 'devices'
  | 'loans';
export type ResourceAction = 'read' | 'create' | 'update' | 'delete';

type PermissionMatrix = Record<
  AppRole,
  Record<ProtectedResource, Record<ResourceAction, boolean>>
>;

export const ROLE_LABELS: Record<AppRole, string> = {
  visitor: 'Visitante',
  student: 'Estudiante',
  researcher: 'Investigador',
  admin: 'Administrador',
};

export const PERMISSIONS: PermissionMatrix = {
  visitor: {
    projects: { read: true, create: false, update: false, delete: false },
    equipment: { read: true, create: false, update: false, delete: false },
    researchers: { read: true, create: false, update: false, delete: false },
    technologies: { read: true, create: false, update: false, delete: false },
    devices: { read: true, create: false, update: false, delete: false },
    loans: { read: true, create: false, update: false, delete: false },
  },
  student: {
    projects: { read: true, create: false, update: false, delete: false },
    equipment: { read: true, create: false, update: false, delete: false },
    researchers: { read: true, create: false, update: false, delete: false },
    technologies: { read: true, create: false, update: false, delete: false },
    devices: { read: true, create: false, update: false, delete: false },
    loans: { read: true, create: true, update: false, delete: false },
  },
  researcher: {
    projects: { read: true, create: false, update: false, delete: false },
    equipment: { read: true, create: false, update: false, delete: false },
    researchers: { read: true, create: false, update: false, delete: false },
    technologies: { read: true, create: false, update: false, delete: false },
    devices: { read: true, create: false, update: false, delete: false },
    loans: { read: true, create: true, update: false, delete: false },
  },
  admin: {
    projects: { read: true, create: true, update: true, delete: true },
    equipment: { read: true, create: true, update: true, delete: true },
    researchers: { read: true, create: true, update: true, delete: true },
    technologies: { read: true, create: true, update: true, delete: true },
    devices: { read: true, create: true, update: true, delete: true },
    loans: { read: true, create: true, update: true, delete: true },
  },
};

export const normalizeRole = (role?: string | null): AppRole => {
  if (role === 'admin' || role === 'student' || role === 'researcher') {
    return role;
  }

  return 'visitor';
};

export const canRolePerform = (
  role: AppRole | string | null | undefined,
  resource: ProtectedResource,
  action: ResourceAction
) => {
  return PERMISSIONS[normalizeRole(role)][resource][action];
};
