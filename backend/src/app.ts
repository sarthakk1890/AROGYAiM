import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { morganMiddleware } from './config/morgan';
import { errorHandler } from './middleware/errorMiddleware';
import { swaggerSpec } from './config/swagger';
import { formatResponse } from './utils/response';
import { pool } from './db';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import physioRoutes from './routes/physioRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import rehabRoutes from './routes/rehabRoutes';
import notificationRoutes from './routes/notificationRoutes';

const app: Application = express();

// Security & Optimization Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Compress payloads


// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// Core Middlewares
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '10kb' })); // Limit body payload
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(morganMiddleware);

// Swagger Documentation
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Kubernetes-Style Probes
// Liveness Check (Is the server running?)
app.get('/api/v1/health/liveness', (req: Request, res: Response) => {
  res.status(200).json(formatResponse(true, 'Server is alive', { uptime: process.uptime() }));
});

// Readiness Check (Is the database connected and ready for traffic?)
app.get('/api/v1/health/readiness', async (req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json(formatResponse(true, 'System is ready'));
  } catch (error) {
    res.status(503).json(formatResponse(false, 'System is not ready (Database connection failed)'));
  }
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/physios', physioRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1', rehabRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json(formatResponse(false, 'Route not found'));
});

// Global Error Handler
app.use(errorHandler);

export default app;
