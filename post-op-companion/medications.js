// Medication & Supplement Reminder
class MedicationReminder {
  constructor(app) {
    this.app = app;
    this.state = app.state;
    if (!this.state.medications) {
      this.state.medications = {
        list: [],
        todaysTaken: {},
      };
    }
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.refreshUI();
    this.scheduleReminders();
  }

  setupEventListeners() {
    const form = document.getElementById('add-med-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleAddMed(e));
    }
  }

  handleAddMed(e) {
    e.preventDefault();
    const med = {
      id: Date.now().toString(),
      name: document.getElementById('med-name').value,
      dosage: document.getElementById('med-dosage').value,
      time: document.getElementById('med-time').value,
      frequency: document.getElementById('med-frequency').value,
      notes: document.getElementById('med-notes').value,
    };

    this.state.medications.list.push(med);
    this.app.saveState();
    document.getElementById('add-med-form').reset();
    this.refreshUI();
    alert(`✓ Added ${med.name} reminder at ${med.time}`);
  }

  toggleMedication(medId) {
    const today = new Date().toISOString().split('T')[0];
    if (!this.state.medications.todaysTaken[today]) {
      this.state.medications.todaysTaken[today] = {};
    }
    this.state.medications.todaysTaken[today][medId] = !this.state.medications.todaysTaken[today][medId];
    this.app.saveState();
    this.refreshUI();
  }

  refreshUI() {
    // Build today's checklist
    const today = new Date().toISOString().split('T')[0];
    const checklist = document.getElementById('meds-checklist');
    const meds = this.state.medications.list || [];
    const takenToday = this.state.medications.todaysTaken[today] || {};

    if (checklist) {
      if (meds.length === 0) {
        checklist.innerHTML = '<p class="placeholder">No medications added yet</p>';
      } else {
        checklist.innerHTML = meds.map(med => `
          <div class="checklist-item">
            <label>
              <input type="checkbox" ${takenToday[med.id] ? 'checked' : ''} onchange="app.medications.toggleMedication('${med.id}')">
              <span class="med-name">${med.name}</span>
              <span class="med-time">${med.time}</span>
            </label>
            ${med.dosage ? `<span class="med-dosage">${med.dosage}mg</span>` : ''}
            ${med.notes ? `<p class="med-notes">${med.notes}</p>` : ''}
          </div>
        `).join('');
      }
    }

    // Calculate adherence
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let totalScheduled = 0;
    let totalTaken = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      totalScheduled += meds.length;
      totalTaken += Object.values(this.state.medications.todaysTaken[dateStr] || {}).filter(v => v).length;
    }

    const adherencePercent = totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 0;
    const adherenceEl = document.getElementById('adherence-percent');
    if (adherenceEl) {
      adherenceEl.textContent = adherencePercent;
    }
  }

  scheduleReminders() {
    // In production, use service worker or native notifications
    if ('Notification' in window && Notification.permission === 'granted') {
      const meds = this.state.medications.list || [];
      const now = new Date();
      meds.forEach(med => {
        const [hour, minute] = med.time.split(':');
        const medTime = new Date();
        medTime.setHours(hour, minute, 0);
        const msUntil = medTime - now;
        if (msUntil > 0 && msUntil < 3600000) { // Within 1 hour
          setTimeout(() => {
            new Notification(`Time for ${med.name}`, {
              body: med.dosage ? `${med.dosage}mg at ${med.time}` : `Take at ${med.time}`,
              icon: '💊',
            });
            if (window.voice) {
              window.voice.speak(`It's time for your ${med.name}${med.dosage ? `, ${med.dosage} milligrams` : ''}. Staying on top of this keeps you feeling your best.`);
            }
          }, msUntil);
        }
      });
    }
  }
}
