import { Router, Request, Response } from 'express';
import { authService } from '../services/auth.js';
import { userService } from '../services/user.js';

const router = Router();

// POST /api/v1/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user in database
    const user = await userService.createUser({
      email,
      password,
      displayName,
    });

    const { accessToken, refreshToken } = authService.generateTokens(user.id, email);

    res.status(201).json({
      userId: user.id,
      email: user.email,
      displayName: user.display_name,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Signup error:', error);
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

    // Fetch user from database
    const user = await userService.getUserWithPassword(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await authService.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    await userService.updateLastActive(user.id);

    const { accessToken, refreshToken } = authService.generateTokens(user.id, email);

    res.json({
      userId: user.id,
      email: user.email,
      displayName: user.display_name,
      subscriptionStatus: user.subscription_status,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
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
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// POST /api/v1/auth/voice-verify
router.post('/voice-verify', async (req: Request, res: Response) => {
  try {
    const { audioBuffer, userId, threshold } = req.body;

    if (!audioBuffer || !userId) {
      return res.status(400).json({ error: 'Audio buffer and user ID required' });
    }

    // Fetch stored voice fingerprint from database
    const storedFingerprint = await userService.getVoiceFingerprint(userId);
    if (!storedFingerprint) {
      return res.status(401).json({ error: 'Voice not enrolled' });
    }

    // Verify voice biometric
    const isValid = await authService.verifyVoiceBiometric(
      Buffer.from(audioBuffer),
      storedFingerprint,
      threshold || 0.85
    );

    if (!isValid) {
      return res.status(401).json({ error: 'Voice verification failed' });
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const { accessToken, refreshToken } = authService.generateTokens(userId, user.email);

    res.json({
      verified: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Voice verify error:', error);
    res.status(500).json({ error: 'Voice verification failed' });
  }
});

// POST /api/v1/auth/voice-enroll
router.post('/voice-enroll', async (req: Request, res: Response) => {
  try {
    const { audioBuffer, userId } = req.body;

    if (!audioBuffer || !userId) {
      return res.status(400).json({ error: 'Audio buffer and user ID required' });
    }

    // Create voice fingerprint
    const fingerprint = await authService.createVoiceFingerprint(Buffer.from(audioBuffer));

    // Store in database
    await userService.storeVoiceFingerprint(userId, fingerprint);

    res.status(201).json({
      enrolled: true,
      message: 'Voice enrolled successfully',
    });
  } catch (error) {
    console.error('Voice enroll error:', error);
    res.status(500).json({ error: 'Voice enrollment failed' });
  }
});

// POST /api/v1/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logout successful' });
});

export default router;
