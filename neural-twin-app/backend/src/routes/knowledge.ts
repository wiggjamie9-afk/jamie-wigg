import express, { Router } from 'express';

const router: Router = express.Router();

router.post('/', async (req, res) => {
  res.json({ message: 'knowledge endpoint - Phase 1' });
});

router.get('/', async (req, res) => {
  res.json({ knowledge: [] });
});

export default router;
