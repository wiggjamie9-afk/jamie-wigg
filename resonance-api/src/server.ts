import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`RESONANCE API running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api/v1`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
});
