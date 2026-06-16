import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/index.js';
import { authService } from './services/auth.js';
import { errorHandler } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import appRoutes from './routes/apps.js';
import progressRoutes from './routes/progress.js';
import biometricRoutes from './routes/biometrics.js';
import chatRoutes from './routes/chat.js';
import voiceRoutes from './routes/voice.js';
import subscriptionRoutes from './routes/subscription.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Authentication middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decoded = authService.verifyAccessToken(token);
    if (decoded) {
      (req as any).user = decoded;
    }
  }
  next();
});

// Health check
app.get('/health', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

// API Routes v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/apps', appRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/biometrics', biometricRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/voice', voiceRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`RESONANCE API running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api/v1`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log(`Database: ${process.env.DATABASE_URL || 'localhost'}`);
});
