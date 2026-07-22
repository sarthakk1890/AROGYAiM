"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentPlans = exports.updatePlan = exports.assignPlan = exports.publishPlan = exports.createPlan = exports.listCategories = exports.listExercises = exports.createExercise = void 0;
const rehabService_1 = require("../services/rehabService");
const exerciseRepository_1 = require("../repositories/exerciseRepository");
const rehabPlanRepository_1 = require("../repositories/rehabPlanRepository");
const asyncWrapper_1 = require("../utils/asyncWrapper");
const response_1 = require("../utils/response");
// Exercise Library (Admin/Physio)
exports.createExercise = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const exercise = await exerciseRepository_1.exerciseRepository.create(req.body);
    res.status(201).json((0, response_1.formatResponse)(true, 'Exercise created', exercise));
});
exports.listExercises = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const exercises = await exerciseRepository_1.exerciseRepository.findAll();
    res.json((0, response_1.formatResponse)(true, 'Exercises retrieved', exercises));
});
exports.listCategories = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const categories = await exerciseRepository_1.exerciseRepository.getCategories();
    res.json((0, response_1.formatResponse)(true, 'Categories retrieved', categories));
});
// Rehab Plans (Physio)
exports.createPlan = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { name, description } = req.body;
    const plan = await rehabService_1.rehabService.createPlan(req.user.id, name, description);
    res.status(201).json((0, response_1.formatResponse)(true, 'Draft plan created', plan));
});
exports.publishPlan = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const id = req.params.id;
    const plan = await rehabService_1.rehabService.publishPlan(id, req.user.id);
    res.json((0, response_1.formatResponse)(true, 'Plan published', plan));
});
exports.assignPlan = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const id = req.params.id;
    const { patientId, startDate } = req.body;
    const assignment = await rehabService_1.rehabService.assignPlan(id, patientId, req.user.id, new Date(startDate));
    res.status(201).json((0, response_1.formatResponse)(true, 'Plan assigned to patient', assignment));
});
exports.updatePlan = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const id = req.params.id;
    const newPlanVersion = await rehabService_1.rehabService.editPlan(id, req.user.id, req.body);
    res.json((0, response_1.formatResponse)(true, 'Plan updated (created new version if published)', newPlanVersion));
});
// Patient Views
exports.getCurrentPlans = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const plans = await rehabPlanRepository_1.rehabPlanRepository.findPatientCurrentPlans(req.user.id);
    res.json((0, response_1.formatResponse)(true, 'Current active plans retrieved', plans));
});
