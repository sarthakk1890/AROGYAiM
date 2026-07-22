import { Router } from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import {
  createExerciseValidator,
  createRehabPlanValidator,
  updatePlanValidator,
  assignPlanValidator,
  completeExerciseValidator,
} from '../validators/rehabValidators';
import {
  createExercise,
  updateExercise,
  deleteExercise,
  listExercises,
  listCategories,
  getMyPlans,
  getMyPatients,
  getPlanById,
  createPlan,
  publishPlan,
  assignPlan,
  updatePlan,
  getCurrentPlans,
  completeExercise,
  getCompletionHistory,
} from '../controllers/rehabController';

const router = Router();

// Exercises
router.post('/exercises', protect, authorizeRoles('ADMIN', 'PHYSIOTHERAPIST'), createExerciseValidator, validateRequest, createExercise);
router.get('/exercises', protect, listExercises);
router.get('/exercises/categories', protect, listCategories);
router.put('/exercises/:id', protect, authorizeRoles('ADMIN', 'PHYSIOTHERAPIST'), updateExercise);
router.delete('/exercises/:id', protect, authorizeRoles('ADMIN'), deleteExercise);

// Patient Rehab Views
router.get('/rehabilitation/current', protect, authorizeRoles('PATIENT'), getCurrentPlans);
router.get('/rehabilitation/history', protect, authorizeRoles('PATIENT'), getCompletionHistory);
router.post('/rehabilitation/assigned/:assignedPlanId/complete', protect, authorizeRoles('PATIENT'), completeExerciseValidator, validateRequest, completeExercise);

// Physio Rehab Management
router.get('/rehabilitation/mine', protect, authorizeRoles('PHYSIOTHERAPIST'), getMyPlans);
router.get('/rehabilitation/my-patients', protect, authorizeRoles('PHYSIOTHERAPIST'), getMyPatients);
router.post('/rehabilitation', protect, authorizeRoles('PHYSIOTHERAPIST'), createRehabPlanValidator, validateRequest, createPlan);
router.get('/rehabilitation/:id', protect, authorizeRoles('PHYSIOTHERAPIST'), getPlanById);
router.put('/rehabilitation/:id', protect, authorizeRoles('PHYSIOTHERAPIST'), updatePlanValidator, validateRequest, updatePlan);
router.post('/rehabilitation/:id/publish', protect, authorizeRoles('PHYSIOTHERAPIST'), publishPlan);
router.post('/rehabilitation/:id/assign', protect, authorizeRoles('PHYSIOTHERAPIST'), assignPlanValidator, validateRequest, assignPlan);

export default router;
