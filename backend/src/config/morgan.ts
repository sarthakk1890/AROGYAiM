import morgan from 'morgan';
import logger from './logger';
import { env } from './env';

const stream = {
  write: (message: string) => logger.http(message.trim()),
};

const skip = () => {
  const envLevel = env.nodeEnv || 'development';
  return envLevel !== 'development';
};

export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);
