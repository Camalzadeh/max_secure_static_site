/**
 * Maximum Secure Static Site - Main Application Gateway
 * 
 * SPA coordinator managing visual states, binding auth events,
 * and initializing safety keyboard/mouse shields.
 */

import { initShield } from './modules/shield.js';
import { authenticateUser, loadSession, clearSession } from './modules/auth.js';
import { renderDashboard } from './modules/render.js';

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Run Input protection layers immediately
  initShield();

  // DOM elements
  const loginGate = document.getElementById('login-gate');
  const dashboardRoot = document.getElementById('dashboard-root');
  const passwordInput = document.getElementById('passcode-input');
  const loginBtn = document.getElementById('login-btn');
  const loginError = document.getElementById('login-error');
  const loadingOverlay = document.getElementById('loading-overlay');

  // Utility to show/hide loading states
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

  // Perform user authentication
  const runAuth = async (passcode) => {
    if (!passcode) {
      showError("Passcode string required.");
      return;
    }

    showLoading(true);

    try {
      const result = await authenticateUser(passcode);
      
      if (result.success) {
        // Authenticated! Render secure closed shadow dashboard
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

  // Disconnect / Logout callback
  const performLogout = () => {
    clearSession();
    if (passwordInput) {
      passwordInput.value = '';
    }
    // Reload page dynamically to clean memory, reset globals, and re-engage shields
    window.location.reload();
  };

  // Bind Form Click Handler
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

  // 2. Perform Auto-Login Session Check
  const checkStoredSession = () => {
    const savedPass = loadSession();
    if (savedPass) {
      runAuth(savedPass);
    } else {
      // Show login container explicitly
      if (loginGate) {
        loginGate.classList.remove('hidden');
      }
    }
  };

  checkStoredSession();
});
