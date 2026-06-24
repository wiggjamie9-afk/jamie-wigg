import express, { Router } from 'express';

const router: Router = express.Router();

router.post('/', async (req, res) => {
  res.json({ message: 'coherence endpoint - Phase 1' });
});

router.get('/', async (req, res) => {
  res.json({ coherence: [] });
});

export default router;
