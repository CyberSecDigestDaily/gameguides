/*
  Blood Guides — Shared Site JS
  Handles: light/dark theme toggle, nav active state
*/

(function () {
  'use strict';

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

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  /* Apply theme immediately (before DOMContentLoaded) to prevent flash */
  const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(saved);
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
  });

})();
