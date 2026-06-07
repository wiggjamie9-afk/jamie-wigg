'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSpeechRecognition } from '@/lib/useSpeechRecognition';
import { useSpeechSynthesis } from '@/lib/useSpeechSynthesis';
import { getCoachingFeedback } from '@/lib/claude';
import { saveWorkout, getProfile, updateProfileHistory } from '@/lib/db';

type WorkoutType = 'strength' | 'cardio' | 'yoga' | 'wellness';

export default function WorkoutPage() {
  const [workoutType, setWorkoutType] = useState<WorkoutType | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [currentExercise, setCurrentExercise] = useState('');
  const [feedback, setFeedback] = useState('');
  const [exercises, setExercises] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { start, stop, listening } = useSpeechRecognition({
    onTranscript: handleTranscript,
  });

  const { speak, speaking } = useSpeechSynthesis({});

  useEffect(() => {
    async function load() {
      const p = await getProfile();
      setProfile(p);
      setLoading(false);
    }
    load();
  }, []);

  async function handleTranscript(text: string) {
    if (!currentExercise || !workoutType) {
      if (
        text.includes('start') ||
        text.includes('begin') ||
        text.includes('ready')
      ) {
        setFeedback('What exercise are you starting?');
        speak('What exercise are you starting?');
      }
      return;
    }

    // Parse user input
    setCurrentExercise(text);
    setFeedback('Getting your personalized coaching...');

    try {
      const coaching = await getCoachingFeedback({
        currentExercise: text,
        howYouFeel: 'Let\'s go',
        workoutType,
        pastWorkouts: exercises,
      });

      setFeedback(coaching);
      speak(coaching);

      // Add to exercises
      setExercises([
        ...exercises,
        {
          name: text,
          feedback: [coaching],
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      const fallback = 'Great effort! Keep pushing!';
      setFeedback(fallback);
      speak(fallback);
    }
  }

  async function finishWorkout() {
    if (!workoutType || !startTime || exercises.length === 0) return;

    const duration = Date.now() - startTime;

    await saveWorkout({
      id: `workout-${Date.now()}`,
      timestamp: startTime,
      type: workoutType,
      exercises,
      totalDuration: duration,
      mood: 8,
      notes: `${exercises.length} exercises completed`,
      achievements: ['Stayed consistent!', 'Great form!'],
    });

    await updateProfileHistory(`Completed ${workoutType} workout - ${exercises.length} exercises`);

    stop();
    setFeedback('');
    setWorkoutType(null);
    setCurrentExercise('');
    setExercises([]);
  }

  if (loading) return <div>Loading...</div>;

  if (!workoutType) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 to-black p-6">
        <Link href="/" className="text-gold mb-8">
          ← Back
        </Link>

        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-serif mb-2">Let's lift.</h1>
          <p className="text-gray-400 mb-8 text-sm">Pick your split and tell me your first exercise</p>

          <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
            {(['strength'] as WorkoutType[]).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => {
                    setWorkoutType(type);
                    setStartTime(Date.now());
                    start();
                    speak(
                      `Starting ${type} workout. Say your first exercise whenever you're ready.`
                    );
                  }}
                  className="p-6 bg-slate-800/50 border border-gold/30 rounded-lg hover:bg-slate-700/50 hover:border-gold transition capitalize font-semibold text-lg"
                >
                  {type === 'strength' && '💪'}
                  {type === 'cardio' && '🏃'}
                  {type === 'yoga' && '🧘'}
                  {type === 'wellness' && '🌿'}
                  <br />
                  {type}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 to-black p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif capitalize">
            {workoutType} Workout
          </h1>
          <p className="text-sm text-gray-400">
            {exercises.length} exercises · {profile?.preferences.coachName}
          </p>
        </div>
        <button
          onClick={finishWorkout}
          className="text-gold hover:text-yellow-300 font-semibold text-sm"
        >
          Done ✓
        </button>
      </div>

      {/* Coaching Area */}
      <div className="flex-1 flex flex-col items-center justify-center mb-8">
        <div className="relative w-32 h-32 mb-8">
          <div className={`absolute inset-0 rounded-full border-2 border-gold/30 ${listening ? 'animate-pulse' : ''}`} />
          <div className="absolute inset-2 rounded-full bg-slate-900/50 flex items-center justify-center">
            <button
              onClick={listening ? stop : start}
              className="text-6xl hover:scale-110 transition"
            >
              🎤
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          {listening ? 'Listening...' : 'Say your exercise'}
        </p>

        {feedback && (
          <div className="bg-slate-800/50 border border-gold/30 rounded-lg p-6 max-w-sm text-center">
            <p className="text-lg font-serif text-gold">{feedback}</p>
          </div>
        )}
      </div>

      {/* Recent Exercises */}
      {exercises.length > 0 && (
        <div className="bg-slate-800/30 rounded-lg p-4 max-h-32 overflow-y-auto">
          <p className="text-xs text-gray-400 uppercase mb-2">Recent exercises</p>
          <div className="space-y-2">
            {exercises.slice(-3).map((e, i) => (
              <div key={i} className="text-sm">
                <span className="text-gold capitalize">{e.name}</span>
                <span className="text-gray-500 text-xs ml-2">{e.feedback?.[0]?.substring(0, 30)}...</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
