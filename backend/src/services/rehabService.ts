import { AppError } from '../middleware/errorMiddleware';
import { rehabPlanRepository } from '../repositories/rehabPlanRepository';
import { withTransaction } from '../db';

class RehabService {
  async createPlan(physiotherapistId: string, name: string, description?: string, items?: any[]) {
    const plan = await rehabPlanRepository.createPlan({
      physiotherapistId,
      name,
      description,
      status: 'DRAFT',
    });

    if (items && items.length > 0) {
      await rehabPlanRepository.replaceItems(plan.id, items);
      return rehabPlanRepository.findPlanById(plan.id);
    }

    return plan;
  }

  async editPlan(planId: string, physiotherapistId: string, data: any) {
    const plan = await rehabPlanRepository.findPlanById(planId);
    if (!plan || plan.physiotherapistId !== physiotherapistId) {
      throw new AppError('Plan not found', 404);
    }

    if (plan.status === 'PUBLISHED') {
      const newPlan = await withTransaction(async (tx) => {
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
        const created = newPlanRes.rows[0];

        // New items in the request replace the copy-forward entirely; otherwise carry the
        // previous version's items forward unchanged.
        const sourceItems = data.items && data.items.length > 0 ? data.items : plan.items;
        if (sourceItems && sourceItems.length > 0) {
          for (const item of sourceItems) {
            await tx.query(`
              INSERT INTO "ExercisePlanItem" ("planId", "exerciseId", sets, repetitions, duration, frequency, "restTime", "displayOrder")
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [
              created.id, item.exerciseId, item.sets, item.repetitions, item.duration, item.frequency, item.restTime, item.displayOrder ?? 0
            ]);
          }
        }
        return created;
      });
      return rehabPlanRepository.findPlanById(newPlan.id);
    }

    if (data.items) {
      await rehabPlanRepository.replaceItems(planId, data.items);
    }
    return rehabPlanRepository.updatePlan(planId, { name: data.name, description: data.description });
  }

  async getPlanForPhysio(planId: string, physiotherapistId: string) {
    const plan = await rehabPlanRepository.findPlanById(planId);
    if (!plan || plan.physiotherapistId !== physiotherapistId) {
      throw new AppError('Plan not found', 404);
    }
    return plan;
  }

  async publishPlan(planId: string, physiotherapistId: string) {
    const plan = await rehabPlanRepository.findPlanById(planId);
    if (!plan || plan.physiotherapistId !== physiotherapistId) throw new AppError('Plan not found', 404);

    return rehabPlanRepository.updatePlan(planId, { status: 'PUBLISHED' });
  }

  async assignPlan(planId: string, patientId: string, physiotherapistId: string, startDate: Date) {
    const plan = await rehabPlanRepository.findPlanById(planId);
    if (!plan || plan.physiotherapistId !== physiotherapistId) {
      throw new AppError('Plan not found', 404);
    }
    if (plan.status !== 'PUBLISHED') {
      throw new AppError('Only published plans can be assigned', 400);
    }

    return rehabPlanRepository.assignPlan({
      patientId,
      physiotherapistId,
      planId,
      startDate,
    });
  }

  async completeExercise(patientId: string, assignedPlanId: string, data: {
    exerciseId: string;
    completedSets: number;
    completedReps: number;
    actualDuration: number;
    painLevel: number;
    feedback?: string;
  }) {
    const assignedPlan = await rehabPlanRepository.findAssignedPlanById(assignedPlanId);
    if (!assignedPlan || assignedPlan.patientId !== patientId) {
      throw new AppError('Assigned plan not found', 404);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const session = await rehabPlanRepository.findOrCreateSession(assignedPlanId, patientId, today);

    const completion = await rehabPlanRepository.completeSessionExercise({
      sessionId: session.id,
      exerciseId: data.exerciseId,
      completedSets: data.completedSets,
      completedReps: data.completedReps,
      actualDuration: data.actualDuration,
      painLevel: data.painLevel,
      feedback: data.feedback,
    });

    await rehabPlanRepository.markSessionCompleted(session.id);

    return completion;
  }

  async getCompletionHistory(patientId: string) {
    return rehabPlanRepository.findCompletionsByPatient(patientId);
  }
}

export const rehabService = new RehabService();
