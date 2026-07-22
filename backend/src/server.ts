import app from './app';
import { env } from './config/env';
import logger from './config/logger';
import { pool } from './db';

const server = app.listen(env.port, () => {
  logger.info(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
});

// Graceful Shutdown Logic
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await pool.end();
      logger.info('Database connection closed.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during database disconnection:', err);
      process.exit(1);
    }
  });

  // Force close after 10 seconds if not gracefully closed
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', reason);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
  gracefulShutdown('uncaughtException');
});

export default server;
