// Stress & Mental Health Coach
class MentalHealthCoach {
  constructor(app) {
    this.app = app;
    this.state = app.state;
    if (!this.state.mentalHealth) {
      this.state.mentalHealth = {
        moodLogs: [],
      };
    }
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.refreshUI();
  }

  setupEventListeners() {
    const moodForm = document.getElementById('mood-form');
    if (moodForm) {
      moodForm.addEventListener('submit', (e) => this.handleMoodLog(e));
    }

    // Strategy buttons
    document.querySelectorAll('.strategy-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showStrategy(btn.dataset.strategy));
    });

    // Therapist finder
    const therapistBtn = document.getElementById('find-therapist-btn');
    if (therapistBtn) {
      therapistBtn.addEventListener('click', () => this.openTherapistFinder());
    }
  }

  handleMoodLog(e) {
    e.preventDefault();
    const mood = parseInt(document.getElementById('mood-slider').value);
    const stress = parseInt(document.getElementById('stress-level').value);
    const notes = document.getElementById('mood-notes').value;

    const log = {
      date: new Date().toISOString(),
      mood,
      stress,
      notes,
    };

    this.state.mentalHealth.moodLogs.push(log);
    this.app.saveState();
    document.getElementById('mood-form').reset();
    this.refreshUI();

    const moodLabels = ['Very sad', 'Sad', 'Down', 'Okay', 'Neutral', 'Content', 'Happy', 'Very happy', 'Joyful', 'Euphoric'];

    // Spoken, human encouragement tuned to how they're feeling
    let spoken;
    if (mood <= 3) {
      spoken = "I hear you, and it's okay to have hard days. Be gentle with yourself today — you're still healing, and that takes real strength.";
    } else if (mood <= 6) {
      spoken = "Thanks for checking in. You're doing the work, and that matters. Let's keep showing up, one small step at a time.";
    } else {
      spoken = "I love to hear that. You've earned this good feeling — keep doing what's working for you.";
    }
    if (window.voice) window.voice.speak(spoken);

    alert(`✓ Logged mood: ${moodLabels[mood - 1]} (${mood}/10), Stress: ${stress}/10`);
  }

  showStrategy(strategy) {
    // Spoken guidance to lead the user through each strategy, human and calm
    const spokenGuides = {
      breathing: "Let's breathe together. Breathe in slowly through your nose... and out through your mouth. Follow the steps on screen, and let your shoulders soften.",
      grounding: "Let's come back to right now. Look around and notice five things you can see. We'll go through your senses, one at a time.",
      journal: "Let's find three things to be grateful for. They can be small. Take your time.",
      walk: "A gentle walk can really help. Step outside if you can, and just notice the world around you for a few minutes.",
    };
    if (window.voice && spokenGuides[strategy]) window.voice.speak(spokenGuides[strategy]);

    let content = '';
    switch (strategy) {
      case 'breathing':
        content = `
          <h3>5-Minute Breathing Exercise</h3>
          <ol>
            <li>Find a comfortable seat</li>
            <li>Breathe in through your nose for 4 counts</li>
            <li>Hold for 4 counts</li>
            <li>Exhale through your mouth for 6 counts</li>
            <li>Repeat 10 times</li>
          </ol>
          <p>This activates your parasympathetic nervous system and reduces stress.</p>
        `;
        break;
      case 'grounding':
        content = `
          <h3>5-4-3-2-1 Grounding Technique</h3>
          <p>Notice:</p>
          <ul>
            <li><strong>5 things</strong> you can see</li>
            <li><strong>4 things</strong> you can feel (texture, temperature)</li>
            <li><strong>3 things</strong> you can hear</li>
            <li><strong>2 things</strong> you can smell</li>
            <li><strong>1 thing</strong> you can taste</li>
          </ul>
          <p>This brings you back to the present moment.</p>
        `;
        break;
      case 'journal':
        content = `
          <h3>Gratitude Journal Prompt</h3>
          <p>Write 3 things you're grateful for, no matter how small:</p>
          <ol>
            <li>Example: I'm grateful for my body healing</li>
            <li>Example: I'm grateful for a supportive friend</li>
            <li>Example: I'm grateful for today's energy level</li>
          </ol>
          <p>Gratitude rewires your brain to focus on positives.</p>
        `;
        break;
      case 'walk':
        content = `
          <h3>Take a Therapeutic Walk</h3>
          <p>Post-op approved gentle movement:</p>
          <ul>
            <li>Walk outside if possible (nature boosts mood)</li>
            <li>Start with 10-15 minutes</li>
            <li>Notice your surroundings (nature sounds, colors, textures)</li>
            <li>Let your mind wander or listen to calming music</li>
          </ul>
          <p>Movement reduces stress and improves mental health.</p>
        `;
        break;
    }
    alert(content);
  }

  openTherapistFinder() {
    alert(`Therapist Finder:\n\n1. Psychology Today (psychologytoday.com) — filter by post-op/bariatric support\n2. TherapyDen.com — telehealth therapists\n3. IOCDF.org — if you struggle with body image/OCD\n4. Your surgeon can recommend local therapists\n\nYou're not alone. Mental health support is part of recovery.`);
  }

  refreshUI() {
    const logs = this.state.mentalHealth.moodLogs || [];
    if (logs.length === 0) return;

    // Render mood graph
    this.renderMoodGraph();
  }

  renderMoodGraph() {
    const canvas = document.getElementById('mood-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const logs = (this.state.mentalHealth.moodLogs || []).slice(-30);

    // Clear canvas
    ctx.fillStyle = '#FFE4E1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#E8B4C8';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 10; i++) {
      const y = (canvas.height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw line graph
    if (logs.length > 1) {
      ctx.strokeStyle = '#A8639C';
      ctx.lineWidth = 2;
      ctx.beginPath();

      logs.forEach((log, idx) => {
        const x = (idx / (logs.length - 1)) * (canvas.width - 20) + 10;
        const y = canvas.height - (log.mood / 10) * (canvas.height - 20);
        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // Draw mood points
    logs.forEach((log, idx) => {
      const x = (idx / Math.max(logs.length - 1, 1)) * (canvas.width - 20) + 10;
      const y = canvas.height - (log.mood / 10) * (canvas.height - 20);
      const color = log.mood >= 7 ? '#6B8E23' : log.mood >= 5 ? '#FFB84D' : '#FF6B6B';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
