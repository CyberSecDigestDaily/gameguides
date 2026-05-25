/*
  Blood Guides — Shared Site JS
  Handles: light/dark theme toggle, mobile nav toggle
*/

(function () {
  'use strict';

  const STORAGE_KEY = 'bg-theme';

  /* ── Theme ── */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      if (theme === 'light') {
        btn.innerHTML = '<span class="toggle-icon">🌙</span> Dark';
        btn.title = 'Switch to dark mode';
      } else {
        btn.innerHTML = '<span class="toggle-icon">☀️</span> Light';
        btn.title = 'Switch to light mode';
      }
    });
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  /* Apply before DOMContentLoaded to prevent flash */
  var saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(saved);

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });

    /* ── Mobile nav toggle ── */
    document.querySelectorAll('.nav-mobile-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var controlsId = toggle.getAttribute('aria-controls');
        var nav = document.getElementById(controlsId) ||
                  document.querySelector('.nav') ||
                  document.querySelector('.site-nav-links');
        if (!nav) return;

        var isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.textContent = isOpen ? '✕' : '☰';
      });
    });

    /* Close mobile nav on outside click */
    document.addEventListener('click', function (e) {
      if (!e.target.closest('header') && !e.target.closest('.site-nav')) {
        document.querySelectorAll('.nav, .site-nav-links').forEach(function (nav) {
          nav.classList.remove('open');
        });
        document.querySelectorAll('.nav-mobile-toggle').forEach(function (t) {
          t.setAttribute('aria-expanded', 'false');
          t.textContent = '☰';
        });
      }
    });

    /* Mark active nav link based on current path */
    var path = window.location.pathname;
    document.querySelectorAll('.nav-link, .site-nav-links > li > a').forEach(function (a) {
      if (a.getAttribute('href') === path || (path === '/' && a.getAttribute('href') === '/')) {
        a.classList.add('active');
      }
    });
  });

}());

/* ── ITEM TOOLTIPS ───────────────────────────────────────────────────────────
   Usage: <span class="itip" data-type="Weapon" data-name="Rivers of Blood"
             data-desc="Description here." data-stats="DEX 18 / ARC 20">
             Rivers of Blood</span>
   All data-* attributes optional except at least data-name or inner text.
*/
(function () {
  'use strict';

  var popup = null;
  var hideTimer = null;
  var OFFSET = 16;

  function getPopup() {
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'itip-popup';
      document.body.appendChild(popup);
    }
    return popup;
  }

  function show(el, e) {
    clearTimeout(hideTimer);
    var p = getPopup();

    var type  = el.dataset.type  || '';
    var name  = el.dataset.name  || el.textContent.trim();
    var desc  = el.dataset.desc  || '';
    var stats = el.dataset.stats || '';

    p.innerHTML =
      (type  ? '<div class="itip-type">'  + type  + '</div>' : '') +
      '<div class="itip-name">'  + name  + '</div>' +
      (desc  ? '<div class="itip-desc">'  + desc  + '</div>' : '') +
      (stats ? '<div class="itip-stats">' + stats + '</div>' : '');

    /* position before showing so offsetWidth/Height are accurate */
    p.style.left = '-9999px';
    p.style.top  = '-9999px';
    p.classList.add('itip-visible');

    position(e);
  }

  function position(e) {
    if (!popup || !popup.classList.contains('itip-visible')) return;
    var x = e.clientX + OFFSET;
    var y = e.clientY + OFFSET;
    var w = popup.offsetWidth  || 280;
    var h = popup.offsetHeight || 100;
    if (x + w > window.innerWidth  - 8) x = e.clientX - w - OFFSET;
    if (y + h > window.innerHeight - 8) y = e.clientY - h - OFFSET;
    popup.style.left = x + 'px';
    popup.style.top  = y + 'px';
  }

  function hide() {
    if (!popup) return;
    popup.classList.remove('itip-visible');
  }

  function scheduleHide() {
    hideTimer = setTimeout(hide, 80);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.itip').forEach(function (el) {
      el.addEventListener('mouseenter', function (e) { show(el, e); });
      el.addEventListener('mousemove',  function (e) { position(e); });
      el.addEventListener('mouseleave', scheduleHide);
      /* touch: tap to toggle */
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        if (popup && popup.classList.contains('itip-visible')) {
          hide();
        } else {
          show(el, e);
        }
      });
    });
    document.addEventListener('click', hide);
    document.addEventListener('scroll', hide, { passive: true });
  });
}());
