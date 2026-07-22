import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';

// Fail fast in production rather than silently booting with a guessable JWT secret
// or no database connection string.
if (nodeEnv === 'production') {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'CORS_ORIGIN'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s) in production: ${missing.join(', ')}`);
  }
}

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  dbUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  // Comma-separated list of allowed origins; never falls back to '*' since the API
  // is used with credentialed (cookie-based) requests, which browsers reject for wildcard origins.
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((o) => o.trim()),
  email: {
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@mova.com',
  },
};
