"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailValidator = exports.resetPasswordValidator = exports.forgotPasswordValidator = exports.changePasswordValidator = exports.loginValidator = exports.registerPhysioValidator = exports.registerPatientValidator = void 0;
const express_validator_1 = require("express-validator");
exports.registerPatientValidator = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('Last name is required'),
];
exports.registerPhysioValidator = [
    ...exports.registerPatientValidator,
    (0, express_validator_1.body)('experienceYears').isInt({ min: 0 }).withMessage('Valid experience years required'),
];
exports.loginValidator = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
exports.changePasswordValidator = [
    (0, express_validator_1.body)('oldPassword').notEmpty().withMessage('Old password is required'),
    (0, express_validator_1.body)('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
];
exports.forgotPasswordValidator = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
];
exports.resetPasswordValidator = [
    (0, express_validator_1.body)('token').notEmpty().withMessage('Token is required'),
    (0, express_validator_1.body)('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
];
exports.verifyEmailValidator = [
    (0, express_validator_1.query)('token').notEmpty().withMessage('Token query parameter is required'),
];
