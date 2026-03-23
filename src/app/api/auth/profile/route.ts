import { NextResponse } from 'next/server';
import { findAuthUserById, toAuthUserProfile, updateAuthUserProfile } from '@/lib/authUsers';
import { getRequestAuth } from '@/lib/mockAuthServer';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const auth = getRequestAuth(request);

    if (!auth.userId) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión' },
        { status: 401 }
      );
    }

    const user = await findAuthUserById(auth.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Perfil no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile: toAuthUserProfile(user) });
  } catch (error) {
    console.error('GET /api/auth/profile error', error);
    return NextResponse.json(
      { error: 'No se pudo consultar el perfil' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const auth = getRequestAuth(request);

    if (!auth.userId) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as {
      updates?: {
        username?: string;
        full_name?: string;
        email?: string;
        avatar_url?: string | null;
        bio?: string | null;
        phone?: string | null;
        linkedin_url?: string | null;
      };
    };

    if (!body.updates) {
      return NextResponse.json(
        { error: 'updates es requerido' },
        { status: 400 }
      );
    }

    const profile = await updateAuthUserProfile(auth.userId, body.updates);
    return NextResponse.json({ profile });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo actualizar el perfil';
    const status = message.includes('ya está registrado')
      ? 409
      : message.includes('no encontrado')
        ? 404
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
