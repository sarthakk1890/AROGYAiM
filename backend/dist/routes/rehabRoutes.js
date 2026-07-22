"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const rehabValidators_1 = require("../validators/rehabValidators");
const rehabController_1 = require("../controllers/rehabController");
const router = (0, express_1.Router)();
// Exercises
router.post('/exercises', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('ADMIN', 'PHYSIOTHERAPIST'), rehabValidators_1.createExerciseValidator, validateRequest_1.validateRequest, rehabController_1.createExercise);
router.get('/exercises', authMiddleware_1.protect, rehabController_1.listExercises);
router.get('/exercises/categories', authMiddleware_1.protect, rehabController_1.listCategories);
// Patient Rehab Views
router.get('/rehabilitation/current', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PATIENT'), rehabController_1.getCurrentPlans);
// Physio Rehab Management
router.post('/rehabilitation', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PHYSIOTHERAPIST'), rehabValidators_1.createRehabPlanValidator, validateRequest_1.validateRequest, rehabController_1.createPlan);
router.put('/rehabilitation/:id', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PHYSIOTHERAPIST'), rehabController_1.updatePlan);
router.post('/rehabilitation/:id/publish', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PHYSIOTHERAPIST'), rehabController_1.publishPlan);
router.post('/rehabilitation/:id/assign', authMiddleware_1.protect, (0, authMiddleware_1.authorizeRoles)('PHYSIOTHERAPIST'), rehabController_1.assignPlan);
exports.default = router;
