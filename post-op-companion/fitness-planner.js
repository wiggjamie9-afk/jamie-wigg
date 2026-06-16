// Fitness programming and exercise recommendations
class FitnessPlanner {
  constructor() {
    this.currentPhase = 1;
    this.exercises = {};
  }

  getPhaseExercises(month) {
    // Phase-based exercise recommendations
    const phases = {
      1: { // Recovery phase (month 1)
        name: 'Rest & Gentle Movement',
        exercises: [
          { day: 'Mon', name: 'Walking (5-10 min)', intensity: 'Light', notes: 'Around house only' },
          { day: 'Wed', name: 'Stretching (10 min)', intensity: 'Light', notes: 'Focus on incision area avoidance' },
          { day: 'Fri', name: 'Walking (10-15 min)', intensity: 'Light', notes: 'Gradually increase' },
        ],
      },
      2: { // Early mobilization (months 2-3)
        name: 'Walking & Light Stretching',
        exercises: [
          { day: 'Mon', name: 'Walking (20 min)', intensity: 'Light', notes: 'Continuous, moderate pace' },
          { day: 'Tue', name: 'Stretching (15 min)', intensity: 'Light', notes: 'Full-body gentle stretches' },
          { day: 'Wed', name: 'Walking (20 min)', intensity: 'Light', notes: '' },
          { day: 'Thu', name: 'Water walking (15 min)', intensity: 'Light', notes: 'Chest-deep water' },
          { day: 'Fri', name: 'Walking (25 min)', intensity: 'Moderate', notes: 'Increase pace' },
        ],
      },
      4: { // Progressive strengthening (months 4-6)
        name: 'Cardio & Light Strength',
        exercises: [
          { day: 'Mon', name: 'Walking (30 min)', intensity: 'Moderate', notes: '' },
          { day: 'Tue', name: 'Light dumbbells (10-15 min)', intensity: 'Light', notes: '3-5 lbs, high reps' },
          { day: 'Wed', name: 'Water aerobics (20 min)', intensity: 'Moderate', notes: '' },
          { day: 'Thu', name: 'Yoga or Pilates (20 min)', intensity: 'Light-Moderate', notes: 'Core-focused' },
          { day: 'Fri', name: 'Walking (30 min)', intensity: 'Moderate', notes: 'Brisk pace' },
          { day: 'Sat', name: 'Stretching (15 min)', intensity: 'Light', notes: '' },
        ],
      },
      7: { // Advanced conditioning (months 7-12)
        name: 'Cardio, Strength & Flexibility',
        exercises: [
          { day: 'Mon', name: 'Running or cycling (30 min)', intensity: 'Moderate-High', notes: '60-70% max HR' },
          { day: 'Tue', name: 'Strength training (30 min)', intensity: 'Moderate', notes: '8-12 lbs, 3 sets' },
          { day: 'Wed', name: 'HIIT or cardio class (30 min)', intensity: 'High', notes: 'Intervals with rest' },
          { day: 'Thu', name: 'Yoga or stretching (20 min)', intensity: 'Light', notes: '' },
          { day: 'Fri', name: 'Strength training (30 min)', intensity: 'Moderate', notes: '10-15 lbs' },
          { day: 'Sat', name: 'Sports or recreation (30-60 min)', intensity: 'Moderate-High', notes: 'Your choice' },
          { day: 'Sun', name: 'Rest or light walk', intensity: 'Light', notes: 'Recovery day' },
        ],
      },
    };

    let phase = month <= 1 ? 1 : month <= 3 ? 2 : month <= 6 ? 4 : 7;
    return phases[phase] || phases[7];
  }

  validateExercise(exercise, month) {
    // Check if exercise is safe for current phase
    const restrictions = {
      1: ['running', 'jumping', 'heavy', 'contact sports', 'abs'],
      2: ['running', 'jumping', 'heavy', 'contact sports', 'high impact'],
      4: ['very heavy', 'contact sports', 'explosive'],
    };

    let phase = month <= 1 ? 1 : month <= 3 ? 2 : month <= 6 ? 4 : 7;
    const banned = restrictions[phase] || [];

    const isSafe = !banned.some(word => exercise.toLowerCase().includes(word));
    return {
      safe: isSafe,
      phase,
      message: isSafe ? '✓ Safe for your phase' : '⚠️ Not recommended for your phase',
    };
  }

  trackWorkout(exercise, duration, intensity, notes) {
    return {
      exercise,
      duration,
      intensity,
      notes,
      date: new Date().toISOString(),
      caloriesBurned: this.estimateCalories(exercise, duration, intensity),
    };
  }

  estimateCalories(exercise, durationMin, intensity) {
    // Rough estimation based on exercise and intensity
    const baseRate = {
      'walking': 3,
      'running': 10,
      'cycling': 7,
      'swimming': 8,
      'yoga': 2,
      'strength': 5,
      'aerobics': 6,
    };

    const exerciseType = Object.keys(baseRate).find(e => exercise.toLowerCase().includes(e)) || 'walking';
    const intensityMultiplier = { 'light': 0.8, 'moderate': 1, 'high': 1.3 };
    const multiplier = intensityMultiplier[intensity] || 1;

    return Math.round(baseRate[exerciseType] * durationMin * multiplier);
  }

  generateProgressMetrics(workouts) {
    if (workouts.length === 0) return null;

    return {
      totalWorkouts: workouts.length,
      totalMinutes: workouts.reduce((sum, w) => sum + w.duration, 0),
      totalCalories: workouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
      averageIntensity: this.calculateAverageIntensity(workouts),
      streak: this.calculateStreak(workouts),
    };
  }

  calculateAverageIntensity(workouts) {
    const intensityMap = { 'light': 1, 'moderate': 2, 'high': 3 };
    const sum = workouts.reduce((s, w) => s + (intensityMap[w.intensity] || 2), 0);
    return (sum / workouts.length).toFixed(1);
  }

  calculateStreak(workouts) {
    if (workouts.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < workouts.length; i++) {
      const workoutDate = new Date(workouts[workouts.length - 1 - i].date);
      const dayDiff = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
      if (dayDiff <= i) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
}

const fitnessPlanner = new FitnessPlanner();
