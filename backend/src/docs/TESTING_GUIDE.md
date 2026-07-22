# MOVA Testing Guide

This project is configured to use **Jest** and **Supertest** for automated API integration testing.

## Prerequisites
Because the backend relies heavily on PostgreSQL (via Prisma), running true End-to-End integration tests requires a shadow or test database. 

Due to the lack of Docker in the initial environment, the test suites (`src/tests/*.test.ts`) are currently configured to use `jest-mock-extended` to mock the Prisma Client. 

## Running Tests

To run the automated test suite, ensure your dependencies are installed, then run:

```bash
npm test
```

### Known Issues
If you encounter a `TypeError: Cannot read properties of undefined (reading 'fileExists')` originating from `ts-jest`, it is due to a peer-dependency mismatch between `ts-jest` and the installed version of `typescript`. 
**Fix**: Downgrade typescript to `^5.x` in your `package.json` and reinstall:
```bash
npm install -D typescript@5.2.2
```

## Adding New Tests
1. Create a new file in `src/tests/` ending in `.test.ts`.
2. Import `prismaMock` from `src/tests/setup.ts` to mock database calls.
3. Import your Express `app` and wrap it in `request(app)` using Supertest to simulate HTTP requests.
