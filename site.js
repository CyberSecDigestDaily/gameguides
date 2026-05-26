/*
  Blood Guides — Shared Site JS
  Handles: theme, mobile nav, sticky dropdowns, search overlay
*/

(function () {
  'use strict';

  var STORAGE_KEY = 'bg-theme';

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

    /* ── Global search overlay (guide pages) ── */
    /* Only inject on non-homepage pages (homepage injects its own with richer data) */
    if (!document.getElementById('search-overlay') && document.querySelector('.site-nav')) {
      var GUIDES_DATA = [
        { title: 'Samurai Bleed Build',       game: 'Elden Ring',  url: '/samurai-bleed-build/',                  desc: 'Bleed katana build, high Arcane + Rivers of Blood.' },
        { title: 'Tank Build (Great Shield)',  game: 'Elden Ring',  url: '/elden-ring-tank-build/',                desc: 'Fingerprint Stone Shield + Giant Crusher, guard counter loop.' },
        { title: 'Dragon Faith Build',         game: 'Elden Ring',  url: '/dragon-faith-build/',                   desc: 'Dragon Communion incantations, Arcane + Faith hybrid.' },
        { title: 'Rivers of Blood Build',      game: 'Elden Ring',  url: '/rivers-of-blood-build/',                desc: 'Bleed katana, Corpse Piler burst damage.' },
        { title: 'Necromancer Minion Build',   game: 'Diablo 4',    url: '/diablo4-necromancer-minion-build/',     desc: 'Undead army, bone skills, summon strategy.' },
        { title: 'Druid Bear Build',           game: 'Diablo 4',    url: '/diablo4-druid-bear-build/',             desc: 'Werebear, Pulverize shockwave, tanky melee.' },
        { title: 'Paladin Blessed Hammer',     game: 'Diablo 4',    url: '/diablo4-paladin-blessed-hammer-build/', desc: 'S-Tier holy damage, Blessed Hammer spam.' },
        { title: 'Whirlwind Barbarian',        game: 'Diablo 4',    url: '/diablo4-whirlwind-barbarian-build/',    desc: 'Endless Whirlwind uptime, high area damage.' }
      ];

      var overlay = document.createElement('div');
      overlay.id = 'search-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'Search guides');
      overlay.innerHTML =
        '<div id="search-box">' +
          '<div id="search-input-wrap">' +
            '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="6"/><line x1="13.5" y1="13.5" x2="18" y2="18"/></svg>' +
            '<input id="search-input" type="text" placeholder="Search guides, games, builds…" autocomplete="off" spellcheck="false">' +
            '<button id="search-close" aria-label="Close search">✕</button>' +
          '</div>' +
          '<div id="search-results"></div>' +
          '<div id="search-hint"><span><kbd>↵</kbd> to open</span><span><kbd>Esc</kbd> to close</span></div>' +
        '</div>';
      document.body.appendChild(overlay);

      var searchInput   = document.getElementById('search-input');
      var searchResults = document.getElementById('search-results');
      var searchClose   = document.getElementById('search-close');

      function renderSearchResults(q) {
        var term = q.toLowerCase().trim();
        var matched = term === '' ? GUIDES_DATA : GUIDES_DATA.filter(function (g) {
          return g.title.toLowerCase().indexOf(term) !== -1 ||
                 g.game.toLowerCase().indexOf(term) !== -1 ||
                 g.desc.toLowerCase().indexOf(term) !== -1;
        });
        if (!matched.length) {
          searchResults.innerHTML = '<div class="search-empty">No guides found for "<strong>' + q + '</strong>"</div>';
          return;
        }
        searchResults.innerHTML = matched.map(function (g) {
          return '<a class="search-result" href="' + g.url + '">' +
            '<div class="search-result-game">' + g.game + '</div>' +
            '<div><div class="search-result-title">' + g.title + '</div>' +
            '<div class="search-result-desc">' + g.desc + '</div></div></a>';
        }).join('');
      }

      function openSearchOverlay() {
        overlay.classList.add('open');
        searchInput.value = '';
        renderSearchResults('');
        setTimeout(function () { searchInput.focus(); }, 50);
      }

      function closeSearchOverlay() { overlay.classList.remove('open'); }

      searchClose.addEventListener('click', closeSearchOverlay);
      overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearchOverlay(); });
      searchInput.addEventListener('input', function () { renderSearchResults(searchInput.value); });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeSearchOverlay(); return; }
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearchOverlay(); return; }
        if (e.key === 'Enter' && overlay.classList.contains('open')) {
          var first = searchResults.querySelector('.search-result');
          if (first) window.location.href = first.href;
        }
      });

      /* Wire any search button in the guide nav */
      document.querySelectorAll('[aria-label="Search"]').forEach(function (btn) {
        btn.addEventListener('click', function (e) { e.stopPropagation(); openSearchOverlay(); });
      });

      renderSearchResults('');
    }

    /* ── Sticky dropdown menus (JS-driven, replaces CSS :hover) ── */
    /* Applies to both .nav-dropdown (homepage) and .site-nav-links > li (guide pages) */
    function wireDropdown(trigger, menu) {
      var hideTimer = null;

      function open() {
        clearTimeout(hideTimer);
        /* Close any other open menus first */
        document.querySelectorAll('.nav-dropdown-menu.dd-open, .site-nav-links > li > ul.dd-open').forEach(function (m) {
          if (m !== menu) m.classList.remove('dd-open');
        });
        menu.classList.add('dd-open');
      }

      function scheduledClose() {
        hideTimer = setTimeout(function () {
          menu.classList.remove('dd-open');
        }, 120);
      }

      trigger.addEventListener('mouseenter', open);
      trigger.addEventListener('mouseleave', scheduledClose);
      menu.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
      menu.addEventListener('mouseleave', scheduledClose);

      /* Click on trigger also toggles (touch-friendly) */
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        if (menu.classList.contains('dd-open')) {
          menu.classList.remove('dd-open');
        } else {
          open();
        }
      });
    }

    /* Homepage .nav-dropdown */
    document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
      var trigger = dd.querySelector('.nav-dropdown-trigger');
      var menu    = dd.querySelector('.nav-dropdown-menu');
      if (trigger && menu) wireDropdown(trigger, menu);
    });

    /* Guide-page .site-nav-links > li with sub-ul */
    document.querySelectorAll('.site-nav-links > li').forEach(function (li) {
      var trigger = li.querySelector('a');
      var menu    = li.querySelector('ul');
      if (trigger && menu) wireDropdown(trigger, menu);
    });

    /* Close all dropdowns on outside click */
    document.addEventListener('click', function () {
      document.querySelectorAll('.dd-open').forEach(function (m) {
        m.classList.remove('dd-open');
      });
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
