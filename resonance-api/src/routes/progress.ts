import { Router, Request, Response } from 'express';

const router = Router();

// Mock database for progress
const progressData: Record<string, any> = {};

// GET /api/v1/progress/:userId/:appId
router.get('/:userId/:appId', (req: Request, res: Response) => {
  try {
    const { userId, appId } = req.params;
    const key = `${userId}_${appId}`;

    const progress = progressData[key] || {
      userId,
      appId,
      tracks: [
        { trackId: 'track-1', completedLessons: 0, currentLesson: 0, streakDays: 0 },
        { trackId: 'track-2', completedLessons: 0, currentLesson: 0, streakDays: 0 },
        { trackId: 'track-3', completedLessons: 0, currentLesson: 0, streakDays: 0 },
        { trackId: 'track-4', completedLessons: 0, currentLesson: 0, streakDays: 0 },
      ],
      totalLessonsCompleted: 0,
      streak: 0,
      lastCompletedAt: null,
    };

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// POST /api/v1/progress/:userId/:appId/complete
router.post('/:userId/:appId/complete', (req: Request, res: Response) => {
  try {
    const { userId, appId } = req.params;
    const { trackId, lessonIndex, emotionalRating, timeSpent } = req.body;

    const key = `${userId}_${appId}`;
    const progress = progressData[key] || {
      userId,
      appId,
      tracks: [
        { trackId: 'track-1', completedLessons: 0, currentLesson: 0, streakDays: 0 },
        { trackId: 'track-2', completedLessons: 0, currentLesson: 0, streakDays: 0 },
        { trackId: 'track-3', completedLessons: 0, currentLesson: 0, streakDays: 0 },
        { trackId: 'track-4', completedLessons: 0, currentLesson: 0, streakDays: 0 },
      ],
      totalLessonsCompleted: 0,
      streak: 0,
      lastCompletedAt: null,
    };

    const track = progress.tracks.find((t: any) => t.trackId === trackId);
    if (track) {
      track.currentLesson = lessonIndex + 1;
      if (lessonIndex === 4) {
        track.completedLessons = 5;
      } else {
        track.completedLessons = Math.max(track.completedLessons, lessonIndex + 1);
      }
    }

    progress.totalLessonsCompleted += 1;
    progress.lastCompletedAt = new Date();

    // Simple streak logic
    const lastCompletion = new Date(progress.lastCompletedAt);
    const today = new Date();
    const daysDiff = Math.floor(
      (today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0 || daysDiff === 1) {
      progress.streak += 1;
    } else {
      progress.streak = 1;
    }

    progressData[key] = progress;

    res.json({
      success: true,
      progress,
      milestone: progress.totalLessonsCompleted % 10 === 0 ? 'milestone' : null,
      celebration: progress.streak % 7 === 0 ? 'week-achieved' : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

// GET /api/v1/progress/:userId/stats
router.get('/:userId/stats', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userProgress = Object.values(progressData).filter((p: any) => p.userId === userId);

    const stats = {
      totalLessonsCompleted: userProgress.reduce((sum: number, p: any) => sum + p.totalLessonsCompleted, 0),
      appsStarted: userProgress.length,
      longestStreak: Math.max(...userProgress.map((p: any) => p.streak || 0), 0),
      lastCompletedAt: userProgress
        .map((p: any) => new Date(p.lastCompletedAt || 0))
        .sort((a, b) => b.getTime() - a.getTime())[0] || null,
      consistency: {
        thisWeek: Math.floor(Math.random() * 7),
        thisMonth: Math.floor(Math.random() * 30),
      },
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/v1/progress/:userId/:appId/timeline
router.get('/:userId/:appId/timeline', (req: Request, res: Response) => {
  try {
    const { userId, appId } = req.params;

    const timeline = Array.from({ length: 30 }).map((_, i) => ({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lessonsCompleted: Math.floor(Math.random() * 4),
      appId,
    }));

    res.json({ timeline });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

// POST /api/v1/progress/:userId/:appId/reset
router.post('/:userId/:appId/reset', (req: Request, res: Response) => {
  try {
    const { userId, appId } = req.params;
    const key = `${userId}_${appId}`;

    delete progressData[key];

    res.json({ success: true, message: 'Progress reset for this app' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset progress' });
  }
});

export default router;
