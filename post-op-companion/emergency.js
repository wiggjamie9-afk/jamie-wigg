// Emergency & Crisis Resources
class EmergencyResources {
  constructor(app) {
    this.app = app;
    this.state = app.state;
    if (!this.state.emergency) {
      this.state.emergency = {
        surgeonPhone: '',
      };
    }
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.populateEmergencyCard();
  }

  setupEventListeners() {
    const surgeonBtn = document.getElementById('save-surgeon-btn');
    if (surgeonBtn) {
      surgeonBtn.addEventListener('click', () => this.saveSurgeon());
    }

    const downloadBtn = document.getElementById('download-card-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadCard());
    }
  }

  saveSurgeon() {
    const phone = document.getElementById('surgeon-phone').value;
    if (!phone) {
      alert('Please enter surgeon phone number');
      return;
    }
    this.state.emergency.surgeonPhone = phone;
    this.app.saveState();
    alert(`✓ Saved surgeon phone: ${phone}`);

    // Update card
    this.populateEmergencyCard();
  }

  populateEmergencyCard() {
    const cardSurgery = document.getElementById('card-surgery');
    const cardDate = document.getElementById('card-date');
    const cardSurgeon = document.getElementById('card-surgeon');
    const cardPhone = document.getElementById('card-surgeon-phone');

    if (cardSurgery && this.state.user.surgeryType) {
      cardSurgery.textContent = this.state.user.surgeryType.replace('-', ' ').toUpperCase();
    }
    if (cardDate && this.state.user.surgeryDate) {
      cardDate.textContent = new Date(this.state.user.surgeryDate).toLocaleDateString();
    }
    if (this.state.emergency.surgeonPhone && cardPhone) {
      cardPhone.textContent = this.state.emergency.surgeonPhone;
    }
  }

  downloadCard() {
    const cardDiv = document.getElementById('emergency-card-preview');
    if (!cardDiv) return;

    const html = cardDiv.innerHTML;
    const printWindow = window.open('', '', 'height=400,width=600');
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .card-preview {
              border: 2px solid #D291BC;
              border-radius: 12px;
              padding: 20px;
              background: linear-gradient(135deg, #FFE4E1, #FFF0F5);
              max-width: 500px;
            }
            .card-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #A8639C;
            }
            .card-info {
              font-size: 16px;
              line-height: 1.8;
            }
            .card-info p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="card-preview">
            ${html}
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            Keep this card with you. Save a screenshot or print and laminate.
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  }

  // Check for emergency conditions
  checkEmergencyFlags() {
    const latestVitals = this.state.vitals;
    const latestHR = latestVitals.heartRate[latestVitals.heartRate.length - 1];
    const latestBP = latestVitals.bloodPressure[latestVitals.bloodPressure.length - 1];
    const latestWeight = latestVitals.weight[latestVitals.weight.length - 1];

    const emergencyFlags = [];

    if (latestHR && latestHR.value > 120 || latestHR.value < 50) {
      emergencyFlags.push('Heart rate abnormal — call surgeon');
    }
    if (latestBP && latestBP.systolic > 160 || latestBP.diastolic > 100) {
      emergencyFlags.push('Blood pressure critically high — call surgeon');
    }
    if (latestBP && latestBP.systolic < 90 || latestBP.diastolic < 60) {
      emergencyFlags.push('Blood pressure dangerously low — call 911');
    }

    return emergencyFlags;
  }
}
