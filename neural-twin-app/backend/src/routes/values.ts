import express, { Router } from 'express';

const router: Router = express.Router();

router.post('/', async (req, res) => {
  res.json({ message: 'values endpoint - Phase 1' });
});

router.get('/', async (req, res) => {
  res.json({ values: [] });
});

export default router;
