import express, { Router } from 'express';

const router: Router = express.Router();

router.post('/', async (req, res) => {
  res.json({ message: 'twins endpoint - Phase 1' });
});

router.get('/', async (req, res) => {
  res.json({ twins: [] });
});

export default router;
