import { Request } from 'express';

export const getSortingOptions = (req: Request, defaultSortField: string = 'createdAt', defaultSortOrder: 'asc' | 'desc' = 'desc') => {
  const sortBy = (req.query.sortBy as string) || defaultSortField;
  const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : defaultSortOrder;

  return {
    [sortBy]: sortOrder,
  };
};
