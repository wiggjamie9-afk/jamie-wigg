// Dashboard real-time updates and vitals display
class DashboardManager {
  constructor() {
    this.updateInterval = 60000; // Update every 60 seconds
    this.refreshRate = 5000; // Check for new data every 5 seconds
  }

  init() {
    // Auto-refresh dashboard
    this.startAutoRefresh();
  }

  startAutoRefresh() {
    setInterval(() => {
      if (window.app) {
        window.app.refreshDashboard();
      }
    }, this.updateInterval);
  }

  displayVitalsCard(vitals) {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <div class="stat-label">${vitals.label}</div>
      <div class="stat-value">${vitals.value}</div>
      <div class="stat-change ${vitals.changeClass}">${vitals.change}</div>
    `;
    return card;
  }

  generateAlertLevel(metric, value, normalRange) {
    if (value < normalRange.min || value > normalRange.max) {
      if (Math.abs(value - normalRange.max) > normalRange.max * 0.2) {
        return 'danger';
      }
      return 'warning';
    }
    return 'success';
  }

  calculateHealthScore(vitals) {
    let score = 100;

    // Weight stability (ideal: 1-2 lbs/week loss)
    if (vitals.weight && vitals.weight.length > 7) {
      const lastWeek = vitals.weight.slice(-7);
      const loss = lastWeek[0] - lastWeek[lastWeek.length - 1];
      if (loss > 5) score -= 20; // Too fast
      if (loss < 0.5) score -= 10; // Too slow
    }

    // HR stability (ideal: 60-100 bpm)
    if (vitals.heartRate && vitals.heartRate.length > 0) {
      const avg = vitals.heartRate[vitals.heartRate.length - 1];
      if (avg < 60 || avg > 100) score -= 15;
    }

    // BP control (ideal: <130/80)
    if (vitals.bloodPressure && vitals.bloodPressure.length > 0) {
      const latest = vitals.bloodPressure[vitals.bloodPressure.length - 1];
      if (latest.match(/\d+\/\d+/)) {
        const [sys, dia] = latest.split('/').map(Number);
        if (sys > 130 || dia > 80) score -= 15;
      }
    }

    return Math.max(0, Math.min(100, score));
  }
}

const dashboardManager = new DashboardManager();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  dashboardManager.init();
});
