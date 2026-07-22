import { pool, withTransaction } from '../db';
import { ExercisePlan, AssignedExercisePlan, SessionCompletion } from '../types/models';

interface PlanItemInput {
  exerciseId: string;
  sets: number;
  repetitions: number;
  duration: number;
  frequency: string;
  restTime: number;
  notes?: string;
  displayOrder?: number;
}

class RehabPlanRepository {
  async createPlan(data: Partial<ExercisePlan>): Promise<any> {
    const keys = Object.keys(data);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const values = keys.map((_, i) => `$${i + 1}`).join(', ');
    const result = await pool.query(
      `INSERT INTO "ExercisePlan" (${columns}) VALUES (${values}) RETURNING *`,
      Object.values(data)
    );
    return result.rows[0];
  }

  async findPlanById(id: string): Promise<any> {
    const planResult = await pool.query(`SELECT * FROM "ExercisePlan" WHERE id = $1`, [id]);
    const plan = planResult.rows[0];
    if (!plan) return null;

    const itemsResult = await pool.query(`
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

  async updatePlan(id: string, data: Partial<ExercisePlan>): Promise<any> {
    const keys = Object.keys(data);
    if (keys.length > 0) {
      const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');
      const values = keys.map(key => (data as any)[key]);
      await pool.query(
        `UPDATE "ExercisePlan" SET ${setClause}, "updatedAt" = NOW() WHERE id = $1`,
        [id, ...values]
      );
    }
    return this.findPlanById(id);
  }

  async assignPlan(data: Partial<AssignedExercisePlan>): Promise<AssignedExercisePlan> {
    const keys = Object.keys(data);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const values = keys.map((_, i) => `$${i + 1}`).join(', ');
    const result = await pool.query(
      `INSERT INTO "AssignedExercisePlan" (${columns}) VALUES (${values}) RETURNING *`,
      Object.values(data)
    );
    return result.rows[0];
  }

  async findPlansByPhysio(physiotherapistId: string): Promise<any[]> {
    const result = await pool.query(`
      SELECT p.*, (SELECT COUNT(*) FROM "ExercisePlanItem" i WHERE i."planId" = p.id) as "itemCount"
      FROM "ExercisePlan" p
      WHERE p."physiotherapistId" = $1 AND p."deletedAt" IS NULL
      ORDER BY p."updatedAt" DESC
    `, [physiotherapistId]);
    return result.rows;
  }

  async findPatientCurrentPlans(patientId: string): Promise<any[]> {
    const result = await pool.query(`
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

  async completeSessionExercise(data: Partial<SessionCompletion>): Promise<SessionCompletion> {
    const keys = Object.keys(data);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const values = keys.map((_, i) => `$${i + 1}`).join(', ');
    const result = await pool.query(
      `INSERT INTO "SessionCompletion" (${columns}) VALUES (${values}) RETURNING *`,
      Object.values(data)
    );
    return result.rows[0];
  }

  // Replaces a draft plan's exercise items wholesale — simpler and safer than diffing
  // against the existing set given plan items have no natural external identifier from the client.
  async replaceItems(planId: string, items: PlanItemInput[]): Promise<void> {
    await withTransaction(async (tx) => {
      await tx.query(`DELETE FROM "ExercisePlanItem" WHERE "planId" = $1`, [planId]);
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await tx.query(`
          INSERT INTO "ExercisePlanItem" ("planId", "exerciseId", sets, repetitions, duration, frequency, "restTime", notes, "displayOrder")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          planId, item.exerciseId, item.sets, item.repetitions, item.duration,
          item.frequency, item.restTime, item.notes || null, item.displayOrder ?? i,
        ]);
      }
    });
  }

  async findAssignedPlanById(id: string): Promise<AssignedExercisePlan | null> {
    const result = await pool.query(`SELECT * FROM "AssignedExercisePlan" WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  async findOrCreateSession(assignedPlanId: string, patientId: string, scheduledDate: Date): Promise<any> {
    const existing = await pool.query(`
      SELECT * FROM "ExerciseSession"
      WHERE "assignedPlanId" = $1 AND "scheduledDate" = $2
    `, [assignedPlanId, scheduledDate]);
    if (existing.rows[0]) return existing.rows[0];

    const created = await pool.query(`
      INSERT INTO "ExerciseSession" ("assignedPlanId", "patientId", "scheduledDate", "updatedAt")
      VALUES ($1, $2, $3, NOW()) RETURNING *
    `, [assignedPlanId, patientId, scheduledDate]);
    return created.rows[0];
  }

  async markSessionCompleted(sessionId: string): Promise<void> {
    await pool.query(`UPDATE "ExerciseSession" SET status = 'COMPLETED', "updatedAt" = NOW() WHERE id = $1`, [sessionId]);
  }

  async findCompletionsByPatient(patientId: string): Promise<any[]> {
    const result = await pool.query(`
      SELECT
        sc.*,
        row_to_json(e) as exercise,
        s."scheduledDate",
        s."assignedPlanId"
      FROM "SessionCompletion" sc
      JOIN "ExerciseSession" s ON sc."sessionId" = s.id
      LEFT JOIN "Exercise" e ON sc."exerciseId" = e.id
      WHERE s."patientId" = $1
      ORDER BY sc."completedAt" DESC
    `, [patientId]);
    return result.rows;
  }
}

export const rehabPlanRepository = new RehabPlanRepository();
