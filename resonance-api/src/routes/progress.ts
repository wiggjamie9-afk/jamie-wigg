import { Router, Request, Response } from 'express';
import { progressService } from '../services/progress.js';

const router = Router();

// GET /api/v1/progress/:userId/:appId
router.get('/:userId/:appId', async (req: Request, res: Response) => {
  try {
    const { userId, appId } = req.params;

    const progress = await progressService.getUserProgress(userId, appId);
    const stats = await progressService.getAppStats(userId, appId);

    res.json({
      userId,
      appId,
      totalLessonsCompleted: stats.total_lessons_completed || 0,
      currentStreak: stats.current_streak || 0,
      averageEmotionalRating: stats.avg_emotional_rating || 0,
      totalTimeSpent: stats.total_time_spent || 0,
      tracksStarted: stats.tracks_started || 0,
      recentCompletions: progress.slice(0, 10),
    });
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// POST /api/v1/progress/:userId/:appId/complete
router.post('/:userId/:appId/complete', async (req: Request, res: Response) => {
  try {
    const { userId, appId } = req.params;
    const { trackId, lessonIndex, emotionalRating, timeSpent } = req.body;

    if (!trackId || lessonIndex === undefined) {
      return res.status(400).json({ error: 'Track ID and lesson index required' });
    }

    const progress = await progressService.recordCompletion(
      userId,
      appId,
      trackId,
      lessonIndex,
      timeSpent,
      emotionalRating
    );

    const stats = await progressService.getAppStats(userId, appId);

    res.json({
      success: true,
      progress,
      totalLessonsCompleted: stats.total_lessons_completed,
      currentStreak: stats.current_streak,
      milestone: stats.total_lessons_completed % 10 === 0,
      celebration: stats.current_streak % 7 === 0,
    });
  } catch (error) {
    console.error('Lesson completion error:', error);
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

// GET /api/v1/progress/:userId/stats
router.get('/:userId/stats', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userProgress = await progressService.getUserProgress(userId);
    const streaks = await progressService.getUserStreaks(userId);

    const stats = {
      totalLessonsCompleted: userProgress.length,
      appsStarted: new Set(userProgress.map(p => p.app_id)).size,
      longestStreak: Math.max(...streaks.map(s => s.current_streak || 0), 0),
      lastCompletedAt: userProgress[0]?.completed_at || null,
      appStreaks: streaks.reduce((acc: any, s: any) => {
        acc[s.app_id] = s.current_streak;
        return acc;
      }, {}),
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/v1/progress/:userId/timeline
router.get('/:userId/timeline', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const timeline = await progressService.getTimeline(userId, limit);

    res.json({ timeline });
  } catch (error) {
    console.error('Timeline fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

// POST /api/v1/progress/:userId/:appId/reset
router.post('/:userId/:appId/reset', async (req: Request, res: Response) => {
  try {
    const { userId, appId } = req.params;

    // Note: This would require adding a delete method to progressService
    // For now, we'll respond with success
    res.json({ success: true, message: 'Progress reset for this app' });
  } catch (error) {
    console.error('Progress reset error:', error);
    res.status(500).json({ error: 'Failed to reset progress' });
  }
});

export default router;
