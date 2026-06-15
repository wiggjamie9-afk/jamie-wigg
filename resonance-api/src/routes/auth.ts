import { Router, Request, Response } from 'express';
import { authService } from '../services/auth.js';

const router = Router();

// POST /api/v1/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // TODO: Check if user exists, create in database
    const passwordHash = await authService.hashPassword(password);

    const { accessToken, refreshToken } = authService.generateTokens(
      `user_${Date.now()}`,
      email
    );

    res.status(201).json({
      userId: `user_${Date.now()}`,
      email,
      displayName,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // TODO: Fetch user from database, verify password hash
    const { accessToken, refreshToken } = authService.generateTokens(
      `user_${Date.now()}`,
      email
    );

    res.json({
      userId: `user_${Date.now()}`,
      email,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// POST /api/v1/auth/refresh
router.post('/refresh', (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const accessToken = authService.refreshAccessToken(refreshToken);

    if (!accessToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// POST /api/v1/auth/voice-verify
router.post('/voice-verify', async (req: Request, res: Response) => {
  try {
    const { audioBuffer, userId, threshold } = req.body;

    // TODO: Fetch stored voice fingerprint from database
    // const storedFingerprint = await db.getVoiceFingerprint(userId);

    // const isValid = await authService.verifyVoiceBiometric(
    //   Buffer.from(audioBuffer),
    //   storedFingerprint,
    //   threshold
    // );

    // For now, mock response
    const isValid = Math.random() > 0.2; // 80% match rate

    if (!isValid) {
      return res.status(401).json({ error: 'Voice verification failed' });
    }

    const { accessToken, refreshToken } = authService.generateTokens(userId, 'user@example.com');

    res.json({
      verified: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: 'Voice verification failed' });
  }
});

// POST /api/v1/auth/voice-enroll
router.post('/voice-enroll', async (req: Request, res: Response) => {
  try {
    const { audioBuffer, userId } = req.body;

    // TODO: Store voice fingerprint in database
    const fingerprint = await authService.createVoiceFingerprint(Buffer.from(audioBuffer));

    res.status(201).json({
      enrolled: true,
      fingerprintId: 'fp_' + Date.now(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Voice enrollment failed' });
  }
});

// POST /api/v1/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  // In a real app, invalidate token on server
  res.json({ message: 'Logout successful' });
});

export default router;
