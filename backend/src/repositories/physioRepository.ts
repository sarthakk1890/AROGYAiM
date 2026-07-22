import { pool } from '../db';
import { PhysiotherapistProfile } from '../types/models';

class PhysiotherapistRepository {
  async create(data: Partial<PhysiotherapistProfile>): Promise<PhysiotherapistProfile> {
    const keys = Object.keys(data);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const values = keys.map((_, i) => `$${i + 1}`).join(', ');
    const result = await pool.query(
      `INSERT INTO "PhysiotherapistProfile" (${columns}) VALUES (${values}) RETURNING *`,
      Object.values(data)
    );
    return result.rows[0];
  }

  async findByUserId(userId: string): Promise<PhysiotherapistProfile | null> {
    const result = await pool.query(`SELECT * FROM "PhysiotherapistProfile" WHERE "userId" = $1`, [userId]);
    return result.rows[0] || null;
  }

  async update(userId: string, data: Partial<PhysiotherapistProfile>): Promise<PhysiotherapistProfile> {
    const keys = Object.keys(data);
    if (keys.length === 0) return this.findByUserId(userId) as Promise<PhysiotherapistProfile>;
    const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');
    const values = keys.map(key => (data as any)[key]);

    const result = await pool.query(
      `UPDATE "PhysiotherapistProfile" SET ${setClause}, "updatedAt" = NOW() WHERE "userId" = $1 RETURNING *`,
      [userId, ...values]
    );
    return result.rows[0];
  }

  // Public directory: only verified, active physiotherapists are browsable/bookable.
  async findPublicDirectory(skip: number, take: number, specialization?: string): Promise<any[]> {
    const params: any[] = [];
    let paramIndex = 1;
    let query = `
      SELECT u.id, u.email, prof.*
      FROM "User" u
      JOIN "PhysiotherapistProfile" prof ON prof."userId" = u.id
      WHERE u.status = 'ACTIVE' AND u."deletedAt" IS NULL AND prof."verificationStatus" = 'VERIFIED'
    `;
    if (specialization) {
      query += ` AND $${paramIndex} = ANY(prof.specializations)`;
      params.push(specialization);
      paramIndex++;
    }
    query += ` ORDER BY prof."createdAt" DESC OFFSET $${paramIndex++} LIMIT $${paramIndex++}`;
    params.push(skip, take);
    const result = await pool.query(query, params);
    return result.rows;
  }

  async countPublicDirectory(specialization?: string): Promise<number> {
    const params: any[] = [];
    let query = `
      SELECT COUNT(*) FROM "User" u
      JOIN "PhysiotherapistProfile" prof ON prof."userId" = u.id
      WHERE u.status = 'ACTIVE' AND u."deletedAt" IS NULL AND prof."verificationStatus" = 'VERIFIED'
    `;
    if (specialization) {
      query += ` AND $1 = ANY(prof.specializations)`;
      params.push(specialization);
    }
    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count, 10);
  }

  async findPublicById(userId: string): Promise<any> {
    const result = await pool.query(`
      SELECT u.id, u.email, prof.*
      FROM "User" u
      JOIN "PhysiotherapistProfile" prof ON prof."userId" = u.id
      WHERE u.id = $1 AND u.status = 'ACTIVE' AND u."deletedAt" IS NULL AND prof."verificationStatus" = 'VERIFIED'
    `, [userId]);
    return result.rows[0] || null;
  }
}

export const physioRepository = new PhysiotherapistRepository();
