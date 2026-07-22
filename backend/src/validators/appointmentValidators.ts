import { body, param, query } from 'express-validator';

export const bookAppointmentValidator = [
  body('physiotherapistId').isUUID().withMessage('Valid physiotherapist ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required'),
  body('notes').optional().isString(),
];

export const rescheduleAppointmentValidator = [
  param('id').isUUID().withMessage('Valid appointment ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required'),
];

export const availabilityValidator = [
  body('dayOfWeek').isInt({ min: 0, max: 6 }).withMessage('Day of week must be between 0 and 6'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be HH:MM format'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be HH:MM format'),
];
