'use strict';
/* ---------- ARTIST / INSPIRATION CARDS: one merged dark set ---------- */
// Single darkmode theme: each artist rotates its three albums on one track.
const TS_TRACK = "audio/Taylor-Swift-Look-What-You-Made-Me-Do.mp3";
const PM_TRACK = "audio/Paramore-Misery-Business.mp3";
const MCR_TRACK = "audio/MCR-Welcome-To-The-Black-Parade.mp3";
  const catalog = {
    ts: {
      audio: TS_TRACK,
      albums: [
        { src: 'artists/TS-Reputation.jpg', title: 'Reputation' },
        { src: 'artists/TS-Folklore.jpg', title: 'Folklore' },
        { src: 'artists/TS-TTPD.jpg', title: 'The Tortured Poets Department' }
      ]
    },
    pm: {
      audio: PM_TRACK,
      albums: [
        { src: 'artists/PM-Riot!.jpg', title: 'Riot!' },
        { src: 'artists/PM-Brand-New-Eyes.jpg', title: 'Brand New Eyes' },
        { src: 'artists/PM-Paramore.jpg', title: 'Paramore' }
      ]
    },
    mcr: {
      audio: MCR_TRACK,
      albums: [
        { src: 'artists/MCR-The-Black-Parade.jpg', title: 'The Black Parade' },
        { src: 'artists/MCR-Three-Cheers-For-Sweet-Revenge.jpg', title: 'Three Cheers for Sweet Revenge' },
        { src: 'artists/MCR-Danger-Days.jpg', title: 'Danger Days' }
      ]
    }
  };
const idx = { ts: 0, pm: 0, mcr: 0 };
const shuffleTimers = { ts: null, pm: null, mcr: null };
const SHUFFLE_MS = 2500;

  function currentSet(key) { return catalog[key]; }

function stopAllAudio(except) {
  document.querySelectorAll('audio[data-audio]').forEach(a => {
    if (a.getAttribute('data-audio') !== except && !a.paused) { a.pause(); }
  });
  document.querySelectorAll('[data-play]').forEach(b => {
    if (b.getAttribute('data-play') !== except) b.textContent = 'Play';
  });
}

function syncAudio(key, wasPlaying) {
  const set = currentSet(key);
  const audio = document.querySelector(`audio[data-audio="${key}"]`);
  const playBtn = document.querySelector(`[data-play="${key}"]`);
  if (!audio || !set) return;
  const file = set.audio.split('/').pop();
  const hasSrc = !!audio.getAttribute('src');
  const matches = hasSrc && (audio.src.includes(file) || audio.src.includes(encodeURI(file)));
  if (!matches) {
    audio.src = set.audio;
    audio.load();
    if (wasPlaying) {
      stopAllAudio(key);
      audio.play().catch(() => {});
      if (playBtn) playBtn.textContent = 'Pause';
    } else if (playBtn && audio.paused) {
      playBtn.textContent = 'Play';
    }
  }
    if (playBtn) playBtn.title = 'Play sample: ' + file;
}

function showAlbum(key, keepPlaying = false) {
  const set = currentSet(key);
  const album = set.albums[idx[key] % set.albums.length];
  const img = document.querySelector(`[data-album-img="${key}"]`);
  const title = document.querySelector(`[data-album-title="${key}"]`);
  if (!img || !title || !album) return;
  img.src = album.src;
  img.alt = album.title + ' album';
  title.textContent = album.title;
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && img.animate) {
    img.animate([{ opacity: 0.15 }, { opacity: 1 }], { duration: 350, easing: 'ease' });
    title.animate(
      [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
      { duration: 350, easing: 'ease' }
    );
  }
  const audio = document.querySelector(`audio[data-audio="${key}"]`);
  const wasPlaying = keepPlaying || (audio && !audio.paused && !audio.ended);
  syncAudio(key, wasPlaying);
}

function startShuffle(key) {
  stopShuffle(key);
  shuffleTimers[key] = setInterval(() => {
    idx[key] = (idx[key] + 1) % currentSet(key).albums.length;
    const audio = document.querySelector(`audio[data-audio="${key}"]`);
    const wasPlaying = audio && !audio.paused && !audio.ended;
    showAlbum(key, !!wasPlaying);
  }, SHUFFLE_MS);
}
function stopShuffle(key) {
  if (shuffleTimers[key]) { clearInterval(shuffleTimers[key]); shuffleTimers[key] = null; }
}
  document.querySelectorAll('[data-flip]').forEach(b => b.addEventListener('click', e => {
  e.stopPropagation();
  const card = b.closest('.flip');
  if (!card) return;
  const k = card.getAttribute('data-artist');
  card.classList.add('flipped');
  idx[k] = 0;
  showAlbum(k, false);
  startShuffle(k);
}));
document.querySelectorAll('[data-unflip]').forEach(b => b.addEventListener('click', e => {
  e.stopPropagation();
  const card = b.closest('.flip');
  if (card) {
    const k = card.getAttribute('data-artist');
    card.classList.remove('flipped');
    stopShuffle(k);
    const audio = document.querySelector(`audio[data-audio="${k}"]`);
    if (audio && !audio.paused) {
      audio.pause();
      const playBtn = document.querySelector(`[data-play="${k}"]`);
      if (playBtn) playBtn.textContent = 'Play';
    }
  }
}));

  // manual override still works, cycling through all three albums
document.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', e => {
  e.stopPropagation();
  const k = b.getAttribute('data-next');
  idx[k] = (idx[k] + 1) % currentSet(k).albums.length;
  showAlbum(k, true);
  startShuffle(k);
}));
document.querySelectorAll('[data-prev]').forEach(b => b.addEventListener('click', e => {
  e.stopPropagation();
  const k = b.getAttribute('data-prev');
  idx[k] = (idx[k] - 1 + currentSet(k).albums.length) % currentSet(k).albums.length;
  showAlbum(k, true);
  startShuffle(k);
}));
document.querySelectorAll('[data-play]').forEach(b => b.addEventListener('click', e => {
  e.stopPropagation();
  const k = b.getAttribute('data-play');
  const audio = document.querySelector(`audio[data-audio="${k}"]`);
  if (!audio) return;
  syncAudio(k, false);
  if (audio.paused) {
    stopAllAudio(k);
    document.getElementById('storeAudio')?.pause(); // silence the mini player too
    audio.play().catch(() => {});
    b.textContent = 'Pause';
  } else {
    audio.pause();
    b.textContent = 'Play';
  }
}));
  // init backs so first Flip is instant
  ['ts', 'pm', 'mcr'].forEach(k => { idx[k] = 0; showAlbum(k, false); });
