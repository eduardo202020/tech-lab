import { NextResponse } from 'next/server';
import { createAuthUser } from '@/lib/authUsers';
import { normalizeRole } from '@/lib/permissions';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      userData?: {
        username?: string;
        full_name?: string;
        role?: string;
        avatar_url?: string | null;
        bio?: string | null;
        phone?: string | null;
        linkedin_url?: string | null;
      };
    };

    const email = body.email?.trim().toLowerCase() || '';
    const password = body.password || '';
    const username =
      body.userData?.username?.trim() || email.split('@')[0] || '';
    const fullName = body.userData?.full_name?.trim() || 'Usuario';

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const profile = await createAuthUser({
      email,
      password,
      username,
      full_name: fullName,
      role: normalizeRole(body.userData?.role || 'student'),
      avatar_url: body.userData?.avatar_url,
      bio: body.userData?.bio,
      phone: body.userData?.phone,
      linkedin_url: body.userData?.linkedin_url,
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo registrar usuario';
    const status = message.includes('ya está registrado') ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
