import { Router, Request, Response } from 'express';
import type { App, Lesson } from '../types/index.js';

const router = Router();

const appsData: App[] = [
  {
    id: 'bright-brains',
    name: 'Bright Brains',
    description: 'Learning acceleration for neurodiversity',
    tracks: [],
    readAloudRate: 0.95,
    theme: 'light',
    accentColor: '#6366f1',
  },
  {
    id: 'mum-brain',
    name: 'Mum Brain',
    description: 'Neurobiology of parenting & maternal health',
    tracks: [],
    readAloudRate: 0.90,
    theme: 'light',
    accentColor: '#fbbf24',
  },
  {
    id: 'dad-brain',
    name: 'Dad Brain',
    description: 'Paternal presence, strength & connection',
    tracks: [],
    readAloudRate: 0.92,
    theme: 'light',
    accentColor: '#60a5fa',
  },
  {
    id: 'abilities-brain',
    name: 'Abilities Brain',
    description: 'Neurodiversity & disability justice',
    tracks: [],
    readAloudRate: 0.95,
    theme: 'light',
    accentColor: '#10b981',
  },
  {
    id: 'sleep',
    name: 'Sleep',
    description: 'Circadian rhythms & restorative rest',
    tracks: [],
    readAloudRate: 0.85,
    theme: 'dark',
    accentColor: '#8b5cf6',
  },
  {
    id: 'relationships',
    name: 'Relationships',
    description: 'Attachment theory & emotional connection',
    tracks: [],
    readAloudRate: 0.92,
    theme: 'light',
    accentColor: '#ec4899',
  },
  {
    id: 'money',
    name: 'Money',
    description: 'Behavioral economics & financial freedom',
    tracks: [],
    readAloudRate: 0.93,
    theme: 'light',
    accentColor: '#10b981',
  },
  {
    id: 'sobriety',
    name: 'Sobriety',
    description: 'Recovery psychology & identity reconstruction',
    tracks: [],
    readAloudRate: 0.92,
    theme: 'light',
    accentColor: '#06b6d4',
  },
];

// GET /api/v1/apps
router.get('/', (req: Request, res: Response) => {
  try {
    const apps = appsData.map(app => ({
      id: app.id,
      name: app.name,
      description: app.description,
      theme: app.theme,
      accentColor: app.accentColor,
      trackCount: 4,
      lessonCount: 20,
      readAloudRate: app.readAloudRate,
    }));

    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch apps' });
  }
});

// GET /api/v1/apps/:appId
router.get('/:appId', (req: Request, res: Response) => {
  try {
    const { appId } = req.params;
    const app = appsData.find(a => a.id === appId);

    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    res.json({
      id: app.id,
      name: app.name,
      description: app.description,
      theme: app.theme,
      accentColor: app.accentColor,
      readAloudRate: app.readAloudRate,
      tracks: [
        { id: 'track-1', name: 'Foundation', lessons: [] },
        { id: 'track-2', name: 'Deepening', lessons: [] },
        { id: 'track-3', name: 'Integration', lessons: [] },
        { id: 'track-4', name: 'Mastery', lessons: [] },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch app details' });
  }
});

// GET /api/v1/apps/:appId/lessons/:trackId
router.get('/:appId/lessons/:trackId', (req: Request, res: Response) => {
  try {
    const { appId, trackId } = req.params;

    // Mock lessons data
    const lessons: Lesson[] = Array.from({ length: 5 }).map((_, i) => ({
      id: `lesson_${appId}_${trackId}_${i}`,
      appId,
      trackId,
      index: i,
      title: `Lesson ${i + 1}: ${['Foundation', 'Deepening', 'Integration', 'Mastery'][Math.floor(i / 1)]}`,
      body: [`This is the body of lesson ${i + 1}.`],
      affirmation: 'I am capable and strong.',
      strength: 'Resilience',
    }));

    res.json({ trackId, lessons });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// GET /api/v1/apps/:appId/lessons/:trackId/:lessonIndex
router.get('/:appId/lessons/:trackId/:lessonIndex', (req: Request, res: Response) => {
  try {
    const { appId, trackId, lessonIndex } = req.params;
    const index = parseInt(lessonIndex, 10);

    if (isNaN(index) || index < 0 || index > 4) {
      return res.status(400).json({ error: 'Invalid lesson index' });
    }

    const lesson: Lesson = {
      id: `lesson_${appId}_${trackId}_${index}`,
      appId,
      trackId,
      index,
      title: `Lesson ${index + 1}`,
      body: [
        'This is the introductory paragraph.',
        'This is the main content paragraph.',
        'This is the closing paragraph with reflection question.',
      ],
      affirmation: 'I am capable and worthy of growth.',
      strength: 'Resilience',
    };

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

export default router;
