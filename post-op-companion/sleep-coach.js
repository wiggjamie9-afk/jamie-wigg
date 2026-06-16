// Sleep Optimization Coach
class SleepCoach {
  constructor(app) {
    this.app = app;
    this.state = app.state;
    if (!this.state.sleep) {
      this.state.sleep = {
        logs: [],
        goal: 7.5, // hours
      };
    }
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.refreshUI();
  }

  setupEventListeners() {
    const sleepForm = document.getElementById('sleep-form');
    if (sleepForm) {
      sleepForm.addEventListener('submit', (e) => this.handleSleepLog(e));
    }

    // Sleep quality slider for mood display
    const slider = document.getElementById('mood-slider');
    if (slider) {
      slider.addEventListener('input', () => this.updateMoodDisplay());
    }
  }

  handleSleepLog(e) {
    e.preventDefault();
    const date = document.getElementById('sleep-date').value;
    const hours = parseFloat(document.getElementById('sleep-hours').value);
    const quality = document.getElementById('sleep-quality-select').value;
    const notes = document.getElementById('sleep-notes').value;

    const log = {
      date,
      hours,
      quality,
      notes,
      timestamp: Date.now(),
    };

    this.state.sleep.logs.push(log);
    this.app.saveState();

    // Clear form
    document.getElementById('sleep-form').reset();

    // Refresh UI
    this.refreshUI();

    // Show confirmation
    alert(`✓ Logged ${hours} hours of ${quality || 'unmeasured'} sleep`);
  }

  refreshUI() {
    const logs = this.state.sleep.logs || [];
    if (logs.length === 0) return;

    // Last night's sleep
    const lastLog = logs[logs.length - 1];
    const lastNightEl = document.getElementById('last-night-sleep');
    const qualityEl = document.getElementById('sleep-quality');
    if (lastNightEl) {
      lastNightEl.textContent = `${lastLog.hours}h`;
      const color = lastLog.hours >= 7 ? '🟢' : lastLog.hours >= 6 ? '🟡' : '🔴';
      qualityEl.textContent = `${color} ${lastLog.quality || 'unrated'}`;
    }

    // Weekly average
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weekLogs = logs.filter(l => new Date(l.date).getTime() > weekAgo);
    if (weekLogs.length > 0) {
      const avgHours = (weekLogs.reduce((s, l) => s + l.hours, 0) / weekLogs.length).toFixed(1);
      const weekEl = document.getElementById('weekly-sleep');
      if (weekEl) weekEl.textContent = `${avgHours}h`;
    }

    // Render graph
    this.renderSleepGraph();
  }

  renderSleepGraph() {
    const canvas = document.getElementById('sleep-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const logs = (this.state.sleep.logs || []).slice(-30); // Last 30 days

    // Clear canvas
    ctx.fillStyle = '#FFE4E1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#E8B4C8';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      const y = (canvas.height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw line graph
    if (logs.length > 1) {
      ctx.strokeStyle = '#D291BC';
      ctx.lineWidth = 2;
      ctx.beginPath();

      logs.forEach((log, idx) => {
        const x = (idx / (logs.length - 1)) * (canvas.width - 20) + 10;
        const y = canvas.height - (log.hours / 12) * (canvas.height - 20);
        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // Draw points
    logs.forEach((log, idx) => {
      const x = (idx / Math.max(logs.length - 1, 1)) * (canvas.width - 20) + 10;
      const y = canvas.height - (log.hours / 12) * (canvas.height - 20);
      const color = log.hours >= 7 ? '#6B8E23' : log.hours >= 6 ? '#FF8C00' : '#FF4444';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  updateMoodDisplay() {
    const slider = document.getElementById('mood-slider');
    const display = document.getElementById('mood-display');
    if (slider && display) {
      const value = parseInt(slider.value);
      const moods = ['Very sad', 'Sad', 'Down', 'Okay', 'Neutral', 'Content', 'Happy', 'Very happy', 'Joyful', 'Euphoric'];
      display.textContent = `${moods[value - 1]} (${value}/10)`;
    }
  }
}
