import express, { Router } from 'express';

const router: Router = express.Router();

router.post('/', async (req, res) => {
  const userId = req.userId!;
  res.json({ message: 'values endpoint - Phase 1' });
});

router.get('/', async (req, res) => {
  const userId = req.userId!;
  res.json({ values: [] });
});

export default router;
