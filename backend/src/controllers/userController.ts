import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { asyncWrapper } from '../utils/asyncWrapper';
import { formatResponse } from '../utils/response';
import { getPaginationOptions } from '../utils/pagination';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMyProfile = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const profile = await userService.getMyProfile(req.user!.id, req.user!.role);
  res.json(formatResponse(true, 'Profile retrieved', profile));
});

export const updateMyProfile = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const profile = await userService.updateMyProfile(req.user!.id, req.user!.role, req.body);
  res.json(formatResponse(true, 'Profile updated', profile));
});

export const getStats = asyncWrapper(async (req: Request, res: Response) => {
  const stats = await userService.getStats();
  res.json(formatResponse(true, 'Stats retrieved', stats));
});

export const listPendingPhysios = asyncWrapper(async (req: Request, res: Response) => {
  const physios = await userService.listPendingPhysios();
  res.json(formatResponse(true, 'Pending physiotherapists retrieved', physios));
});

export const reviewPhysio = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const approve = req.body.approve === true;
  const physio = await userService.reviewPhysio(id, approve);
  res.json(formatResponse(true, approve ? 'Physiotherapist verified' : 'Physiotherapist rejected', physio));
});

export const listAllAppointments = asyncWrapper(async (req: Request, res: Response) => {
  const { skip, take } = getPaginationOptions(req);
  const { appointments, pagination } = await userService.listAllAppointments(skip, take);
  res.json(formatResponse(true, 'Appointments retrieved', appointments, null, pagination));
});

export const listUsers = asyncWrapper(async (req: Request, res: Response) => {
  const { skip, take } = getPaginationOptions(req);
  const { users, pagination } = await userService.listUsers(skip, take);
  res.json(formatResponse(true, 'Users fetched successfully', users, null, pagination));
});

export const suspendUser = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await userService.suspendUser(id);
  res.json(formatResponse(true, 'User suspended successfully'));
});

export const activateUser = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await userService.activateUser(id);
  res.json(formatResponse(true, 'User activated successfully'));
});
