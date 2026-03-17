import { Pool, type PoolConfig, type QueryResult, type QueryResultRow } from 'pg';

const globalForPg = globalThis as unknown as {
    techlabPgPool?: Pool;
};

const boolFromEnv = (value: string | undefined): boolean => value === 'true' || value === '1';

const buildConfig = (): PoolConfig => {
    const {
        DATABASE_URL,
        PGHOST,
        PGPORT,
        PGUSER,
        PGPASSWORD,
        PGDATABASE,
        PGSSLMODE,
        DB_SSL,
    } = process.env;

    if (DATABASE_URL) {
        return {
            connectionString: DATABASE_URL,
            ssl: boolFromEnv(DB_SSL) || PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
        };
    }

    if (!PGHOST || !PGUSER || !PGDATABASE) {
        throw new Error('Configura DATABASE_URL o las variables PGHOST, PGUSER y PGDATABASE para usar PostgreSQL.');
    }

    return {
        host: PGHOST,
        port: Number(PGPORT || '5432'),
        user: PGUSER,
        password: PGPASSWORD,
        database: PGDATABASE,
        ssl: boolFromEnv(DB_SSL) || PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
    };
};

export const getPool = (): Pool => {
    if (!globalForPg.techlabPgPool) {
        globalForPg.techlabPgPool = new Pool(buildConfig());
    }
    return globalForPg.techlabPgPool;
};

export const query = async <T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<QueryResult<T>> => {
    const pool = getPool();
    return pool.query<T>(text, params);
};
