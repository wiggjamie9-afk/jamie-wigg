// HerdCheck UI Utilities — toasts, modals, loaders
(function() {
  const UI = {
    // Toast notifications
    toast(message, type = 'info', duration = 3000) {
      const container = document.getElementById('toast-container') || (() => {
        const c = document.createElement('div');
        c.id = 'toast-container';
        document.body.appendChild(c);
        return c;
      })();

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = message;

      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    // Modal dialog
    async confirm(title, message, okText = 'Confirm', cancelText = 'Cancel') {
      return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
          <div class="modal">
            <h2>${title}</h2>
            <p>${message}</p>
            <div class="modal-buttons">
              <button class="btn btn-secondary modal-cancel">${cancelText}</button>
              <button class="btn btn-primary modal-ok">${okText}</button>
            </div>
          </div>
        `;

        const okBtn = modal.querySelector('.modal-ok');
        const cancelBtn = modal.querySelector('.modal-cancel');

        okBtn.addEventListener('click', () => {
          modal.remove();
          resolve(true);
        });

        cancelBtn.addEventListener('click', () => {
          modal.remove();
          resolve(false);
        });

        document.body.appendChild(modal);
        okBtn.focus();
      });
    },

    // Loading spinner
    showLoader(message = 'Loading...') {
      const loader = document.createElement('div');
      loader.id = 'loader';
      loader.className = 'loader';
      loader.innerHTML = `
        <div class="spinner"></div>
        <p>${message}</p>
      `;
      document.body.appendChild(loader);
      return loader;
    },

    hideLoader() {
      const loader = document.getElementById('loader');
      if (loader) loader.remove();
    },

    // Form validation
    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    validatePhoneNumber(phone) {
      return /^[\d\s\-\+\(\)]{7,}$/.test(phone.replace(/\s/g, ''));
    },

    validateDate(dateString) {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) && date <= new Date();
    },

    // Input validation feedback
    markFieldError(fieldId, message) {
      const field = document.getElementById(fieldId);
      if (!field) return;

      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');

      let errorMsg = field.parentElement?.querySelector('.error-message');
      if (!errorMsg) {
        errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        field.parentElement?.appendChild(errorMsg);
      }
      errorMsg.textContent = message;
    },

    clearFieldError(fieldId) {
      const field = document.getElementById(fieldId);
      if (!field) return;

      field.classList.remove('error');
      field.setAttribute('aria-invalid', 'false');

      const errorMsg = field.parentElement?.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();
    },

    // Async operation with error handling
    async withErrorHandler(fn, context = 'Operation') {
      try {
        return await fn();
      } catch (error) {
        console.error(`[${context}]`, error);
        this.toast(`${context} failed: ${error.message}`, 'error');
        throw error;
      }
    },
  };

  window.HC = window.HC || {};
  window.HC.UI = UI;
})();
