import { NextResponse } from 'next/server';
import { updateAuthUserPassword } from '@/lib/authUsers';
import { getRequestAuth } from '@/lib/mockAuthServer';

export const runtime = 'nodejs';

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
      currentPassword?: string;
      newPassword?: string;
    };

    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        { error: 'currentPassword y newPassword son requeridos' },
        { status: 400 }
      );
    }

    await updateAuthUserPassword(
      auth.userId,
      body.currentPassword,
      body.newPassword
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo cambiar la contraseña';
    const status =
      message.includes('incorrecta') || message.includes('debe')
        ? 400
        : message.includes('no encontrado')
          ? 404
          : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
