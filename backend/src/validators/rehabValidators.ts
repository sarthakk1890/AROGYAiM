import { body } from 'express-validator';

export const createExerciseValidator = [
  body('categoryId').isUUID().withMessage('Valid category ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('instructions').notEmpty().withMessage('Instructions are required'),
  body('targetMuscle').notEmpty().withMessage('Target muscle is required'),
  body('equipment').notEmpty().withMessage('Equipment is required'),
  body('difficulty').notEmpty().withMessage('Difficulty is required'),
];

export const createRehabPlanValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().isString(),
  body('items').optional().isArray(),
  body('items.*.exerciseId').if(body('items').exists()).isUUID().withMessage('Valid exercise ID is required'),
  body('items.*.sets').if(body('items').exists()).isInt({ min: 1 }),
  body('items.*.repetitions').if(body('items').exists()).isInt({ min: 1 }),
  body('items.*.duration').if(body('items').exists()).isInt({ min: 0 }),
  body('items.*.frequency').if(body('items').exists()).notEmpty(),
  body('items.*.restTime').if(body('items').exists()).isInt({ min: 0 }),
];

export const updatePlanValidator = [
  body('name').optional().isString(),
  body('description').optional().isString(),
  body('items').optional().isArray(),
  body('items.*.exerciseId').if(body('items').exists()).isUUID().withMessage('Valid exercise ID is required'),
  body('items.*.sets').if(body('items').exists()).isInt({ min: 1 }),
  body('items.*.repetitions').if(body('items').exists()).isInt({ min: 1 }),
  body('items.*.duration').if(body('items').exists()).isInt({ min: 0 }),
  body('items.*.frequency').if(body('items').exists()).notEmpty(),
  body('items.*.restTime').if(body('items').exists()).isInt({ min: 0 }),
];

export const assignPlanValidator = [
  body('patientId').isUUID().withMessage('Valid patient ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
];

export const completeExerciseValidator = [
  body('exerciseId').isUUID().withMessage('Valid exercise ID is required'),
  body('completedSets').isInt({ min: 0 }),
  body('completedReps').isInt({ min: 0 }),
  body('actualDuration').isInt({ min: 0 }),
  body('painLevel').isInt({ min: 0, max: 10 }),
  body('feedback').optional().isString(),
];
