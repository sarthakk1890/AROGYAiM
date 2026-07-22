"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabilityRepository = void 0;
const db_1 = require("../db");
class AvailabilityRepository {
    async create(data) {
        const keys = Object.keys(data);
        const columns = keys.map(k => `"${k}"`).join(', ');
        const values = keys.map((_, i) => `$${i + 1}`).join(', ');
        const result = await db_1.pool.query(`INSERT INTO "Availability" (${columns}) VALUES (${values}) RETURNING *`, Object.values(data));
        return result.rows[0];
    }
    async findByPhysio(physiotherapistId) {
        const result = await db_1.pool.query(`
      SELECT * FROM "Availability" 
      WHERE "physiotherapistId" = $1 AND "deletedAt" IS NULL 
      ORDER BY "dayOfWeek" ASC, "startTime" ASC
    `, [physiotherapistId]);
        return result.rows;
    }
    async delete(id, physiotherapistId) {
        const result = await db_1.pool.query(`
      UPDATE "Availability" 
      SET "deletedAt" = NOW() 
      WHERE id = $1 AND "physiotherapistId" = $2
    `, [id, physiotherapistId]);
        return result.rowCount;
    }
}
exports.availabilityRepository = new AvailabilityRepository();
