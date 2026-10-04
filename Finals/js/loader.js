'use strict';
/* ---------- LOADER: lifts shortly after window load, 2.5s failsafe ---------- */
(function liftLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const lift = () => {
    loader.classList.add('lifted');
    setTimeout(() => loader.remove(), 800);
  };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { lift(); return; }
  if (document.readyState === 'complete') setTimeout(lift, 700);
  else window.addEventListener('load', () => setTimeout(lift, 700), { once: true });
  setTimeout(() => { if (document.body.contains(loader)) lift(); }, 2500); // failsafe
})();
