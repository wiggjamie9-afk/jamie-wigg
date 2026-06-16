import { pool } from './index.js';

const apps = [
  {
    id: 'bright-brains',
    name: 'Bright Brains',
    description: 'Learning strategies for neurodivergent minds',
    accent_color: '#ff6b6b',
  },
  {
    id: 'steady',
    name: 'Steady',
    description: 'Mental health and emotional resilience',
    accent_color: '#4ecdc4',
  },
  {
    id: 'mum-brain',
    name: 'Mum Brain',
    description: 'For mothers and caregivers',
    accent_color: '#f8a5c0',
  },
  {
    id: 'dad-brain',
    name: 'Dad Brain',
    description: 'For fathers and caregivers',
    accent_color: '#9b87f5',
  },
  {
    id: 'abilities-brain',
    name: 'Abilities Brain',
    description: 'For people with disabilities',
    accent_color: '#ffd93d',
  },
  {
    id: 'sleep',
    name: 'Sleep',
    description: 'Better rest and sleep quality',
    accent_color: '#6c5ce7',
  },
  {
    id: 'relationships',
    name: 'Relationships',
    description: 'Healthy communication and connection',
    accent_color: '#e84393',
  },
  {
    id: 'money',
    name: 'Money',
    description: 'Financial health and abundance mindset',
    accent_color: '#27ae60',
  },
  {
    id: 'sobriety',
    name: 'Sobriety',
    description: 'Recovery and lasting change',
    accent_color: '#f39c12',
  },
];

const tracks: Record<string, string[]> = {
  'bright-brains': ['Reading Strategies', 'Math Patterns', 'Writing Systems', 'Focus Tools'],
  'steady': ['Anxiety Calm', 'Depression Hope', 'Stress Release', 'Sleep Better'],
  'mum-brain': ['Energy', 'Patience', 'Balance', 'Connection'],
  'dad-brain': ['Presence', 'Patience', 'Strength', 'Connection'],
  'abilities-brain': ['Adaptation', 'Strength', 'Community', 'Purpose'],
  'sleep': ['Wind-Down', 'Breathing', 'Body-Scan', 'Dream'],
  'relationships': ['Communication', 'Conflict', 'Intimacy', 'Boundaries'],
  'money': ['Spending', 'Saving', 'Debt', 'Abundance'],
  'sobriety': ['Cravings', 'Identity', 'Community', 'Purpose'],
};

export async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM lessons');
    await client.query('DELETE FROM tracks');
    await client.query('DELETE FROM apps');

    // Insert apps
    for (const app of apps) {
      await client.query(
        'INSERT INTO apps (id, name, description, accent_color) VALUES ($1, $2, $3, $4)',
        [app.id, app.name, app.description, app.accent_color]
      );
    }

    // Insert tracks and lessons
    for (const appId of Object.keys(tracks)) {
      const trackList = tracks[appId];

      for (let trackIndex = 0; trackIndex < trackList.length; trackIndex++) {
        const trackId = `${appId}-track-${trackIndex}`;
        const trackName = trackList[trackIndex];

        await client.query(
          'INSERT INTO tracks (id, app_id, name, display_order) VALUES ($1, $2, $3, $4)',
          [trackId, appId, trackName, trackIndex]
        );

        // Insert 5 lessons per track
        for (let lessonIndex = 0; lessonIndex < 5; lessonIndex++) {
          const title = `${trackName} Lesson ${lessonIndex + 1}`;
          const body = `This is lesson ${lessonIndex + 1} of the ${trackName} track in ${appId}.

Explore the key concepts and practices that will help you develop mastery in this area.`;

          const affirmation = `I am growing stronger in ${trackName.toLowerCase()}.`;

          await client.query(
            `INSERT INTO lessons (app_id, track_id, lesson_index, title, body, affirmation)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [appId, trackId, lessonIndex, title, body, affirmation]
          );
        }
      }
    }

    await client.query('COMMIT');
    console.log('✓ Database seeded successfully');
    console.log(`  - ${apps.length} apps created`);
    console.log(`  - ${Object.values(tracks).reduce((sum, t) => sum + t.length, 0)} tracks created`);
    console.log(`  - ${Object.values(tracks).reduce((sum, t) => sum + t.length * 5, 0)} lessons created`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run seed if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
