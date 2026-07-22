"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const xss = require('xss-clean');
const env_1 = require("./config/env");
const morgan_1 = require("./config/morgan");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const swagger_1 = require("./config/swagger");
const response_1 = require("./utils/response");
const db_1 = require("./db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const rehabRoutes_1 = __importDefault(require("./routes/rehabRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const app = (0, express_1.default)();
// Security & Optimization Middlewares
app.use((0, helmet_1.default)()); // Secure HTTP headers
app.use((0, compression_1.default)()); // Compress payloads
app.use(xss()); // Sanitize inputs against XSS
// Global Rate Limiting
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', globalLimiter);
// Core Middlewares
app.use((0, cors_1.default)({ origin: env_1.env.corsOrigin, credentials: true }));
app.use(express_1.default.json({ limit: '10kb' })); // Limit body payload
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
app.use((0, cookie_parser_1.default)());
app.use(morgan_1.morganMiddleware);
// Swagger Documentation
app.use('/api/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Kubernetes-Style Probes
// Liveness Check (Is the server running?)
app.get('/api/v1/health/liveness', (req, res) => {
    res.status(200).json((0, response_1.formatResponse)(true, 'Server is alive', { uptime: process.uptime() }));
});
// Readiness Check (Is the database connected and ready for traffic?)
app.get('/api/v1/health/readiness', async (req, res) => {
    try {
        await db_1.pool.query('SELECT 1');
        res.status(200).json((0, response_1.formatResponse)(true, 'System is ready'));
    }
    catch (error) {
        res.status(503).json((0, response_1.formatResponse)(false, 'System is not ready (Database connection failed)'));
    }
});
// API Routes
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/appointments', appointmentRoutes_1.default);
app.use('/api/v1', rehabRoutes_1.default);
app.use('/api/v1/notifications', notificationRoutes_1.default);
// 404 Handler
app.use((req, res) => {
    res.status(404).json((0, response_1.formatResponse)(false, 'Route not found'));
});
// Global Error Handler
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
