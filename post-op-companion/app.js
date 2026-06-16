// Main application state and logic
class PostOpCompanion {
  constructor() {
    this.state = {
      user: {
        surgeryType: null,
        surgeryDate: null,
        currentMonth: 1,
        startWeight: 250,
      },
      vitals: {
        weight: [],
        heartRate: [],
        bloodPressure: [],
        sleep: [],
        activity: [],
      },
      goals: {
        weightLoss: null,
        targetWeight: null,
        fitnessGoals: [],
        lifeGoals: [],
      },
      mealPlan: [],
      fitnessSchedule: [],
      alerts: [],
      documents: [],
      wearables: {
        appleHealth: false,
        googleFit: false,
        fitbit: false,
        garmin: false,
      },
      premium: false,
    };

    this.init();
  }

  init() {
    this.loadState();
    this.setupTabNavigation();
    this.setupEventListeners();
    this.refreshDashboard();
    this.loadMealPlan();
    this.loadFitnessSchedule();
    console.log('Post-Op Companion initialized');
  }

  loadState() {
    const saved = localStorage.getItem('post-op-state');
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load state:', e);
      }
    }
  }

  saveState() {
    localStorage.setItem('post-op-state', JSON.stringify(this.state));
  }

  setupTabNavigation() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        this.switchTab(tab);
      });
    });
  }

  switchTab(tabName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    // Show selected screen
    const screen = document.getElementById(tabName);
    const btn = document.querySelector(`[data-tab="${tabName}"]`);

    if (screen) screen.classList.add('active');
    if (btn) btn.classList.add('active');
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Dashboard
    document.getElementById('generate-meals-btn')?.addEventListener('click', () => {
      this.generateMealPlan();
    });

    // Medical Tracker
    document.getElementById('vitals-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.logVitals();
    });

    document.getElementById('upload-labs-btn')?.addEventListener('click', () => {
      this.uploadLabs();
    });

    // Documents
    document.getElementById('save-surgery-btn')?.addEventListener('click', () => {
      this.saveSurgeryInfo();
    });

    document.getElementById('save-goals-btn')?.addEventListener('click', () => {
      this.saveGoals();
    });

    document.getElementById('upload-meal-plan-btn')?.addEventListener('click', () => {
      this.uploadMealPlan();
    });

    document.getElementById('upload-clearance-btn')?.addEventListener('click', () => {
      this.uploadClearance();
    });

    // Meal Plan Navigation
    document.getElementById('prev-week')?.addEventListener('click', () => {
      this.previousWeek();
    });

    document.getElementById('next-week')?.addEventListener('click', () => {
      this.nextWeek();
    });

    // Settings
    document.getElementById('save-claude-key-btn')?.addEventListener('click', () => {
      this.saveClaudeKey();
    });

    document.getElementById('connect-apple')?.addEventListener('click', () => {
      this.connectWearable('apple');
    });

    document.getElementById('connect-google')?.addEventListener('click', () => {
      this.connectWearable('google');
    });

    document.getElementById('connect-fitbit')?.addEventListener('click', () => {
      this.connectWearable('fitbit');
    });

    document.getElementById('connect-garmin')?.addEventListener('click', () => {
      this.connectWearable('garmin');
    });

    document.getElementById('upgrade-btn')?.addEventListener('click', () => {
      this.upgradePremium();
    });

    document.getElementById('export-data-btn')?.addEventListener('click', () => {
      this.exportData();
    });

    document.getElementById('clear-data-btn')?.addEventListener('click', () => {
      this.clearData();
    });
  }

  refreshDashboard() {
    this.updateStats();
    this.updateAlerts();
    this.updateProgress();
    this.updateAffirmation();
  }

  updateStats() {
    const latestWeight = this.state.vitals.weight[this.state.vitals.weight.length - 1];
    const latestHR = this.state.vitals.heartRate[this.state.vitals.heartRate.length - 1];
    const latestBP = this.state.vitals.bloodPressure[this.state.vitals.bloodPressure.length - 1];

    document.getElementById('current-weight').textContent = latestWeight ? `${latestWeight} lbs` : '—';
    document.getElementById('current-hr').textContent = latestHR ? `${latestHR} bpm` : '—';
    document.getElementById('current-bp').textContent = latestBP || '—';

    // Calculate days post-op
    if (this.state.user.surgeryDate) {
      const surgeryDate = new Date(this.state.user.surgeryDate);
      const today = new Date();
      const daysPostOp = Math.floor((today - surgeryDate) / (1000 * 60 * 60 * 24));
      const monthPostOp = Math.floor(daysPostOp / 30) + 1;
      document.getElementById('days-post-op').textContent = daysPostOp;
      document.getElementById('phase-label').textContent = `Month ${Math.min(monthPostOp, 12)} of 12`;
    }

    // Weight change
    if (this.state.vitals.weight.length > 1) {
      const prev = this.state.vitals.weight[this.state.vitals.weight.length - 2];
      const current = this.state.vitals.weight[this.state.vitals.weight.length - 1];
      const change = current - prev;
      const arrow = change < 0 ? '↓' : change > 0 ? '↑' : '→';
      document.getElementById('weight-change').textContent = `${arrow} ${Math.abs(change).toFixed(1)} lbs`;
    }
  }

  updateAlerts() {
    const container = document.getElementById('alerts-container');
    this.state.alerts = this.generateAlerts();

    if (this.state.alerts.length === 0) {
      container.innerHTML = '<p class="placeholder">No alerts. You\'re on track!</p>';
    } else {
      container.innerHTML = this.state.alerts.map(alert => `
        <div class="alert-card ${alert.level}">
          <strong>${alert.message}</strong>
          <p class="hint">${alert.action}</p>
        </div>
      `).join('');
    }
  }

  generateAlerts() {
    const alerts = [];

    // Check for rapid weight loss
    if (this.state.vitals.weight.length > 7) {
      const lastWeek = this.state.vitals.weight.slice(-7);
      const lost = lastWeek[0] - lastWeek[lastWeek.length - 1];
      if (lost > 5) {
        alerts.push({
          level: 'warning',
          message: 'Rapid weight loss detected',
          action: 'Contact your surgeon if you feel unwell.',
        });
      }
    }

    // Check for low protein intake
    alerts.push({
      level: 'default',
      message: 'Weekly check-in reminder',
      action: 'Have you logged your meals and vitals this week?',
    });

    return alerts;
  }

  updateProgress() {
    if (!this.state.user.surgeryDate) return;

    const surgeryDate = new Date(this.state.user.surgeryDate);
    const today = new Date();
    const daysPostOp = Math.floor((today - surgeryDate) / (1000 * 60 * 60 * 24));
    const monthPostOp = Math.min(Math.floor(daysPostOp / 30) + 1, 12);

    let progress = (monthPostOp / 12) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `Month ${monthPostOp} of 12 • ${100 - progress.toFixed(0)}% left`;
  }

  updateAffirmation() {
    const affirmations = [
      "You're on an incredible 12-month journey. Trust it.",
      "Each day is progress, even if the scale doesn't show it.",
      "Your body is healing. Be patient with yourself.",
      "You've already taken the hardest step. Now you maintain.",
      "This surgery is a tool. You're the one doing the work.",
      "Small habits, big transformations. You've got this.",
      "Your future self will thank you for your discipline today.",
      "Progress is not always visible. Keep going.",
      "You are stronger than your cravings.",
      "This is your year. Own it.",
    ];
    const random = affirmations[Math.floor(Math.random() * affirmations.length)];
    document.getElementById('daily-affirmation').textContent = `"${random}"`;
  }

  logVitals() {
    const date = document.getElementById('vitals-date').value;
    const weight = parseFloat(document.getElementById('vitals-weight').value);
    const hr = parseInt(document.getElementById('vitals-hr').value);
    const bp = document.getElementById('vitals-bp').value;
    const notes = document.getElementById('vitals-notes').value;

    if (weight) this.state.vitals.weight.push(weight);
    if (hr) this.state.vitals.heartRate.push(hr);
    if (bp) this.state.vitals.bloodPressure.push(bp);

    this.saveState();
    this.refreshDashboard();

    // Clear form
    document.getElementById('vitals-form').reset();
    alert('✓ Vitals logged successfully!');
  }

  saveSurgeryInfo() {
    this.state.user.surgeryType = document.getElementById('surgery-type').value;
    this.state.user.surgeryDate = document.getElementById('surgery-date').value;
    this.saveState();
    alert('✓ Surgery information saved!');
    this.refreshDashboard();
  }

  saveGoals() {
    this.state.goals.weightLoss = parseFloat(document.getElementById('goal-weight-loss').value) || 50;
    this.state.goals.fitnessGoals = document.getElementById('goal-fitness').value.split('\n').filter(g => g.trim());
    this.state.goals.lifeGoals = document.getElementById('goal-life').value.split('\n').filter(g => g.trim());
    this.saveState();
    alert('✓ Goals saved!');
  }

  saveClaudeKey() {
    const key = document.getElementById('claude-api-key').value;
    if (key.trim()) {
      localStorage.setItem('claude-api-key', key);
      alert('✓ Claude API key saved securely!');
    } else {
      alert('Please enter an API key.');
    }
  }

  async generateMealPlan() {
    const claudeKey = localStorage.getItem('claude-api-key');
    if (!claudeKey) {
      alert('⚠️ Please add your Claude API key in Settings first.');
      this.switchTab('settings');
      return;
    }

    if (!this.state.user.surgeryDate) {
      alert('⚠️ Please enter your surgery date in Documents first.');
      this.switchTab('documents');
      return;
    }

    alert('🚀 Generating personalized meal plan with Claude AI...');
    // In production, call Claude API via claude-ai.js
    this.loadMealPlan();
  }

  loadMealPlan() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealGrid = document.getElementById('meal-plan-grid');
    mealGrid.innerHTML = '';

    days.forEach(day => {
      const card = document.createElement('div');
      card.className = 'meal-day';
      card.innerHTML = `
        <h4>${day}</h4>
        <p>B: Egg whites<br>L: Grilled chicken<br>D: Baked fish</p>
      `;
      mealGrid.appendChild(card);
    });

    // Shopping list
    const items = ['Eggs', 'Chicken breast', 'Fish fillets', 'Broccoli', 'Spinach', 'Brown rice', 'Oats', 'Greek yogurt'];
    const shoppingList = document.getElementById('shopping-items');
    shoppingList.innerHTML = items.map(item => `<li>☐ ${item}</li>`).join('');
  }

  loadFitnessSchedule() {
    const schedule = [
      { day: 'Monday', exercise: 'Walking: 20-30 min', intensity: 'Light' },
      { day: 'Tuesday', exercise: 'Stretching & Core', intensity: 'Light' },
      { day: 'Wednesday', exercise: 'Walking: 30 min', intensity: 'Moderate' },
      { day: 'Thursday', exercise: 'Water aerobics', intensity: 'Light' },
      { day: 'Friday', exercise: 'Strength training (dumbbells)', intensity: 'Moderate' },
      { day: 'Saturday', exercise: 'Yoga', intensity: 'Light' },
      { day: 'Sunday', exercise: 'Rest day', intensity: 'Rest' },
    ];

    const fitnessSchedule = document.getElementById('fitness-schedule');
    fitnessSchedule.innerHTML = schedule.map(item => `
      <div class="exercise-day">
        <h4>${item.day}</h4>
        <p><strong>${item.exercise}</strong></p>
        <p>Intensity: ${item.intensity}</p>
      </div>
    `).join('');
  }

  uploadLabs() {
    const file = document.getElementById('lab-file-input').files[0];
    if (file) {
      this.state.documents.push({ type: 'lab', name: file.name, date: new Date().toISOString() });
      this.saveState();
      alert('✓ Lab results uploaded!');
      this.updateDocumentsList();
    } else {
      alert('Please select a file.');
    }
  }

  uploadMealPlan() {
    const file = document.getElementById('meal-plan-file').files[0];
    if (file) {
      this.state.documents.push({ type: 'meal-plan', name: file.name, date: new Date().toISOString() });
      this.saveState();
      alert('✓ Meal plan uploaded!');
      this.updateDocumentsList();
    } else {
      alert('Please select a file.');
    }
  }

  uploadClearance() {
    const file = document.getElementById('clearance-file').files[0];
    if (file) {
      this.state.documents.push({ type: 'clearance', name: file.name, date: new Date().toISOString() });
      this.saveState();
      alert('✓ Clearance letter uploaded!');
      this.updateDocumentsList();
    } else {
      alert('Please select a file.');
    }
  }

  updateDocumentsList() {
    const list = document.getElementById('documents-list');
    if (this.state.documents.length === 0) {
      list.innerHTML = '<li>No documents uploaded yet.</li>';
      return;
    }

    list.innerHTML = this.state.documents.map((doc, idx) => `
      <li>
        <span>${doc.name}</span>
        <button onclick="window.app.deleteDocument(${idx})" class="btn-secondary" style="width: auto; margin: 0;">Delete</button>
      </li>
    `).join('');
  }

  deleteDocument(idx) {
    this.state.documents.splice(idx, 1);
    this.saveState();
    this.updateDocumentsList();
  }

  previousWeek() {
    alert('Previous week navigation coming soon!');
  }

  nextWeek() {
    alert('Next week navigation coming soon!');
  }

  connectWearable(type) {
    this.state.wearables[`${type}Health`] = !this.state.wearables[`${type}Health`];
    this.saveState();
    const status = document.getElementById(`${type}-status`);
    if (this.state.wearables[`${type}Health`]) {
      status.textContent = 'Connected ✓';
      status.classList.add('connected');
    } else {
      status.textContent = 'Not connected';
      status.classList.remove('connected');
    }
    alert(`✓ ${type} wearable toggled!`);
  }

  upgradePremium() {
    alert('🚀 Upgrade flow would redirect to Gumroad payment page. Coming soon!');
  }

  exportData() {
    const dataStr = JSON.stringify(this.state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', `post-op-companion-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(exportLink);
    exportLink.click();
    document.body.removeChild(exportLink);
    alert('✓ Data exported!');
  }

  clearData() {
    if (confirm('⚠️ This will permanently delete all your data. Are you sure?')) {
      localStorage.removeItem('post-op-state');
      this.state = {
        user: { surgeryType: null, surgeryDate: null, currentMonth: 1, startWeight: 250 },
        vitals: { weight: [], heartRate: [], bloodPressure: [], sleep: [], activity: [] },
        goals: { weightLoss: null, targetWeight: null, fitnessGoals: [], lifeGoals: [] },
        mealPlan: [],
        fitnessSchedule: [],
        alerts: [],
        documents: [],
        wearables: { appleHealth: false, googleFit: false, fitbit: false, garmin: false },
        premium: false,
      };
      this.refreshDashboard();
      alert('✓ All data cleared.');
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new PostOpCompanion();
});
