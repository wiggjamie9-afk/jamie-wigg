import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface WorkoutSession {
  id: string;
  timestamp: number;
  type: 'strength' | 'cardio' | 'yoga' | 'wellness';
  exercises: Exercise[];
  totalDuration: number;
  mood: number;
  notes: string;
  achievements: string[];
}

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  difficulty?: string;
  feedback: string[];
}

interface UserProfile {
  apiKey: string;
  elevenLabsKey?: string;
  elevenLabsVoiceId?: string;
  goals: string[];
  history: string[];
  preferences: {
    personality: 'encouraging' | 'tough' | 'funny';
    coachName: string;
  };
}

interface FitnessDB extends DBSchema {
  workouts: {
    key: string;
    value: WorkoutSession;
    indexes: { 'by-date': number };
  };
  profile: {
    key: string;
    value: UserProfile;
  };
}

let db: IDBPDatabase<FitnessDB> | null = null;

export async function initDB() {
  db = await openDB<FitnessDB>('fitness-companion', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('workouts')) {
        const store = db.createObjectStore('workouts', { keyPath: 'id' });
        store.createIndex('by-date', 'timestamp');
      }
      if (!db.objectStoreNames.contains('profile')) {
        db.createObjectStore('profile');
      }
    },
  });
  return db;
}

export async function getDB() {
  if (!db) {
    await initDB();
  }
  return db!;
}

export async function saveWorkout(workout: WorkoutSession) {
  const database = await getDB();
  return database.add('workouts', workout);
}

export async function getWorkouts(limit = 10) {
  const database = await getDB();
  const index = database.transaction('workouts').store.index('by-date');
  const allRecords = await index.getAll();
  return allRecords.reverse().slice(0, limit);
}

export async function saveProfile(profile: UserProfile) {
  const database = await getDB();
  return database.put('profile', profile, 'current');
}

export async function getProfile(): Promise<UserProfile | undefined> {
  const database = await getDB();
  return database.get('profile', 'current');
}

export async function updateProfileHistory(event: string) {
  const database = await getDB();
  const profile = await getProfile();
  if (profile) {
    profile.history.push(`${new Date().toISOString()}: ${event}`);
    if (profile.history.length > 100) {
      profile.history = profile.history.slice(-100);
    }
    await saveProfile(profile);
  }
}
