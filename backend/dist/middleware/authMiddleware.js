"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.protect = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const errorMiddleware_1 = require("./errorMiddleware");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new errorMiddleware_1.AppError('Not authorized, no token provided', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new errorMiddleware_1.AppError('Not authorized, token failed', 401));
    }
};
exports.authenticate = authenticate;
const roleMiddleware_1 = require("./roleMiddleware");
exports.protect = exports.authenticate;
const authorizeRoles = (...roles) => (0, roleMiddleware_1.requireRole)(roles);
exports.authorizeRoles = authorizeRoles;
