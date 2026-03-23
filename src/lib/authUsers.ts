import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { query } from '@/lib/postgres';
import { normalizeRole, type AppRole } from '@/lib/permissions';

export type AuthUserProfile = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: AppRole;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
};

type AuthUserRow = AuthUserProfile & {
  password_hash: string;
};

type MockUsersFile = {
  usuarios?: Array<Record<string, unknown>>;
  user_profiles?: Array<Record<string, unknown>>;
};

const USERS_TABLE = 'techlab_auth_users';

const readMockJson = async <T,>(fileName: string): Promise<T> => {
  const filePath = path.join(process.cwd(), 'public', 'mocks', fileName);
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
};

const normalizeNullableText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
};

export const verifyPassword = (password: string, passwordHash: string) => {
  const [salt, storedDerived] = passwordHash.split(':');
  if (!salt || !storedDerived) return false;

  const derived = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(storedDerived, 'hex');
  if (storedBuffer.length !== derived.length) return false;

  return timingSafeEqual(storedBuffer, derived);
};

export const toAuthUserProfile = (row: AuthUserRow): AuthUserProfile => ({
  id: row.id,
  username: row.username,
  full_name: row.full_name,
  email: row.email,
  role: row.role,
  avatar_url: row.avatar_url,
  bio: row.bio,
  phone: row.phone,
  linkedin_url: row.linkedin_url,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const ensureAuthUsersTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS ${USERS_TABLE} (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL,
      avatar_url TEXT,
      bio TEXT,
      phone TEXT,
      linkedin_url TEXT,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

export const seedAuthUsersIfEmpty = async () => {
  await ensureAuthUsersTable();

  const countResult = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM ${USERS_TABLE}`
  );
  const count = Number(countResult.rows[0]?.count || '0');
  if (count > 0) return;

  const json = await readMockJson<MockUsersFile>('usuarios.json');
  const users = json.usuarios || json.user_profiles || [];

  for (const item of users) {
    const id = String(item.id || crypto.randomUUID());
    const username = String(item.username || '').trim().toLowerCase();
    if (!username) continue;

    const fullName = String(item.full_name || username).trim();
    const email = (normalizeNullableText(item.email) || '').toLowerCase();
    const role = normalizeRole(normalizeNullableText(item.role));
    const password = normalizeNullableText(item.password) || 'techlab123';
    const createdAt =
      normalizeNullableText(item.created_at) || new Date().toISOString();
    const updatedAt =
      normalizeNullableText(item.updated_at) || createdAt;

    await query(
      `INSERT INTO ${USERS_TABLE} (
        id, username, full_name, email, role, avatar_url, bio, phone,
        linkedin_url, password_hash, created_at, updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::timestamptz,$12::timestamptz)
      ON CONFLICT (id) DO NOTHING`,
      [
        id,
        username,
        fullName,
        email,
        role,
        normalizeNullableText(item.avatar_url),
        normalizeNullableText(item.bio),
        normalizeNullableText(item.phone),
        normalizeNullableText(item.linkedin_url),
        hashPassword(password),
        createdAt,
        updatedAt,
      ]
    );
  }
};

export const findAuthUserByIdentifier = async (identifier: string) => {
  await seedAuthUsersIfEmpty();

  const normalized = identifier.trim().toLowerCase();
  const result = await query<AuthUserRow>(
    `SELECT
      id, username, full_name, email, role, avatar_url, bio, phone,
      linkedin_url, password_hash, created_at, updated_at
     FROM ${USERS_TABLE}
     WHERE LOWER(username) = $1 OR LOWER(email) = $1
     LIMIT 1`,
    [normalized]
  );

  return result.rows[0] || null;
};

export const findAuthUserById = async (id: string) => {
  await seedAuthUsersIfEmpty();

  const result = await query<AuthUserRow>(
    `SELECT
      id, username, full_name, email, role, avatar_url, bio, phone,
      linkedin_url, password_hash, created_at, updated_at
     FROM ${USERS_TABLE}
     WHERE id = $1
     LIMIT 1`,
    [id]
  );

  return result.rows[0] || null;
};

export const createAuthUser = async (input: {
  email: string;
  password: string;
  username: string;
  full_name: string;
  role?: AppRole;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  linkedin_url?: string | null;
}) => {
  await seedAuthUsersIfEmpty();

  const email = input.email.trim().toLowerCase();
  const username = input.username.trim().toLowerCase();

  const duplicates = await query<{ id: string }>(
    `SELECT id FROM ${USERS_TABLE}
     WHERE LOWER(email) = $1 OR LOWER(username) = $2
     LIMIT 1`,
    [email, username]
  );

  if (duplicates.rows[0]) {
    throw new Error('El email o nombre de usuario ya está registrado');
  }

  const now = new Date().toISOString();
  const created = await query<AuthUserRow>(
    `INSERT INTO ${USERS_TABLE} (
      id, username, full_name, email, role, avatar_url, bio, phone,
      linkedin_url, password_hash, created_at, updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::timestamptz,$12::timestamptz)
    RETURNING
      id, username, full_name, email, role, avatar_url, bio, phone,
      linkedin_url, password_hash, created_at, updated_at`,
    [
      crypto.randomUUID(),
      username,
      input.full_name.trim() || username,
      email,
      input.role || 'student',
      normalizeNullableText(input.avatar_url),
      normalizeNullableText(input.bio),
      normalizeNullableText(input.phone),
      normalizeNullableText(input.linkedin_url),
      hashPassword(input.password),
      now,
      now,
    ]
  );

  return toAuthUserProfile(created.rows[0]);
};

export const updateAuthUserProfile = async (
  id: string,
  updates: Partial<AuthUserProfile>
) => {
  await seedAuthUsersIfEmpty();

  const current = await findAuthUserById(id);
  if (!current) {
    throw new Error('Perfil no encontrado');
  }

  const nextUsername = (updates.username || current.username).trim().toLowerCase();
  const nextEmail = (updates.email || current.email).trim().toLowerCase();

  const duplicate = await query<{ id: string }>(
    `SELECT id FROM ${USERS_TABLE}
     WHERE id <> $1 AND (LOWER(username) = $2 OR LOWER(email) = $3)
     LIMIT 1`,
    [id, nextUsername, nextEmail]
  );

  if (duplicate.rows[0]) {
    throw new Error('El email o nombre de usuario ya está registrado');
  }

  const updatedAt = new Date().toISOString();
  const updated = await query<AuthUserRow>(
    `UPDATE ${USERS_TABLE}
     SET
       username = $2,
       full_name = $3,
       email = $4,
       role = $5,
       avatar_url = $6,
       bio = $7,
       phone = $8,
       linkedin_url = $9,
       updated_at = $10::timestamptz
     WHERE id = $1
     RETURNING
       id, username, full_name, email, role, avatar_url, bio, phone,
       linkedin_url, password_hash, created_at, updated_at`,
    [
      id,
      nextUsername,
      (updates.full_name || current.full_name).trim(),
      nextEmail,
      normalizeRole(updates.role || current.role),
      normalizeNullableText(updates.avatar_url) ?? current.avatar_url,
      normalizeNullableText(updates.bio) ?? current.bio,
      normalizeNullableText(updates.phone) ?? current.phone,
      normalizeNullableText(updates.linkedin_url) ?? current.linkedin_url,
      updatedAt,
    ]
  );

  return toAuthUserProfile(updated.rows[0]);
};

export const updateAuthUserPassword = async (
  id: string,
  currentPassword: string,
  nextPassword: string
) => {
  await seedAuthUsersIfEmpty();

  const current = await findAuthUserById(id);
  if (!current) {
    throw new Error('Perfil no encontrado');
  }

  if (!verifyPassword(currentPassword, current.password_hash)) {
    throw new Error('La contraseña actual es incorrecta');
  }

  if (nextPassword.length < 6) {
    throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
  }

  if (currentPassword === nextPassword) {
    throw new Error('La nueva contraseña debe ser diferente a la actual');
  }

  await query(
    `UPDATE ${USERS_TABLE}
     SET password_hash = $2, updated_at = $3::timestamptz
     WHERE id = $1`,
    [id, hashPassword(nextPassword), new Date().toISOString()]
  );
};
