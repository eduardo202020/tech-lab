import { NextResponse } from 'next/server';
import {
  AppRole,
  ProtectedResource,
  ResourceAction,
  canRolePerform,
  normalizeRole,
} from '@/lib/permissions';

export type RequestAuth = {
  userId: string | null;
  username: string | null;
  email: string | null;
  role: AppRole;
  isAuthenticated: boolean;
};

export const getRequestAuth = (request: Request): RequestAuth => {
  const userId = request.headers.get('x-techlab-user-id');

  return {
    userId,
    username: request.headers.get('x-techlab-username'),
    email: request.headers.get('x-techlab-user-email'),
    role: normalizeRole(request.headers.get('x-techlab-user-role')),
    isAuthenticated: Boolean(userId),
  };
};

export const requirePermission = (
  request: Request,
  resource: ProtectedResource,
  action: ResourceAction
) => {
  const auth = getRequestAuth(request);

  if (!auth.isAuthenticated) {
    return {
      auth,
      response: NextResponse.json(
        { error: 'Debes iniciar sesión para realizar esta acción' },
        { status: 401 }
      ),
    };
  }

  if (!canRolePerform(auth.role, resource, action)) {
    return {
      auth,
      response: NextResponse.json(
        { error: 'No tienes permisos para realizar esta acción' },
        { status: 403 }
      ),
    };
  }

  return { auth, response: null };
};
