import { Request, Response } from 'express';
import { physioRepository } from '../repositories/physioRepository';
import { asyncWrapper } from '../utils/asyncWrapper';
import { formatResponse } from '../utils/response';
import { getPaginationOptions, getPaginationData } from '../utils/pagination';
import { AppError } from '../middleware/errorMiddleware';

export const listPhysios = asyncWrapper(async (req: Request, res: Response) => {
  const { skip, take, page, limit } = getPaginationOptions(req);
  const specialization = req.query.specialization as string | undefined;

  const [physios, total] = await Promise.all([
    physioRepository.findPublicDirectory(skip, take, specialization),
    physioRepository.countPublicDirectory(specialization),
  ]);

  const pagination = getPaginationData(total, page, limit);
  res.json(formatResponse(true, 'Physiotherapists retrieved', physios, null, pagination));
});

export const getPhysioById = asyncWrapper(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const physio = await physioRepository.findPublicById(id);
  if (!physio) {
    throw new AppError('Physiotherapist not found', 404);
  }
  res.json(formatResponse(true, 'Physiotherapist retrieved', physio));
});
