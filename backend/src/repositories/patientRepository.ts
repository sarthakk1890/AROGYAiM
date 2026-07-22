import { pool } from '../db';
import { PatientProfile } from '../types/models';

class PatientRepository {
  async create(data: Partial<PatientProfile>): Promise<PatientProfile> {
    const keys = Object.keys(data);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const values = keys.map((_, i) => `$${i + 1}`).join(', ');
    const result = await pool.query(
      `INSERT INTO "PatientProfile" (${columns}) VALUES (${values}) RETURNING *`,
      Object.values(data)
    );
    return result.rows[0];
  }

  async findByUserId(userId: string): Promise<PatientProfile | null> {
    const result = await pool.query(`SELECT * FROM "PatientProfile" WHERE "userId" = $1`, [userId]);
    return result.rows[0] || null;
  }

  async update(userId: string, data: Partial<PatientProfile>): Promise<PatientProfile> {
    const keys = Object.keys(data);
    if (keys.length === 0) return this.findByUserId(userId) as Promise<PatientProfile>;
    const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');
    const values = keys.map(key => (data as any)[key]);
    
    const result = await pool.query(
      `UPDATE "PatientProfile" SET ${setClause}, "updatedAt" = NOW() WHERE "userId" = $1 RETURNING *`,
      [userId, ...values]
    );
    return result.rows[0];
  }
}

export const patientRepository = new PatientRepository();
