"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rehabPlanRepository = void 0;
const db_1 = require("../db");
class RehabPlanRepository {
    async createPlan(data) {
        const keys = Object.keys(data);
        const columns = keys.map(k => `"${k}"`).join(', ');
        const values = keys.map((_, i) => `$${i + 1}`).join(', ');
        const result = await db_1.pool.query(`INSERT INTO "ExercisePlan" (${columns}) VALUES (${values}) RETURNING *`, Object.values(data));
        return result.rows[0];
    }
    async findPlanById(id) {
        const planResult = await db_1.pool.query(`SELECT * FROM "ExercisePlan" WHERE id = $1`, [id]);
        const plan = planResult.rows[0];
        if (!plan)
            return null;
        const itemsResult = await db_1.pool.query(`
      SELECT 
        i.*,
        row_to_json(e) as exercise
      FROM "ExercisePlanItem" i
      LEFT JOIN "Exercise" e ON i."exerciseId" = e.id
      WHERE i."planId" = $1
      ORDER BY i."displayOrder" ASC
    `, [id]);
        plan.items = itemsResult.rows;
        return plan;
    }
    async updatePlan(id, data) {
        const keys = Object.keys(data);
        if (keys.length > 0) {
            const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');
            const values = keys.map(key => data[key]);
            await db_1.pool.query(`UPDATE "ExercisePlan" SET ${setClause}, "updatedAt" = NOW() WHERE id = $1`, [id, ...values]);
        }
        return this.findPlanById(id);
    }
    async assignPlan(data) {
        const keys = Object.keys(data);
        const columns = keys.map(k => `"${k}"`).join(', ');
        const values = keys.map((_, i) => `$${i + 1}`).join(', ');
        const result = await db_1.pool.query(`INSERT INTO "AssignedExercisePlan" (${columns}) VALUES (${values}) RETURNING *`, Object.values(data));
        return result.rows[0];
    }
    async findPatientCurrentPlans(patientId) {
        const result = await db_1.pool.query(`
      SELECT 
        a.*,
        (
          SELECT row_to_json(p_row) FROM (
            SELECT p.*,
            (
              SELECT json_agg(row_to_json(i_row)) FROM (
                SELECT i.*, row_to_json(e) as exercise 
                FROM "ExercisePlanItem" i 
                LEFT JOIN "Exercise" e ON i."exerciseId" = e.id 
                WHERE i."planId" = p.id
              ) i_row
            ) as items
            FROM "ExercisePlan" p WHERE p.id = a."planId"
          ) p_row
        ) as plan
      FROM "AssignedExercisePlan" a
      WHERE a."patientId" = $1 AND a.status = 'ACTIVE' AND a."endDate" >= NOW()
    `, [patientId]);
        return result.rows;
    }
    async completeSessionExercise(data) {
        const keys = Object.keys(data);
        const columns = keys.map(k => `"${k}"`).join(', ');
        const values = keys.map((_, i) => `$${i + 1}`).join(', ');
        const result = await db_1.pool.query(`INSERT INTO "SessionCompletion" (${columns}) VALUES (${values}) RETURNING *`, Object.values(data));
        return result.rows[0];
    }
}
exports.rehabPlanRepository = new RehabPlanRepository();
