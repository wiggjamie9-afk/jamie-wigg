import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';
import { prisma, logger } from '../index';
import { getJwtSecret } from '../middleware/auth';

const router: Router = express.Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const oauthSchema = z.object({
  provider: z.enum(['apple', 'google']),
  idToken: z.string(),
});

// ============================================================================
// REGISTER
// ============================================================================

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, name, password } = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    // Initialize Twins for new user
    const twinTypes = ['task', 'coach', 'growth', 'health', 'relationship', 'financial', 'creative', 'research'];
    for (const twinType of twinTypes) {
      await prisma.twin.create({
        data: {
          userId: user.id,
          type: twinType,
          name: `${twinType.charAt(0).toUpperCase() + twinType.slice(1)} Twin`,
          personality: `I am your ${twinType} specialist. I help you with ${twinType} optimization and growth.`,
        },
      });
    }

    // Create knowledge graph
    await prisma.knowledgeGraph.create({
      data: {
        userId: user.id,
        nodes: {},
        edges: {},
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: '30d' }
    );

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    logger.error('Registration error', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ============================================================================
// LOGIN
// ============================================================================

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcryptjs.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: '30d' }
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    logger.error('Login error', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============================================================================
// OAUTH (Apple / Google)
// ============================================================================

router.post('/oauth', async (req: Request, res: Response) => {
  try {
    const { provider, idToken } = oauthSchema.parse(req.body);

    // TODO: Verify idToken with Apple/Google
    // This is a stub - in production, verify the token with the provider's API

    let user = await prisma.user.findFirst({
      where: provider === 'apple'
        ? { appleId: idToken }
        : { googleId: idToken },
    });

    if (!user) {
      // Create new user from OAuth
      user = await prisma.user.create({
        data: {
          email: `${provider}-${idToken.substring(0, 10)}@neural-twin.local`,
          name: `${provider} User`,
          [provider === 'apple' ? 'appleId' : 'googleId']: idToken,
        },
      });

      // Initialize Twins
      const twinTypes = ['task', 'coach', 'growth', 'health', 'relationship', 'financial', 'creative', 'research'];
      for (const twinType of twinTypes) {
        await prisma.twin.create({
          data: {
            userId: user.id,
            type: twinType,
            name: `${twinType.charAt(0).toUpperCase() + twinType.slice(1)} Twin`,
            personality: `I am your ${twinType} specialist.`,
          },
        });
      }

      await prisma.knowledgeGraph.create({
        data: {
          userId: user.id,
          nodes: {},
          edges: {},
        },
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: '30d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    logger.error('OAuth error', error);
    res.status(500).json({ error: 'OAuth authentication failed' });
  }
});

// ============================================================================
// VERIFY TOKEN
// ============================================================================

router.post('/verify', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, getJwtSecret()) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
