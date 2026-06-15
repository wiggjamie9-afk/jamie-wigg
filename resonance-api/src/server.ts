import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes (placeholder)
app.get('/api/v1/apps', (req, res) => {
  res.json([
    { id: 'bright-brains', name: 'Bright Brains' },
    { id: 'creators-daily', name: "Creator's Daily" },
    { id: 'steady', name: 'Steady' },
    { id: 'founders-brain', name: "Founder's Brain" },
    { id: 'animation-studio', name: 'Animation Studio' },
    { id: 'peak-performance', name: 'Peak Performance' },
    { id: 'music-lab', name: 'Music Lab' },
    { id: 'product-builder', name: 'Product Builder' },
    { id: 'learning-accelerator', name: 'Learning Accelerator' },
    { id: 'purpose-compass', name: 'Purpose Compass' },
    { id: 'mum-brain', name: 'Mum Brain' },
    { id: 'dad-brain', name: 'Dad Brain' },
    { id: 'abilities-brain', name: 'Abilities Brain' },
    { id: 'sleep', name: 'Sleep' },
    { id: 'relationships', name: 'Relationships' },
    { id: 'money', name: 'Money' },
    { id: 'sobriety', name: 'Sobriety' },
  ]);
});

// Error handling (placeholder)
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`RESONANCE API running on http://localhost:${PORT}`);
});
