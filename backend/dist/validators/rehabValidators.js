"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRehabPlanValidator = exports.createExerciseValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createExerciseValidator = [
    (0, express_validator_1.body)('categoryId').isUUID().withMessage('Valid category ID is required'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('instructions').notEmpty().withMessage('Instructions are required'),
    (0, express_validator_1.body)('targetMuscle').notEmpty().withMessage('Target muscle is required'),
    (0, express_validator_1.body)('equipment').notEmpty().withMessage('Equipment is required'),
    (0, express_validator_1.body)('difficulty').notEmpty().withMessage('Difficulty is required'),
];
exports.createRehabPlanValidator = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('description').optional().isString(),
];
