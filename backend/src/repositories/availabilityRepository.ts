import { pool } from '../db';
import { Availability } from '../types/models';

class AvailabilityRepository {
  async create(data: Partial<Availability>): Promise<Availability> {
    const keys = Object.keys(data);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const values = keys.map((_, i) => `$${i + 1}`).join(', ');
    const result = await pool.query(
      `INSERT INTO "Availability" (${columns}) VALUES (${values}) RETURNING *`,
      Object.values(data)
    );
    return result.rows[0];
  }

  async findByPhysio(physiotherapistId: string): Promise<Availability[]> {
    const result = await pool.query(`
      SELECT * FROM "Availability" 
      WHERE "physiotherapistId" = $1 AND "deletedAt" IS NULL 
      ORDER BY "dayOfWeek" ASC, "startTime" ASC
    `, [physiotherapistId]);
    return result.rows;
  }

  async delete(id: string, physiotherapistId: string) {
    const result = await pool.query(`
      UPDATE "Availability" 
      SET "deletedAt" = NOW() 
      WHERE id = $1 AND "physiotherapistId" = $2
    `, [id, physiotherapistId]);
    return result.rowCount;
  }
}

export const availabilityRepository = new AvailabilityRepository();
