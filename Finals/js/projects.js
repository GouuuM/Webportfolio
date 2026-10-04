'use strict';
/* ---------- PROJECT VIDEO HOVER ---------- */
const canHover = window.matchMedia('(hover:hover)').matches;
if (canHover) {
  document.querySelectorAll('.media-card').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
  });
}
