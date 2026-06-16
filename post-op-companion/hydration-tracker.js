// Hydration Tracker
class HydrationTracker {
  constructor(app) {
    this.app = app;
    this.state = app.state;
    if (!this.state.hydration) {
      this.state.hydration = {
        dailyLog: {}, // { YYYY-MM-DD: [{ time, amount }] }
        dailyGoal: 80, // oz
      };
    }
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.refreshUI();
  }

  setupEventListeners() {
    // Quick add buttons
    document.querySelectorAll('.btn-hydration').forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = parseInt(btn.dataset.amount);
        this.addWater(amount);
      });
    });

    // Reset button
    const resetBtn = document.getElementById('reset-hydration');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetDaily());
    }
  }

  addWater(amount) {
    const today = new Date().toISOString().split('T')[0];
    if (!this.state.hydration.dailyLog[today]) {
      this.state.hydration.dailyLog[today] = [];
    }

    this.state.hydration.dailyLog[today].push({
      amount,
      time: new Date().toLocaleTimeString(),
    });

    this.app.saveState();
    this.refreshUI();
  }

  resetDaily() {
    const today = new Date().toISOString().split('T')[0];
    this.state.hydration.dailyLog[today] = [];
    this.app.saveState();
    this.refreshUI();
  }

  refreshUI() {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = this.state.hydration.dailyLog[today] || [];
    const totalOz = todayLog.reduce((sum, log) => sum + log.amount, 0);
    const goal = this.state.hydration.dailyGoal;

    // Update gauge
    const level = document.getElementById('hydration-level');
    const text = document.getElementById('hydration-text');
    if (level && text) {
      const percent = Math.min((totalOz / goal) * 100, 100);
      level.style.height = percent + '%';
      text.textContent = `${totalOz} / ${goal} oz`;
    }

    // Update log list
    const logList = document.getElementById('hydration-log-list');
    if (logList) {
      if (todayLog.length === 0) {
        logList.innerHTML = '<p class="placeholder">No water logged yet today</p>';
      } else {
        logList.innerHTML = todayLog.map((log, idx) => `
          <div class="log-item">
            <span>${log.time}</span>
            <span class="amount">+${log.amount}oz</span>
            <button class="btn-mini" onclick="app.hydration.removeEntry('${today}', ${idx})">✕</button>
          </div>
        `).join('');
      }
    }

    // Color code status
    const statusEl = document.querySelector('.hydration-gauge');
    if (statusEl) {
      if (totalOz >= goal) {
        statusEl.style.borderColor = '#6B8E23';
      } else if (totalOz >= goal * 0.75) {
        statusEl.style.borderColor = '#FFB84D';
      } else {
        statusEl.style.borderColor = '#FF6B6B';
      }
    }
  }

  removeEntry(date, idx) {
    if (this.state.hydration.dailyLog[date]) {
      this.state.hydration.dailyLog[date].splice(idx, 1);
      this.app.saveState();
      this.refreshUI();
    }
  }
}
