import request from 'supertest';
import app from '../app';
import { poolMock } from './setup';

describe('Health & Readiness Probes', () => {
  it('should return 200 for liveness check', async () => {
    const res = await request(app).get('/api/v1/health/liveness');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Server is alive');
  });

  it('should return 200 for readiness check when DB is connected', async () => {
    poolMock.query.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] } as any);
    
    const res = await request(app).get('/api/v1/health/readiness');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('System is ready');
  });

  it('should return 503 for readiness check when DB fails', async () => {
    poolMock.query.mockRejectedValueOnce(new Error('Connection failed'));
    
    const res = await request(app).get('/api/v1/health/readiness');
    expect(res.statusCode).toBe(503);
    expect(res.body.success).toBe(false);
  });
});
