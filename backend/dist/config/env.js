"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
exports.env = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    dbUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    email: {
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
        from: process.env.EMAIL_FROM || 'noreply@mova.com',
    },
};
