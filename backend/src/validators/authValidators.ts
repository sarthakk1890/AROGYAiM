import { body, query } from 'express-validator';

export const registerPatientValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
];

export const registerPhysioValidator = [
  ...registerPatientValidator,
  body('experienceYears').isInt({ min: 0 }).withMessage('Valid experience years required'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const changePasswordValidator = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
];

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Token is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
];

export const verifyEmailValidator = [
  query('token').notEmpty().withMessage('Token query parameter is required'),
];
