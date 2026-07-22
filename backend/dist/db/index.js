"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTransaction = exports.pool = void 0;
const pg_1 = require("pg");
const env_1 = require("../config/env");
exports.pool = new pg_1.Pool({
    connectionString: env_1.env.dbUrl,
});
const withTransaction = async (callback) => {
    const client = await exports.pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
};
exports.withTransaction = withTransaction;
