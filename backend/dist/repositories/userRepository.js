"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const db_1 = require("../db");
class UserRepository {
    async create(data) {
        const keys = Object.keys(data);
        const columns = keys.map(k => `"${k}"`).join(', ');
        const values = keys.map((_, i) => `$${i + 1}`).join(', ');
        const result = await db_1.pool.query(`INSERT INTO "User" (${columns}) VALUES (${values}) RETURNING *`, Object.values(data));
        return result.rows[0];
    }
    async findByEmail(email) {
        const result = await db_1.pool.query(`SELECT * FROM "User" WHERE email = $1 AND "deletedAt" IS NULL`, [email]);
        return result.rows[0] || null;
    }
    async findById(id) {
        const result = await db_1.pool.query(`SELECT * FROM "User" WHERE id = $1 AND "deletedAt" IS NULL`, [id]);
        return result.rows[0] || null;
    }
    async update(id, data) {
        const keys = Object.keys(data);
        if (keys.length === 0)
            return this.findById(id);
        const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');
        const values = keys.map(key => data[key]);
        const result = await db_1.pool.query(`UPDATE "User" SET ${setClause}, "updatedAt" = NOW() WHERE id = $1 RETURNING *`, [id, ...values]);
        return result.rows[0];
    }
    async softDelete(id) {
        const result = await db_1.pool.query(`UPDATE "User" SET "deletedAt" = NOW() WHERE id = $1 RETURNING *`, [id]);
        return result.rows[0];
    }
    async findAll(skip = 0, take = 10) {
        const result = await db_1.pool.query(`SELECT * FROM "User" WHERE "deletedAt" IS NULL ORDER BY "createdAt" DESC OFFSET $1 LIMIT $2`, [skip, take]);
        return result.rows;
    }
    async count() {
        const result = await db_1.pool.query(`SELECT COUNT(*) FROM "User" WHERE "deletedAt" IS NULL`);
        return parseInt(result.rows[0].count, 10);
    }
}
exports.userRepository = new UserRepository();
