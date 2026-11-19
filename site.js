/* Research-theme explorer: the circles in the hero and the tabs in the
   explorer card both carry data-theme="<id>"; each panel in the explorer
   carries data-theme-id="<id>". Clicking a circle or tab shows that panel.
   All content lives in index.html; this file only toggles visibility. */
(function () {
  'use strict';

  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-theme]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.theme-panel'));
  if (!buttons.length || !panels.length) { return; }

  var ids = panels.map(function (p) { return p.getAttribute('data-theme-id'); });

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function activate(id, opts) {
    opts = opts || {};
    if (ids.indexOf(id) === -1) { return; }

    panels.forEach(function (p) {
      p.hidden = p.getAttribute('data-theme-id') !== id;
    });
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-theme') === id));
    });

    if (opts.scroll) {
      var target = document.getElementById('explorer');
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      }
    }
    if (opts.hash && window.history && history.replaceState) {
      history.replaceState(null, '', '#theme-' + id);
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      activate(b.getAttribute('data-theme'), {
        scroll: b.classList.contains('orbit-circle'),
        hash: true
      });
    });
  });

  // Deep links of the form #theme-<id> open that theme on load.
  var fromHash = (window.location.hash || '').replace(/^#theme-/, '');
  var known = ids.indexOf(fromHash) !== -1;
  activate(known ? fromHash : ids[0], { scroll: known });

  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();
