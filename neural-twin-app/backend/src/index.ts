import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

import { PrismaClient } from '@prisma/client';

// Routers
import authRouter from './routes/auth';
import voiceRouter from './routes/voice';
import decisionsRouter from './routes/decisions';
import valuesRouter from './routes/values';
import knowledgeRouter from './routes/knowledge';
import twinsRouter from './routes/twins';
import biometricsRouter from './routes/biometrics';
import coherenceRouter from './routes/coherence';
import accessibilityRouter from './routes/accessibility';

// Middleware
import { requireAuth } from './middleware/auth';

// Logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export const prisma = new PrismaClient();
export { logger };

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(helmet());
// CORS: a literal '*' origin is invalid together with credentials:true. When
// CORS_ORIGIN is unset we reflect the request origin (origin:true); in
// production set CORS_ORIGIN to a comma-separated allowlist of app origins.
const corsOrigin = process.env.CORS_ORIGIN;
app.use(cors({
  origin: corsOrigin ? corsOrigin.split(',').map((o) => o.trim()) : true,
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(503).json({ status: 'unhealthy', error: String(error) });
  }
});

// ============================================================================
// API ROUTES
// ============================================================================

// Auth (login, register, token refresh) — public
app.use('/api/auth', authRouter);

// All routes below require a valid JWT. requireAuth attaches req.userId, which
// the routes use as the acting user instead of trusting a client-supplied id.

// Phase 1: Foundation data
app.use('/api/voice', requireAuth, voiceRouter);
app.use('/api/decisions', requireAuth, decisionsRouter);
app.use('/api/values', requireAuth, valuesRouter);
app.use('/api/knowledge', requireAuth, knowledgeRouter);

// Phase 2: Twins
app.use('/api/twins', requireAuth, twinsRouter);

// Phase 3: Biometrics
app.use('/api/biometrics', requireAuth, biometricsRouter);

// Phase 4: Coherence
app.use('/api/coherence', requireAuth, coherenceRouter);

// Accessibility: book scanning (Claude Vision OCR), TTS, reader settings
app.use('/api/accessibility', requireAuth, accessibilityRouter);

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// ============================================================================
// SERVER START
// ============================================================================

const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(PORT, () => {
      logger.info(`Neural Twin backend running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
