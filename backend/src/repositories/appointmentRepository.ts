import { pool } from '../db';
import { Appointment } from '../types/models';

class AppointmentRepository {
  async create(data: Partial<Appointment>): Promise<any> {
    const keys = Object.keys(data);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const values = keys.map((_, i) => `$${i + 1}`).join(', ');
    const insertResult = await pool.query(
      `INSERT INTO "Appointment" (${columns}) VALUES (${values}) RETURNING *`,
      Object.values(data)
    );
    return this.findById(insertResult.rows[0].id);
  }

  async findById(id: string): Promise<any> {
    const result = await pool.query(`
      SELECT 
        a.*, 
        row_to_json(pat) as patient, 
        row_to_json(phy) as physiotherapist 
      FROM "Appointment" a
      LEFT JOIN "User" pat ON a."patientId" = pat.id
      LEFT JOIN "User" phy ON a."physiotherapistId" = phy.id
      WHERE a.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  async update(id: string, data: Partial<Appointment>): Promise<any> {
    const keys = Object.keys(data);
    if (keys.length > 0) {
      const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');
      const values = keys.map(key => (data as any)[key]);
      await pool.query(
        `UPDATE "Appointment" SET ${setClause}, "updatedAt" = NOW() WHERE id = $1`,
        [id, ...values]
      );
    }
    return this.findById(id);
  }

  async findConflicting(physiotherapistId: string, startTime: Date, endTime: Date, excludeId?: string): Promise<Appointment | null> {
    let query = `
      SELECT * FROM "Appointment" 
      WHERE "physiotherapistId" = $1 
      AND status NOT IN ('CANCELLED', 'NO_SHOW') 
      AND "deletedAt" IS NULL 
      AND (
        ("startTime" < $3 AND "endTime" > $2)
        OR ("startTime" <= $2 AND "endTime" >= $3)
      )
    `;
    const params: any[] = [physiotherapistId, startTime, endTime];
    if (excludeId) {
      query += ` AND id != $4`;
      params.push(excludeId);
    }
    const result = await pool.query(query, params);
    return result.rows[0] || null;
  }

  async findByPatient(patientId: string): Promise<any[]> {
    const result = await pool.query(`
      SELECT 
        a.*, 
        (
          SELECT row_to_json(p_row) FROM (
            SELECT phy.*, row_to_json(prof) as "physioProfile" 
            FROM "User" phy 
            LEFT JOIN "PhysiotherapistProfile" prof ON phy.id = prof."userId"
            WHERE phy.id = a."physiotherapistId"
          ) p_row
        ) as physiotherapist 
      FROM "Appointment" a
      WHERE a."patientId" = $1 AND a."deletedAt" IS NULL
      ORDER BY a."startTime" DESC
    `, [patientId]);
    return result.rows;
  }

  async findByPhysio(physiotherapistId: string): Promise<any[]> {
    const result = await pool.query(`
      SELECT 
        a.*, 
        (
          SELECT row_to_json(p_row) FROM (
            SELECT pat.*, row_to_json(prof) as "patientProfile" 
            FROM "User" pat 
            LEFT JOIN "PatientProfile" prof ON pat.id = prof."userId"
            WHERE pat.id = a."patientId"
          ) p_row
        ) as patient 
      FROM "Appointment" a
      WHERE a."physiotherapistId" = $1 AND a."deletedAt" IS NULL
      ORDER BY a."startTime" DESC
    `, [physiotherapistId]);
    return result.rows;
  }

  async findAllForAdmin(skip: number, take: number): Promise<any[]> {
    const result = await pool.query(`
      SELECT
        a.*,
        row_to_json(pat) as patient,
        row_to_json(phy) as physiotherapist
      FROM "Appointment" a
      LEFT JOIN "User" pat ON a."patientId" = pat.id
      LEFT JOIN "User" phy ON a."physiotherapistId" = phy.id
      WHERE a."deletedAt" IS NULL
      ORDER BY a."startTime" DESC
      OFFSET $1 LIMIT $2
    `, [skip, take]);
    return result.rows;
  }

  async countAll(): Promise<number> {
    const result = await pool.query(`SELECT COUNT(*) FROM "Appointment" WHERE "deletedAt" IS NULL`);
    return parseInt(result.rows[0].count, 10);
  }

  async findDistinctPatientsByPhysio(physiotherapistId: string): Promise<any[]> {
    const result = await pool.query(`
      SELECT DISTINCT ON (u.id) u.id, u.email, prof."firstName", prof."lastName"
      FROM "Appointment" a
      JOIN "User" u ON u.id = a."patientId"
      LEFT JOIN "PatientProfile" prof ON prof."userId" = u.id
      WHERE a."physiotherapistId" = $1 AND a."deletedAt" IS NULL
      ORDER BY u.id
    `, [physiotherapistId]);
    return result.rows;
  }

  async softDelete(id: string) {
    const result = await pool.query(`
      UPDATE "Appointment" 
      SET "deletedAt" = NOW(), status = 'CANCELLED' 
      WHERE id = $1 RETURNING *
    `, [id]);
    return result.rows[0];
  }
}

export const appointmentRepository = new AppointmentRepository();
