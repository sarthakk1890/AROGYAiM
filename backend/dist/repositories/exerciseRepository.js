"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseRepository = void 0;
const db_1 = require("../db");
class ExerciseRepository {
    async create(data) {
        const keys = Object.keys(data);
        const columns = keys.map(k => `"${k}"`).join(', ');
        const values = keys.map((_, i) => `$${i + 1}`).join(', ');
        const result = await db_1.pool.query(`INSERT INTO "Exercise" (${columns}) VALUES (${values}) RETURNING *`, Object.values(data));
        return result.rows[0];
    }
    async update(id, data) {
        const keys = Object.keys(data);
        if (keys.length === 0)
            return this.findById(id);
        const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');
        const values = keys.map(key => data[key]);
        const result = await db_1.pool.query(`UPDATE "Exercise" SET ${setClause}, "updatedAt" = NOW() WHERE id = $1 RETURNING *`, [id, ...values]);
        return result.rows[0];
    }
    async findById(id) {
        const result = await db_1.pool.query(`
      SELECT e.*, row_to_json(c) as category 
      FROM "Exercise" e 
      LEFT JOIN "ExerciseCategory" c ON e."categoryId" = c.id 
      WHERE e.id = $1 AND e."deletedAt" IS NULL
    `, [id]);
        return result.rows[0] || null;
    }
    async findAll(skip = 0, take = 10) {
        const result = await db_1.pool.query(`
      SELECT e.*, row_to_json(c) as category 
      FROM "Exercise" e 
      LEFT JOIN "ExerciseCategory" c ON e."categoryId" = c.id 
      WHERE e."deletedAt" IS NULL 
      ORDER BY e."createdAt" DESC 
      OFFSET $1 LIMIT $2
    `, [skip, take]);
        return result.rows;
    }
    async softDelete(id) {
        const result = await db_1.pool.query(`UPDATE "Exercise" SET "deletedAt" = NOW() WHERE id = $1 RETURNING *`, [id]);
        return result.rows[0];
    }
    async getCategories() {
        const result = await db_1.pool.query(`SELECT * FROM "ExerciseCategory"`);
        return result.rows;
    }
    async createCategory(name, description) {
        const result = await db_1.pool.query(`INSERT INTO "ExerciseCategory" (name, description) VALUES ($1, $2) RETURNING *`, [name, description || null]);
        return result.rows[0];
    }
}
exports.exerciseRepository = new ExerciseRepository();
