import { initShield } from './modules/shield.js';
import { authenticateUser, loadSession, clearSession } from './modules/auth.js';
import { renderDashboard } from './modules/render.js';

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  initShield();

  const loginGate = document.getElementById('login-gate');
  const dashboardRoot = document.getElementById('dashboard-root');
  const passwordInput = document.getElementById('passcode-input');
  const loginBtn = document.getElementById('login-btn');
  const loginError = document.getElementById('login-error');
  const loadingOverlay = document.getElementById('loading-overlay');

  const showLoading = (show) => {
    if (loadingOverlay) {
      if (show) {
        loadingOverlay.classList.remove('hidden');
        loadingOverlay.classList.add('flex');
      } else {
        loadingOverlay.classList.add('hidden');
        loadingOverlay.classList.remove('flex');
      }
    }
  };

  const showError = (msg) => {
    if (loginError) {
      loginError.textContent = msg;
      loginError.classList.remove('hidden');
      setTimeout(() => {
        loginError.classList.add('hidden');
      }, 5000);
    }
  };

  const runAuth = async (passcode) => {
    if (!passcode) {
      showError("Passcode string required.");
      return;
    }

    showLoading(true);

    try {
      const result = await authenticateUser(passcode);
      if (result.success) {
        renderDashboard(result.dashboardData, performLogout);
      } else {
        showError(result.error || "Access Denied.");
        clearSession();
      }
    } catch (err) {
      showError("Initialization error. Pixels carrier modified or server connection interrupted.");
      clearSession();
    } finally {
      showLoading(false);
    }
  };

  const performLogout = () => {
    clearSession();
    if (passwordInput) {
      passwordInput.value = '';
    }
    window.location.reload();
  };

  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const pass = passwordInput ? passwordInput.value : '';
      runAuth(pass);
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const pass = passwordInput.value;
        runAuth(pass);
      }
    });
  }

  const checkStoredSession = () => {
    const savedPass = loadSession();
    if (savedPass) {
      runAuth(savedPass);
    } else {
      if (loginGate) {
        loginGate.classList.remove('hidden');
      }
    }
  };

  checkStoredSession();
});
