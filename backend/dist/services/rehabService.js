"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rehabService = void 0;
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const rehabPlanRepository_1 = require("../repositories/rehabPlanRepository");
const db_1 = require("../db");
class RehabService {
    async createPlan(physiotherapistId, name, description) {
        return rehabPlanRepository_1.rehabPlanRepository.createPlan({
            physiotherapistId,
            name,
            description,
            status: 'DRAFT',
        });
    }
    async editPlan(planId, physiotherapistId, data) {
        const plan = await rehabPlanRepository_1.rehabPlanRepository.findPlanById(planId);
        if (!plan || plan.physiotherapistId !== physiotherapistId) {
            throw new errorMiddleware_1.AppError('Plan not found', 404);
        }
        if (plan.status === 'PUBLISHED') {
            return (0, db_1.withTransaction)(async (tx) => {
                const newPlanRes = await tx.query(`
          INSERT INTO "ExercisePlan" ("physiotherapistId", name, description, status, version, "parentPlanId")
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `, [
                    physiotherapistId,
                    data.name || plan.name,
                    data.description || plan.description,
                    'DRAFT',
                    plan.version + 1,
                    plan.parentPlanId || plan.id
                ]);
                const newPlan = newPlanRes.rows[0];
                if (plan.items && plan.items.length > 0) {
                    for (const item of plan.items) {
                        await tx.query(`
              INSERT INTO "ExercisePlanItem" ("planId", "exerciseId", sets, repetitions, duration, frequency, "restTime", "displayOrder")
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [
                            newPlan.id, item.exerciseId, item.sets, item.repetitions, item.duration, item.frequency, item.restTime, item.displayOrder
                        ]);
                    }
                }
                return newPlan;
            });
        }
        return rehabPlanRepository_1.rehabPlanRepository.updatePlan(planId, { name: data.name, description: data.description });
    }
    async publishPlan(planId, physiotherapistId) {
        const plan = await rehabPlanRepository_1.rehabPlanRepository.findPlanById(planId);
        if (!plan || plan.physiotherapistId !== physiotherapistId)
            throw new errorMiddleware_1.AppError('Plan not found', 404);
        return rehabPlanRepository_1.rehabPlanRepository.updatePlan(planId, { status: 'PUBLISHED' });
    }
    async assignPlan(planId, patientId, physiotherapistId, startDate) {
        const plan = await rehabPlanRepository_1.rehabPlanRepository.findPlanById(planId);
        if (!plan || plan.status !== 'PUBLISHED') {
            throw new errorMiddleware_1.AppError('Only published plans can be assigned', 400);
        }
        return rehabPlanRepository_1.rehabPlanRepository.assignPlan({
            patientId,
            physiotherapistId,
            planId,
            startDate,
        });
    }
}
exports.rehabService = new RehabService();
