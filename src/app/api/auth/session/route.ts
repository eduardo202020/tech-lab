import { NextResponse } from 'next/server';
import { findAuthUserById, toAuthUserProfile } from '@/lib/authUsers';
import { getRequestAuth } from '@/lib/mockAuthServer';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const auth = getRequestAuth(request);

    if (!auth.userId) {
      return NextResponse.json(
        { error: 'No hay sesión activa' },
        { status: 401 }
      );
    }

    const user = await findAuthUserById(auth.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Sesión inválida' },
        { status: 401 }
      );
    }

    return NextResponse.json({ profile: toAuthUserProfile(user) });
  } catch (error) {
    console.error('GET /api/auth/session error', error);
    return NextResponse.json(
      { error: 'No se pudo validar la sesión' },
      { status: 500 }
    );
  }
}
