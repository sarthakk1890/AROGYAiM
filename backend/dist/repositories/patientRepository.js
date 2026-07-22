"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientRepository = void 0;
const db_1 = require("../db");
class PatientRepository {
    async create(data) {
        const keys = Object.keys(data);
        const columns = keys.map(k => `"${k}"`).join(', ');
        const values = keys.map((_, i) => `$${i + 1}`).join(', ');
        const result = await db_1.pool.query(`INSERT INTO "PatientProfile" (${columns}) VALUES (${values}) RETURNING *`, Object.values(data));
        return result.rows[0];
    }
    async findByUserId(userId) {
        const result = await db_1.pool.query(`SELECT * FROM "PatientProfile" WHERE "userId" = $1`, [userId]);
        return result.rows[0] || null;
    }
    async update(userId, data) {
        const keys = Object.keys(data);
        if (keys.length === 0)
            return this.findByUserId(userId);
        const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');
        const values = keys.map(key => data[key]);
        const result = await db_1.pool.query(`UPDATE "PatientProfile" SET ${setClause}, "updatedAt" = NOW() WHERE "userId" = $1 RETURNING *`, [userId, ...values]);
        return result.rows[0];
    }
}
exports.patientRepository = new PatientRepository();
