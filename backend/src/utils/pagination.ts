import { Request } from 'express';
import { PaginationData } from './response';

export const getPaginationOptions = (req: Request) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  
  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
};

export const getPaginationData = (totalItems: number, page: number, limit: number): PaginationData => {
  return {
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  };
};
