import { Request } from 'express';

export const getFilteringOptions = (req: Request, allowedFields: string[]) => {
  const filter: Record<string, any> = {};

  Object.keys(req.query).forEach((key) => {
    if (allowedFields.includes(key)) {
      // Basic support for exact match, can be extended for complex operators
      filter[key] = req.query[key];
    }
  });

  return filter;
};
