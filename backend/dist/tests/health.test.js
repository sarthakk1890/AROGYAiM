"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const setup_1 = require("./setup");
describe('Health & Readiness Probes', () => {
    it('should return 200 for liveness check', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/health/liveness');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Server is alive');
    });
    it('should return 200 for readiness check when DB is connected', async () => {
        setup_1.poolMock.query.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });
        const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/health/readiness');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('System is ready');
    });
    it('should return 503 for readiness check when DB fails', async () => {
        setup_1.poolMock.query.mockRejectedValueOnce(new Error('Connection failed'));
        const res = await (0, supertest_1.default)(app_1.default).get('/api/v1/health/readiness');
        expect(res.statusCode).toBe(503);
        expect(res.body.success).toBe(false);
    });
});
