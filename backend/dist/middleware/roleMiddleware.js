"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const errorMiddleware_1 = require("./errorMiddleware");
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new errorMiddleware_1.AppError('Forbidden: You do not have permission to access this resource', 403));
        }
        next();
    };
};
exports.requireRole = requireRole;
