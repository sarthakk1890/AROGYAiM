import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { AppError } from './errorMiddleware';

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden: You do not have permission to access this resource', 403));
    }
    next();
  };
};
