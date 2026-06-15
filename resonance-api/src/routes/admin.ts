import { Router, Request, Response } from 'express';

const router = Router();

// Middleware to check admin role (placeholder)
const requireAdmin = (req: Request, res: Response, next: any) => {
  // TODO: Check JWT token for admin role
  next();
};

router.use(requireAdmin);

// GET /api/v1/admin/dashboard
router.get('/dashboard', (req: Request, res: Response) => {
  try {
    const dashboard = {
      activeUsers: Math.floor(Math.random() * 10000) + 100,
      dailyActiveUsers: Math.floor(Math.random() * 5000) + 50,
      lessonsCompleted: Math.floor(Math.random() * 50000) + 1000,
      totalRevenue: Math.floor(Math.random() * 100000) + 10000,
      conversionRate: (Math.random() * 0.1 + 0.02).toFixed(2),
      averageRetention: (Math.random() * 0.3 + 0.6).toFixed(2),
      topApps: [
        { id: 'mum-brain', users: 523, lessonsCompleted: 2341 },
        { id: 'sleep', users: 421, lessonsCompleted: 1892 },
        { id: 'relationships', users: 387, lessonsCompleted: 1654 },
      ],
      revenueByTier: {
        free: Math.random() * 50000,
        pro: Math.random() * 30000,
        'pro-plus': Math.random() * 15000,
        lifetime: Math.random() * 10000,
      },
    };

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET /api/v1/admin/users
router.get('/users', (req: Request, res: Response) => {
  try {
    const { limit = 50, offset = 0, search } = req.query;

    // Mock user list
    const users = Array.from({ length: parseInt(limit as string, 10) }).map((_, i) => ({
      id: `user_${i}`,
      email: `user${i}@example.com`,
      displayName: `User ${i}`,
      subscriptionStatus: ['free', 'pro', 'pro-plus', 'lifetime'][Math.floor(Math.random() * 4)],
      lessonsCompleted: Math.floor(Math.random() * 100),
      lastActiveAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    }));

    res.json({
      total: 10000,
      limit,
      offset,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/v1/admin/users/:userId
router.get('/users/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = {
      id: userId,
      email: `${userId}@example.com`,
      displayName: 'User Name',
      subscriptionStatus: 'pro',
      lessonsCompleted: 42,
      lastActiveAt: new Date(),
      appsStarted: ['mum-brain', 'sleep', 'relationships'],
      progressByApp: {
        'mum-brain': { completed: 12, total: 20 },
        sleep: { completed: 8, total: 20 },
        relationships: { completed: 6, total: 20 },
      },
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    };

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// POST /api/v1/admin/users/:userId/send-message
router.post('/users/:userId/send-message', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { subject, message } = req.body;

    // TODO: Send email via SendGrid

    res.json({
      success: true,
      message: `Message sent to ${userId}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET /api/v1/admin/analytics
router.get('/analytics', (req: Request, res: Response) => {
  try {
    const { range = '30d' } = req.query;

    const analytics = {
      range,
      dates: Array.from({ length: 30 }).map((_, i) => {
        const date = new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000);
        return {
          date: date.toISOString().split('T')[0],
          activeUsers: Math.floor(Math.random() * 1000) + 100,
          lessonsCompleted: Math.floor(Math.random() * 5000) + 500,
          newSubscriptions: Math.floor(Math.random() * 50),
          revenue: Math.floor(Math.random() * 5000) + 500,
        };
      }),
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// PUT /api/v1/admin/content/:appId/:trackId/:lessonId
router.put('/content/:appId/:trackId/:lessonId', (req: Request, res: Response) => {
  try {
    const { appId, trackId, lessonId } = req.params;
    const { title, body, affirmation, strength, audioEmotionalTone } = req.body;

    // TODO: Update lesson content in database

    res.json({
      success: true,
      lesson: {
        id: lessonId,
        appId,
        trackId,
        title,
        affirmation,
        strength,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// POST /api/v1/admin/content/:appId/:trackId
router.post('/content/:appId/:trackId', (req: Request, res: Response) => {
  try {
    const { appId, trackId } = req.params;
    const { lessonIndex, title, body, affirmation, strength } = req.body;

    // TODO: Create new lesson

    res.status(201).json({
      success: true,
      lesson: {
        id: `lesson_${Date.now()}`,
        appId,
        trackId,
        index: lessonIndex,
        title,
        affirmation,
        strength,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// GET /api/v1/admin/reports
router.get('/reports', (req: Request, res: Response) => {
  try {
    const reports = [
      {
        id: 'monthly-retention',
        name: 'Monthly Retention Rate',
        value: '67.3%',
        trend: 'up',
      },
      {
        id: 'lesson-completion',
        name: 'Average Lesson Completion Rate',
        value: '73.2%',
        trend: 'stable',
      },
      {
        id: 'app-satisfaction',
        name: 'App Satisfaction Score',
        value: '4.6/5',
        trend: 'up',
      },
      {
        id: 'mrr',
        name: 'Monthly Recurring Revenue',
        value: '$45,230',
        trend: 'up',
      },
    ];

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

export default router;
