import { Pool, PoolClient } from 'pg';
import { env } from '../config/env';

export const pool = new Pool({
  connectionString: env.dbUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : undefined,
});

export const withTransaction = async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
