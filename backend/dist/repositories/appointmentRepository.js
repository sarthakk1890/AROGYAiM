"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRepository = void 0;
const db_1 = require("../db");
class AppointmentRepository {
    async create(data) {
        const keys = Object.keys(data);
        const columns = keys.map(k => `"${k}"`).join(', ');
        const values = keys.map((_, i) => `$${i + 1}`).join(', ');
        const insertResult = await db_1.pool.query(`INSERT INTO "Appointment" (${columns}) VALUES (${values}) RETURNING *`, Object.values(data));
        return this.findById(insertResult.rows[0].id);
    }
    async findById(id) {
        const result = await db_1.pool.query(`
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
    async update(id, data) {
        const keys = Object.keys(data);
        if (keys.length > 0) {
            const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');
            const values = keys.map(key => data[key]);
            await db_1.pool.query(`UPDATE "Appointment" SET ${setClause}, "updatedAt" = NOW() WHERE id = $1`, [id, ...values]);
        }
        return this.findById(id);
    }
    async findConflicting(physiotherapistId, startTime, endTime, excludeId) {
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
        const params = [physiotherapistId, startTime, endTime];
        if (excludeId) {
            query += ` AND id != $4`;
            params.push(excludeId);
        }
        const result = await db_1.pool.query(query, params);
        return result.rows[0] || null;
    }
    async findByPatient(patientId) {
        const result = await db_1.pool.query(`
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
    async findByPhysio(physiotherapistId) {
        const result = await db_1.pool.query(`
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
    async softDelete(id) {
        const result = await db_1.pool.query(`
      UPDATE "Appointment" 
      SET "deletedAt" = NOW(), status = 'CANCELLED' 
      WHERE id = $1 RETURNING *
    `, [id]);
        return result.rows[0];
    }
}
exports.appointmentRepository = new AppointmentRepository();
