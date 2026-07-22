import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { formatResponse } from '../utils/response';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      formatResponse(false, 'Validation Error', null, errors.array())
    );
  }
  next();
};
