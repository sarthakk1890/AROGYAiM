# MOVA API Documentation

This backend exposes a RESTful API versioned at `/api/v1`. 
For interactive documentation, parameters, and testing payloads, please visit the Swagger UI at:
**`http://localhost:5000/api/v1/docs`**

## Core Modules

### Authentication (`/api/v1/auth`)
Handles secure Registration (Patient/Physiotherapist), Login, Logout, and JWT Refresh cycles.
- **Security**: Strict rate limiting (5 per 15m), bcrypt hashing, and HTTP-only cookie refresh tokens.

### Users (`/api/v1/users`)
Handles Profile management and Admin controls.
- **Security**: Restricted by Role middleware. Only Admins can suspend or activate users.

### Appointments (`/api/v1/appointments`)
Handles scheduling, availability tracking, and conflict detection.
- **Security**: Validates that start times fall within working hours and prevents double-booking using DB conflict lookups.

### Rehabilitation (`/api/v1/rehabilitation` & `/api/v1/exercises`)
Manages the global exercise library and patient rehabilitation plans.
- **Security**: Strict versioning scheme ensures previously assigned plans are never overwritten; modifications always spawn new Draft versions.

### Notifications (`/api/v1/notifications`)
Unified notification center and preference management.
- **Security**: Supports pagination, sorting, and user-scoped viewing.

## Standard Response Format
Every endpoint strictly adheres to this JSON structure:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "errors": [],
  "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```
