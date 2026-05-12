/*
  Blood Guides — Shared Site JS
  Handles: light/dark theme toggle, nav active state
*/

(function () {
  'use strict';

  /* ── THEME TOGGLE ───────────────────────────────────────────────────────── */

  const STORAGE_KEY = 'bg-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    if (theme === 'light') {
      btn.innerHTML = '<span class="toggle-icon">🌙</span> Dark';
      btn.title = 'Switch to dark mode';
    } else {
      btn.innerHTML = '<span class="toggle-icon">☀️</span> Light';
      btn.title = 'Switch to light mode';
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
    applyTheme(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  /* ── INIT ───────────────────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();

    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }
  });

  /* Apply theme immediately (before DOMContentLoaded) to prevent flash */
  (function () {
    const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  })();

})();
