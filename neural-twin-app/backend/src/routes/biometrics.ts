import express, { Router } from 'express';

const router: Router = express.Router();

router.post('/', async (req, res) => {
  res.json({ message: 'biometrics endpoint - Phase 1' });
});

router.get('/', async (req, res) => {
  res.json({ biometrics: [] });
});

export default router;
