# MOVA Deployment Guide

This guide details how to deploy the MOVA backend architecture into a production environment.

## Infrastructure Requirements
- **Node.js**: v18+
- **PostgreSQL**: v15+
- **Redis**: v7+ (if configured for caching/sessions later)
- **Docker & Docker Compose** (Recommended for orchestration)

## Deployment Steps

### 1. Environment Configuration
Ensure your production server has a securely configured `.env` file containing all production credentials (see `ENVIRONMENT_SETUP.md`).
- **Critical**: Ensure `NODE_ENV=production`.
- **Critical**: Generate strong `JWT_SECRET` and `JWT_REFRESH_SECRET` keys (at least 64 chars).

### 2. Database Migrations
You must run Prisma migrations against your production database before starting the application:
```bash
npx prisma migrate deploy
```
*(Do NOT use `migrate dev` in production).*

### 3. Build & Run
Compile the TypeScript code and start the server:
```bash
npm run build
npm start
```
The server is configured to utilize `helmet`, `compression`, and graceful shutdown handlers natively.

### 4. Reverse Proxy & SSL (Nginx / Load Balancer)
- Ensure the Node.js application is placed behind a reverse proxy like Nginx or an AWS Application Load Balancer.
- Terminate SSL (HTTPS) at the proxy layer.
- Ensure the proxy forwards `X-Forwarded-For` headers so `express-rate-limit` can accurately track client IPs.
