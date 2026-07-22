"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = __importDefault(require("./config/logger"));
const db_1 = require("./db");
const server = app_1.default.listen(env_1.env.port, () => {
    logger_1.default.info(`Server running on port ${env_1.env.port} in ${env_1.env.nodeEnv} mode`);
});
// Graceful Shutdown Logic
const gracefulShutdown = async (signal) => {
    logger_1.default.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
        logger_1.default.info('HTTP server closed.');
        try {
            await db_1.pool.end();
            logger_1.default.info('Database connection closed.');
            process.exit(0);
        }
        catch (err) {
            logger_1.default.error('Error during database disconnection:', err);
            process.exit(1);
        }
    });
    // Force close after 10 seconds if not gracefully closed
    setTimeout(() => {
        logger_1.default.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
exports.default = server;
