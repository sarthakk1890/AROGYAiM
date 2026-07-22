"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const response_1 = require("../utils/response");
const logger_1 = __importDefault(require("../config/logger"));
const env_1 = require("../config/env");
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    }
    logger_1.default.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (err.stack) {
        logger_1.default.error(err.stack);
    }
    res.status(statusCode).json((0, response_1.formatResponse)(false, message, null, env_1.env.nodeEnv === 'development' ? err.stack : undefined));
};
exports.errorHandler = errorHandler;
