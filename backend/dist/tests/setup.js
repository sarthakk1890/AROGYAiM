"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolMock = void 0;
const jest_mock_extended_1 = require("jest-mock-extended");
const db_1 = require("../db");
jest.mock('../db', () => ({
    __esModule: true,
    pool: (0, jest_mock_extended_1.mockDeep)(),
}));
exports.poolMock = db_1.pool;
beforeEach(() => {
    (0, jest_mock_extended_1.mockReset)(exports.poolMock);
});
