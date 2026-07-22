"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabilityValidator = exports.rescheduleAppointmentValidator = exports.bookAppointmentValidator = void 0;
const express_validator_1 = require("express-validator");
exports.bookAppointmentValidator = [
    (0, express_validator_1.body)('physiotherapistId').isUUID().withMessage('Valid physiotherapist ID is required'),
    (0, express_validator_1.body)('date').isISO8601().withMessage('Valid date is required'),
    (0, express_validator_1.body)('startTime').isISO8601().withMessage('Valid start time is required'),
    (0, express_validator_1.body)('endTime').isISO8601().withMessage('Valid end time is required'),
    (0, express_validator_1.body)('notes').optional().isString(),
];
exports.rescheduleAppointmentValidator = [
    (0, express_validator_1.param)('id').isUUID().withMessage('Valid appointment ID is required'),
    (0, express_validator_1.body)('date').isISO8601().withMessage('Valid date is required'),
    (0, express_validator_1.body)('startTime').isISO8601().withMessage('Valid start time is required'),
    (0, express_validator_1.body)('endTime').isISO8601().withMessage('Valid end time is required'),
];
exports.availabilityValidator = [
    (0, express_validator_1.body)('dayOfWeek').isInt({ min: 0, max: 6 }).withMessage('Day of week must be between 0 and 6'),
    (0, express_validator_1.body)('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be HH:MM format'),
    (0, express_validator_1.body)('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be HH:MM format'),
];
