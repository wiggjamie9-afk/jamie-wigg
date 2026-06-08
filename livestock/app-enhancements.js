// HerdCheck MVP Enhancements
// Wraps existing functionality with better error handling, validation, and UX
(function() {
  const { UI } = window.HC;

  // Enhance the save check functions
  window.HC = window.HC || {};
  window.HC.enhance = {
    // Validate lameness check before save
    validateLamenessCheck(state) {
      if (state.lameness.score === null) {
        UI.toast('Please select a lameness score (1-5)', 'error');
        return false;
      }
      if (!state.lameness.videoBlob) {
        UI.toast('Please record a walking video', 'error');
        return false;
      }
      return true;
    },

    // Validate mastitis check before save
    validateMastitisCheck(state) {
      const hasSign = Object.values(state.mastitis.signs).some(v => v);
      if (!hasSign && !state.mastitis.imageBlob) {
        UI.toast('Please either select symptoms or upload a photo', 'error');
        return false;
      }
      return true;
    },

    // Validate calving check before save
    validateCalvingCheck(state) {
      const hasSign = Object.values(state.calving.signs).some(v => v);
      if (!hasSign) {
        UI.toast('Please select at least one behavioural sign', 'error');
        return false;
      }
      return true;
    },

    // Confirm before delete
    async confirmDelete(animalName) {
      return await UI.confirm(
        'Delete animal?',
        `Are you sure you want to remove ${animalName}? This cannot be undone.`,
        'Delete',
        'Cancel'
      );
    },

    // Confirm before export
    async confirmExport(format) {
      return await UI.confirm(
        `Export as ${format.toUpperCase()}?`,
        'This will export all your herd data. You can import it later to restore.',
        'Export',
        'Cancel'
      );
    },

    // Wrap async operations with error handling and loading state
    async withLoader(operation, message = 'Loading...') {
      const loader = UI.showLoader(message);
      try {
        const result = await operation();
        UI.hideLoader();
        return result;
      } catch (error) {
        UI.hideLoader();
        console.error(error);
        UI.toast(`Error: ${error.message}`, 'error');
        throw error;
      }
    },

    // Validate form inputs
    validateField(fieldId, rules = {}) {
      const field = document.getElementById(fieldId);
      if (!field) return true;

      const value = field.value.trim();

      if (rules.required && !value) {
        UI.markFieldError(fieldId, 'This field is required');
        return false;
      }

      if (rules.minLength && value.length < rules.minLength) {
        UI.markFieldError(fieldId, `Must be at least ${rules.minLength} characters`);
        return false;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        UI.markFieldError(fieldId, rules.errorMsg || 'Invalid format');
        return false;
      }

      if (rules.date && !UI.validateDate(value)) {
        UI.markFieldError(fieldId, 'Please select a valid past date');
        return false;
      }

      UI.clearFieldError(fieldId);
      return true;
    },

    // Validate entire form
    validateForm(fieldRules) {
      let isValid = true;
      for (const [fieldId, rules] of Object.entries(fieldRules)) {
        if (!this.validateField(fieldId, rules)) {
          isValid = false;
        }
      }
      return isValid;
    },
  };

  // Monitor online/offline status
  window.addEventListener('online', () => {
    document.getElementById('online-dot').classList.remove('offline');
    UI.toast('Back online', 'success', 2000);
  });

  window.addEventListener('offline', () => {
    document.getElementById('online-dot').classList.add('offline');
    UI.toast('You are offline — data is saved locally', 'warning', 3000);
  });

  // Prevent accidental navigation away if unsaved changes exist
  window.addEventListener('beforeunload', (e) => {
    const unsaved = sessionStorage.getItem('herdcheck_unsaved');
    if (unsaved === 'true') {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  console.log('[HerdCheck] MVP Enhancements loaded');
})();
