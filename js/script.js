/* ============================================================
   THEME SYSTEM  —  6 themes
============================================================ */
const THEMES = ['cyber', 'dark', 'ocean', 'forest', 'sunset', 'mono'];
const LABELS = {
  cyber:  '⚡ Cyber',
  dark:   '🌑 Dark',
  ocean:  '🌊 Ocean',
  forest: '🌿 Forest',
  sunset: '🌅 Sunset',
  mono:   '◆ Mono'
};

let currentTheme = localStorage.getItem('theme') || 'cyber';

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  currentTheme = theme;
  localStorage.setItem('theme', theme);

  // Update toggle button label
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = LABELS[theme];

  // Update active dot
  document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.theme === theme);
  });
}

function cycleTheme() {
  const idx = THEMES.indexOf(currentTheme);
  const next = THEMES[(idx + 1) % THEMES.length];
  applyTheme(next);
}

function initTheme() {
  applyTheme(currentTheme);

  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', cycleTheme);

  document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.addEventListener('click', () => applyTheme(dot.dataset.theme));
  });
}

document.addEventListener('DOMContentLoaded', initTheme);