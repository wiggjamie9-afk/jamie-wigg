// Professional Care Coordination
class ProfessionalIntegration {
  constructor(app) {
    this.app = app;
    this.state = app.state;
    if (!this.state.professional) {
      this.state.professional = {
        surgeon: null,
        appointments: [],
      };
    }
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.refreshUI();
  }

  setupEventListeners() {
    const surgeonBtn = document.getElementById('save-surgeon-info-btn');
    if (surgeonBtn) {
      surgeonBtn.addEventListener('click', () => this.saveSurgeon());
    }

    const aptForm = document.getElementById('add-appointment-form');
    if (aptForm) {
      aptForm.addEventListener('submit', (e) => this.handleAddAppointment(e));
    }

    const exportBtn = document.getElementById('export-summary-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportSummary());
    }
  }

  saveSurgeon() {
    const surgeon = {
      name: document.getElementById('surgeon-name').value,
      phone: document.getElementById('surgeon-phone2').value,
      email: document.getElementById('surgeon-email').value,
    };

    if (!surgeon.name) {
      alert('Please enter surgeon name');
      return;
    }

    this.state.professional.surgeon = surgeon;
    this.app.saveState();
    alert(`✓ Saved surgeon: ${surgeon.name}`);
    this.refreshUI();
  }

  handleAddAppointment(e) {
    e.preventDefault();
    const appointment = {
      id: Date.now().toString(),
      date: document.getElementById('apt-date').value,
      time: document.getElementById('apt-time').value,
      doctor: document.getElementById('apt-doctor').value,
      type: document.getElementById('apt-type').value,
    };

    this.state.professional.appointments.push(appointment);
    this.app.saveState();
    document.getElementById('add-appointment-form').reset();
    this.refreshUI();
    alert(`✓ Added appointment with ${appointment.doctor} on ${appointment.date}`);
  }

  refreshUI() {
    // Show surgeon info
    const doctorList = document.getElementById('doctor-list');
    if (doctorList && this.state.professional.surgeon) {
      const surgeon = this.state.professional.surgeon;
      doctorList.innerHTML = `
        <div class="doctor-card">
          <h4>👨‍⚕️ ${surgeon.name}</h4>
          ${surgeon.phone ? `<p>📞 <a href="tel:${surgeon.phone}">${surgeon.phone}</a></p>` : ''}
          ${surgeon.email ? `<p>✉️ <a href="mailto:${surgeon.email}">${surgeon.email}</a></p>` : ''}
        </div>
      `;
    }

    // Show appointments
    const aptList = document.getElementById('appointments-list');
    if (aptList) {
      const appointments = this.state.professional.appointments || [];
      if (appointments.length === 0) {
        aptList.innerHTML = '<p class="placeholder">No appointments scheduled</p>';
      } else {
        aptList.innerHTML = appointments
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(apt => `
            <div class="appointment-card">
              <div class="apt-header">
                <strong>${apt.doctor}</strong> — ${apt.type}
              </div>
              <div class="apt-details">
                <span>📅 ${new Date(apt.date).toLocaleDateString()}</span>
                <span>🕐 ${apt.time}</span>
              </div>
            </div>
          `).join('');
      }
    }

    // Show pre-visit summary
    this.updateVisitSummary();
  }

  updateVisitSummary() {
    const summaryDiv = document.getElementById('visit-summary');
    if (!summaryDiv) return;

    const latestVitals = this.getLatestVitals();
    const adherence = this.calculateAdherence();

    summaryDiv.innerHTML = `
      <div class="summary-item">
        <strong>📊 Latest Vitals:</strong><br>
        Current Weight: ${latestVitals.weight || '—'} lbs<br>
        Heart Rate: ${latestVitals.hr || '—'} bpm<br>
        Blood Pressure: ${latestVitals.bp || '—'}<br>
      </div>
      <div class="summary-item">
        <strong>🎯 Progress:</strong><br>
        Days Post-Op: ${this.state.user.currentMonth ? (this.state.user.currentMonth * 30) : '—'}<br>
        Adherence: ${adherence}%<br>
        Weight Loss Pace: ${this.getWeightLossPace() || '—'} lbs/week<br>
      </div>
      <div class="summary-item">
        <strong>💊 Active Medications:</strong><br>
        ${this.state.medications?.list?.length || 0} supplements/medications<br>
        <strong>🍽️ Nutrition:</strong><br>
        Following post-op meal plan<br>
      </div>
      <div class="summary-item">
        <strong>🎪 Non-Scale Victories:</strong><br>
        Energy level improving<br>
        Sleep: ${this.getAverageSleep()} hours/night<br>
      </div>
    `;
  }

  getLatestVitals() {
    const vitals = this.state.vitals || {};
    return {
      weight: vitals.weight?.[vitals.weight.length - 1]?.value || null,
      hr: vitals.heartRate?.[vitals.heartRate.length - 1]?.value || null,
      bp: vitals.bloodPressure?.[vitals.bloodPressure.length - 1]
        ? `${vitals.bloodPressure[vitals.bloodPressure.length - 1].systolic}/${vitals.bloodPressure[vitals.bloodPressure.length - 1].diastolic}`
        : null,
    };
  }

  getWeightLossPace() {
    const weights = this.state.vitals?.weight || [];
    if (weights.length < 2) return null;
    const oldest = weights[0].value;
    const newest = weights[weights.length - 1].value;
    const lbsLost = oldest - newest;
    const daysLogged = (new Date(weights[weights.length - 1].date) - new Date(weights[0].date)) / (1000 * 60 * 60 * 24);
    const pace = (lbsLost / daysLogged) * 7;
    return pace.toFixed(1);
  }

  getAverageSleep() {
    const sleepLogs = this.state.sleep?.logs || [];
    if (sleepLogs.length === 0) return '—';
    const avg = sleepLogs.reduce((sum, log) => sum + log.hours, 0) / sleepLogs.length;
    return avg.toFixed(1);
  }

  calculateAdherence() {
    const medications = this.state.medications?.list || [];
    if (medications.length === 0) return 100;
    const taken = Object.values(this.state.medications?.todaysTaken || {})
      .filter(v => v).length;
    return Math.round((taken / medications.length) * 100) || 0;
  }

  exportSummary() {
    const summary = document.getElementById('visit-summary').innerText;
    const dataStr = `PRE-VISIT SUMMARY\n${new Date().toLocaleDateString()}\n\n${summary}`;
    const blob = new Blob([dataStr], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `post-op-visit-summary-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
