import * as pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
  prettyPrint: true,
  base: null,
  timestamp: false,
});
