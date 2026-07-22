# Production Security Checklist

Prior to launching the MOVA platform, verify that all security middleware and architectures are functioning.

## Infrastructure Security
- [x] **Helmet Enabled**: `helmet()` middleware is active in `app.ts` to set restrictive HTTP headers (HSTS, NoSniff, X-Frame-Options).
- [x] **CORS Locked Down**: `corsOrigin` is explicitly defined via environment variables.
- [x] **Graceful Shutdown**: `SIGTERM` and `SIGINT` signals correctly disconnect the Prisma DB and close HTTP sockets.

## Data & Input Security
- [x] **XSS Sanitization**: Ensure data is properly escaped before rendering (usually handled by the frontend framework like React/Vue).
- [x] **Payload Limits**: `express.json` is capped at `10kb` to prevent memory exhaustion attacks.
- [x] **Password Hashing**: `bcrypt` (with salt rounds >= 10) is used before persisting any passwords.
- [x] **SQL Injection Prevention**: Prisma ORM inherently parameterizes all queries, preventing SQLi. (Avoid using unparameterized `$queryRaw` strings).

## API & Abuse Protection
- [x] **Global Rate Limiting**: APIs are restricted to 200 requests per 15 minutes per IP.
- [x] **Authentication Rate Limiting**: The `/login` route is severely restricted to prevent brute force (e.g., 5 attempts per 15 mins).
- [x] **JWT Security**: Access tokens are short-lived. Refresh tokens are stored in **HttpOnly, Secure** cookies to mitigate XSS exfiltration.

## Monitoring & Health
- [x] **Liveness Probes**: `/api/v1/health/liveness` is available for container orchestration.
- [x] **Readiness Probes**: `/api/v1/health/readiness` performs a DB ping to verify systemic health.
