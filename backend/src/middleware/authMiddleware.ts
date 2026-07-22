import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './errorMiddleware';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Not authorized, no token provided', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Not authorized, token failed', 401));
  }
};

import { requireRole } from './roleMiddleware';
export const protect = authenticate;
export const authorizeRoles = (...roles: string[]) => requireRole(roles);

