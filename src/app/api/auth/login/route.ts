import { NextResponse } from 'next/server';
import {
  findAuthUserByIdentifier,
  toAuthUserProfile,
  verifyPassword,
} from '@/lib/authUsers';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      identifier?: string;
      password?: string;
    };

    const identifier = body.identifier?.trim();
    const password = body.password || '';

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Usuario/email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const user = await findAuthUserByIdentifier(identifier);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    return NextResponse.json({ profile: toAuthUserProfile(user) });
  } catch (error) {
    console.error('POST /api/auth/login error', error);
    return NextResponse.json(
      { error: 'No se pudo iniciar sesión' },
      { status: 500 }
    );
  }
}
