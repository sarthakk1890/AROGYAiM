# MOVA Backend Documentation

Welcome to the MOVA Backend platform documentation. This API is built with Node.js, Express, TypeScript, PostgreSQL, Prisma, and Redis.

## System Architecture

The architecture follows a modular, feature-based layering approach to ensure scalability and maintainability:

- **Routes (`src/routes`)**: Define API endpoints and attach middleware/controllers.
- **Controllers (`src/controllers`)**: Handle HTTP requests and responses. They should be lean, parsing requests and delegating to services.
- **Services (`src/services`)**: Core business logic. 
- **Repositories (`src/repositories`)**: Abstraction layer over Prisma ORM for database queries.
- **Models/Types (`src/models`, `src/types`, `src/interfaces`)**: TypeScript interfaces and types.
- **Config (`src/config`)**: Environment, logger, swagger, and third-party setups.
- **Utils (`src/utils`)**: Reusable utilities for response formatting, date handling, etc.

## Folder Structure

```
src/
├── config/        # Setup for logger, swagger, env vars
├── constants/     # Global enums, constant variables
├── controllers/   # Request handlers
├── docs/          # Project documentation (this file)
├── interfaces/    # Typescript interfaces
├── jobs/          # Background worker tasks
├── middleware/    # Auth, Roles, Validation, Error Handling
├── models/        # Application data structures/models
├── prisma/        # Prisma schema and migrations
├── repositories/  # Database access layer
├── routes/        # API route definitions
├── services/      # Business logic operations
├── sockets/       # WebSocket event handlers
├── types/         # Custom Typescript types
├── uploads/       # Temp storage for uploads
├── utils/         # Helpers (pagination, asyncWrapper, response)
├── validators/    # express-validator schemas
├── app.ts         # Express App configuration
└── server.ts      # Main server entrypoint
```

## Request Lifecycle

`Client Request -> Route -> Middleware (Auth/Role/Validate) -> Controller -> Service -> Repository -> Database`

## Standard API Response Format

All successful and failed responses follow a uniform structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "errors": null,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 50,
    "totalPages": 5
  }
}
```

## Utilities Usage Guide

### asyncWrapper
Replaces `try-catch` blocks in controllers.
```typescript
import { asyncWrapper } from '../utils/asyncWrapper';

export const getUser = asyncWrapper(async (req, res) => {
  const user = await userService.findById(req.params.id);
  res.json(formatResponse(true, 'User found', user));
});
```

### pagination
```typescript
import { getPaginationOptions, getPaginationData } from '../utils/pagination';

const { skip, take, page, limit } = getPaginationOptions(req);
const users = await prisma.user.findMany({ skip, take });
const pagination = getPaginationData(totalCount, page, limit);
```

## Setup & Docker

1. Clone repo, run `npm install`.
2. Ensure Docker is running.
3. Run `docker-compose up -d` to start Postgres and Redis.
4. Run `npm run dev` to start the backend server locally.
