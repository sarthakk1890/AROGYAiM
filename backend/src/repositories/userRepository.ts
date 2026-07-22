import { pool } from '../db';
import { User } from '../types/models';

class UserRepository {
  async create(data: Partial<User>): Promise<User> {
    const keys = Object.keys(data);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const values = keys.map((_, i) => `$${i + 1}`).join(', ');
    const result = await pool.query(
      `INSERT INTO "User" (${columns}) VALUES (${values}) RETURNING *`,
      Object.values(data)
    );
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(`SELECT * FROM "User" WHERE email = $1 AND "deletedAt" IS NULL`, [email]);
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query(`SELECT * FROM "User" WHERE id = $1 AND "deletedAt" IS NULL`, [id]);
    return result.rows[0] || null;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const keys = Object.keys(data);
    if (keys.length === 0) return this.findById(id) as Promise<User>;
    const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');
    const values = keys.map(key => (data as any)[key]);
    
    const result = await pool.query(
      `UPDATE "User" SET ${setClause}, "updatedAt" = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  }

  async softDelete(id: string): Promise<User> {
    const result = await pool.query(`UPDATE "User" SET "deletedAt" = NOW() WHERE id = $1 RETURNING *`, [id]);
    return result.rows[0];
  }

  async findAll(skip: number = 0, take: number = 10): Promise<User[]> {
    const result = await pool.query(`SELECT * FROM "User" WHERE "deletedAt" IS NULL ORDER BY "createdAt" DESC OFFSET $1 LIMIT $2`, [skip, take]);
    return result.rows;
  }

  async count(): Promise<number> {
    const result = await pool.query(`SELECT COUNT(*) FROM "User" WHERE "deletedAt" IS NULL`);
    return parseInt(result.rows[0].count, 10);
  }
}

export const userRepository = new UserRepository();
