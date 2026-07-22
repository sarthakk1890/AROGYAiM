import { Request, Response } from 'express';
import { rehabService } from '../services/rehabService';
import { exerciseRepository } from '../repositories/exerciseRepository';
import { rehabPlanRepository } from '../repositories/rehabPlanRepository';
import { appointmentRepository } from '../repositories/appointmentRepository';
import { asyncWrapper } from '../utils/asyncWrapper';
import { formatResponse } from '../utils/response';
import { getPaginationOptions } from '../utils/pagination';
import { AuthRequest } from '../middleware/authMiddleware';

// Exercise Library (Admin/Physio)
export const createExercise = asyncWrapper(async (req: Request, res: Response) => {
  const exercise = await exerciseRepository.create(req.body);
  res.status(201).json(formatResponse(true, 'Exercise created', exercise));
});

export const updateExercise = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const exercise = await exerciseRepository.update(id, req.body);
  res.json(formatResponse(true, 'Exercise updated', exercise));
});

export const deleteExercise = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await exerciseRepository.softDelete(id);
  res.json(formatResponse(true, 'Exercise deleted'));
});

export const listExercises = asyncWrapper(async (req: Request, res: Response) => {
  const { skip, take } = getPaginationOptions(req);
  const exercises = await exerciseRepository.findAll(skip, take);
  res.json(formatResponse(true, 'Exercises retrieved', exercises));
});

export const listCategories = asyncWrapper(async (req: Request, res: Response) => {
  const categories = await exerciseRepository.getCategories();
  res.json(formatResponse(true, 'Categories retrieved', categories));
});

// Rehab Plans (Physio)
export const getMyPlans = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const plans = await rehabPlanRepository.findPlansByPhysio(req.user!.id);
  res.json(formatResponse(true, 'Plans retrieved', plans));
});

export const getMyPatients = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const patients = await appointmentRepository.findDistinctPatientsByPhysio(req.user!.id);
  res.json(formatResponse(true, 'Patients retrieved', patients));
});

export const getPlanById = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const plan = await rehabService.getPlanForPhysio(id, req.user!.id);
  res.json(formatResponse(true, 'Plan retrieved', plan));
});

export const createPlan = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { name, description, items } = req.body;
  const plan = await rehabService.createPlan(req.user!.id, name, description, items);
  res.status(201).json(formatResponse(true, 'Draft plan created', plan));
});

export const publishPlan = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const plan = await rehabService.publishPlan(id, req.user!.id);
  res.json(formatResponse(true, 'Plan published', plan));
});

export const assignPlan = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { patientId, startDate } = req.body;
  const assignment = await rehabService.assignPlan(id, patientId, req.user!.id, new Date(startDate));
  res.status(201).json(formatResponse(true, 'Plan assigned to patient', assignment));
});

export const updatePlan = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const newPlanVersion = await rehabService.editPlan(id, req.user!.id, req.body);
  res.json(formatResponse(true, 'Plan updated (created new version if published)', newPlanVersion));
});

// Patient Views
export const getCurrentPlans = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const plans = await rehabPlanRepository.findPatientCurrentPlans(req.user!.id);
  res.json(formatResponse(true, 'Current active plans retrieved', plans));
});

export const completeExercise = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const assignedPlanId = req.params.assignedPlanId as string;
  const completion = await rehabService.completeExercise(req.user!.id, assignedPlanId, req.body);
  res.status(201).json(formatResponse(true, 'Exercise logged as completed', completion));
});

export const getCompletionHistory = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const history = await rehabService.getCompletionHistory(req.user!.id);
  res.json(formatResponse(true, 'Completion history retrieved', history));
});
