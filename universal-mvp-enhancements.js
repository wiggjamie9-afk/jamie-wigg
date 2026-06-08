/**
 * Universal MVP Quality Enhancements
 * Applied to all untapped/ apps for consistency
 */

'use strict';

/* ─────────────────────── Offline Detection ─────────────────────── */
(function initOfflineDetection() {
  const showOfflineToast = () => {
    if (typeof toast === 'function') {
      toast('📡 You\'re offline. Some features may be limited.', { kind: 'warn', duration: 3000 });
    }
  };

  const showOnlineToast = () => {
    if (typeof toast === 'function') {
      toast('✓ Back online', { kind: 'success', duration: 2000 });
    }
  };

  if (!navigator.onLine) {
    showOfflineToast();
  }

  window.addEventListener('offline', showOfflineToast);
  window.addEventListener('online', showOnlineToast);
})();

/* ─────────────────────── File Upload Validation ─────────────────────── */
function validateFileUpload(file, opts = {}) {
  const errors = [];
  const maxSize = opts.maxSize || 10 * 1024 * 1024;
  const allowedTypes = opts.types || ['image/jpeg', 'image/png'];

  if (!file) {
    return { valid: false, errors: ['No file selected'] };
  }

  if (file.size > maxSize) {
    errors.push(`File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/* ─────────────────────── Confirmation Dialogs ─────────────────────── */
function confirmAction(title, desc, dangerZone = false) {
  return new Promise(resolve => {
    const backdrop = document.createElement('div');
    backdrop.className = 'mvp-confirm-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'confirmTitle');

    const dialog = document.createElement('div');
    dialog.className = 'mvp-confirm-dialog';

    const titleEl = document.createElement('div');
    titleEl.id = 'confirmTitle';
    titleEl.className = 'mvp-confirm-title';
    titleEl.textContent = title;

    const descEl = document.createElement('p');
    descEl.className = 'mvp-confirm-desc';
    descEl.textContent = desc;

    const footer = document.createElement('div');
    footer.className = 'mvp-confirm-footer';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'mvp-confirm-btn mvp-confirm-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
      backdrop.remove();
      resolve(false);
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.className = dangerZone ? 'mvp-confirm-btn mvp-confirm-danger' : 'mvp-confirm-btn mvp-confirm-primary';
    confirmBtn.textContent = 'Confirm';
    confirmBtn.addEventListener('click', () => {
      backdrop.remove();
      resolve(true);
    });

    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);

    dialog.appendChild(titleEl);
    dialog.appendChild(descEl);
    dialog.appendChild(footer);
    backdrop.appendChild(dialog);

    document.body.appendChild(backdrop);
    confirmBtn.focus();

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.remove();
        resolve(false);
      }
    });
  });
}

/* ─────────────────────── LocalStorage Helpers ─────────────────────── */
const StorageHelper = {
  get: (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.warn('Storage.get failed for', key, err);
      return fallback;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn('Storage.set failed for', key, err);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn('Storage.remove failed for', key, err);
      return false;
    }
  }
};

/* ─────────────────────── MVP Toast Styles ─────────────────────── */
(function injectToastStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .mvp-toast-stack {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }

    .mvp-toast {
      background: #1c1c1e;
      color: #fafaf7;
      padding: 12px 18px;
      border-radius: 10px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      animation: mvpToastIn 0.25s ease-out;
      pointer-events: auto;
    }

    .mvp-toast-exit {
      animation: mvpToastOut 0.25s ease-out forwards;
    }

    @keyframes mvpToastIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes mvpToastOut {
      to { opacity: 0; transform: translateY(8px); }
    }

    .mvp-toast-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .mvp-toast-dot.success { background: #4f8a5b; }
    .mvp-toast-dot.warn { background: #b07d2c; }
    .mvp-toast-dot.info { background: #6b4f7a; }

    .mvp-confirm-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(28,28,30,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    }

    .mvp-confirm-dialog {
      background: #fafaf7;
      border-radius: 16px;
      padding: 24px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      animation: mvpConfirmIn 0.25s ease-out;
    }

    @keyframes mvpConfirmIn {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .mvp-confirm-title {
      font-size: 18px;
      font-weight: 600;
      color: #1c1c1e;
      margin-bottom: 10px;
    }

    .mvp-confirm-desc {
      font-size: 14px;
      color: #545458;
      line-height: 1.55;
      margin-bottom: 24px;
    }

    .mvp-confirm-footer {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .mvp-confirm-btn {
      padding: 11px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s;
    }

    .mvp-confirm-cancel {
      background: #e6e3dc;
      color: #1c1c1e;
    }

    .mvp-confirm-cancel:hover {
      background: #d8d4ca;
    }

    .mvp-confirm-primary {
      background: #1c1c1e;
      color: #fafaf7;
    }

    .mvp-confirm-primary:hover {
      background: #3a3a3c;
    }

    .mvp-confirm-danger {
      background: #a04545;
      color: #fafaf7;
    }

    .mvp-confirm-danger:hover {
      background: #8a3a3a;
    }
  `;
  document.head.appendChild(style);
})();
