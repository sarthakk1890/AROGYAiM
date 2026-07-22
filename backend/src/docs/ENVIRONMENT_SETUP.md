# Environment Setup Guide

To run the MOVA backend successfully, your `.env` file requires strict configurations. The `src/config/env.ts` file acts as a gatekeeper, throwing startup errors if critical variables are missing.

## Required Variables

```env
# Application Settings
NODE_ENV=development
PORT=5000

# Database Settings
# (Ensure your password and DB name match your PostgreSQL instance)
DATABASE_URL="postgresql://user:password@localhost:5432/mova?schema=public"

# Security & CORS
CORS_ORIGIN=http://localhost:3000

# JWT Secrets (Generate secure random strings for production)
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=super_secret_refresh_key
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (Nodemailer setup)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_ethereal_user
EMAIL_PASS=your_ethereal_pass
EMAIL_FROM=noreply@mova.com
```

## Setup Instructions
1. Copy the `.env.example` (or the block above) to `.env` in the `backend/` directory.
2. Fill in the `DATABASE_URL` corresponding to your local or remote PostgreSQL DB.
3. Restart the server (`npm run dev`).
