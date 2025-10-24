import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: undefined, // Remove default fields like pid, hostname
  transport: process.env.NODE_ENV === 'development' 
    ? { target: 'pino-pretty' } 
    : undefined,
});
