import { Pool } from 'pg';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import { pool } from '../db';

jest.mock('../db', () => ({
  __esModule: true,
  pool: mockDeep<Pool>(),
}));

export const poolMock = pool as unknown as DeepMockProxy<Pool>;

beforeEach(() => {
  mockReset(poolMock);
});
