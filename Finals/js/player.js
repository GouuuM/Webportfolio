'use strict';
/* ---------- MINI PLAYER: Paramore-store-style timer, box fills, shuffled ---------- */
// Playlist lives in Finals/playlist/ — Paramore + My Chemical Romance only, shuffled.
const storePlaylist = [
  { src: 'playlist/Misery Business - Paramore.mp3', title: 'Paramore — Misery Business' },
  { src: 'playlist/Still into You - Paramore.mp3', title: 'Paramore — Still Into You' },
  { src: "playlist/Ain't It Fun - Paramore.mp3", title: 'Paramore — Ain\u2019t It Fun' },
  { src: 'playlist/All I Wanted - Paramore.mp3', title: 'Paramore — All I Wanted' },
  { src: 'playlist/Brick by Boring Brick - Paramore.mp3', title: 'Paramore — Brick by Boring Brick' },
  { src: 'playlist/Caught in the Middle - Paramore.mp3', title: 'Paramore — Caught in the Middle' },
  { src: 'playlist/crushcrushcrush - Paramore.mp3', title: 'Paramore — crushcrushcrush' },
  { src: 'playlist/Emergency - Paramore.mp3', title: 'Paramore — Emergency' },
  { src: 'playlist/Fake Happy - Edit - Paramore.mp3', title: 'Paramore — Fake Happy' },
  { src: 'playlist/Grow Up - Paramore.mp3', title: 'Paramore — Grow Up' },
  { src: 'playlist/Hard Times - Paramore.mp3', title: 'Paramore — Hard Times' },
  { src: 'playlist/Ignorance - Paramore.mp3', title: 'Paramore — Ignorance' },
  { src: 'playlist/Last Hope - Paramore.mp3', title: 'Paramore — Last Hope' },
  { src: 'playlist/Let the Flames Begin - Paramore.mp3', title: 'Paramore — Let the Flames Begin' },
  { src: 'playlist/Monster - Transformers Soundtrack Version - Paramore.mp3', title: 'Paramore — Monster' },
  { src: 'playlist/Now - Paramore.mp3', title: 'Paramore — Now' },
  { src: 'playlist/Pressure - Paramore.mp3', title: 'Paramore — Pressure' },
  { src: 'playlist/Rose-Colored Boy - Paramore.mp3', title: 'Paramore — Rose-Colored Boy' },
  { src: "playlist/Tell Me It's Okay - Demo - Paramore.mp3", title: 'Paramore — Tell Me It\u2019s Okay (Demo)' },
  { src: "playlist/That's What You Get - Paramore.mp3", title: 'Paramore — That\u2019s What You Get' },
  { src: 'playlist/The Only Exception - Paramore.mp3', title: 'Paramore — The Only Exception' },
  { src: 'playlist/Told You So - Paramore.mp3', title: 'Paramore — Told You So' },
  { src: 'playlist/Cancer - My Chemical Romance.mp3', title: 'MCR — Cancer' },
  { src: 'playlist/Dead! - My Chemical Romance.mp3', title: 'MCR — Dead!' },
  { src: 'playlist/Disenchanted - My Chemical Romance.mp3', title: 'MCR — Disenchanted' },
  { src: 'playlist/Famous Last Words - My Chemical Romance.mp3', title: 'MCR — Famous Last Words' },
  { src: 'playlist/Helena - My Chemical Romance.mp3', title: 'MCR — Helena' },
  { src: "playlist/I Don't Love You - My Chemical Romance.mp3", title: 'MCR — I Don\u2019t Love You' },
  { src: "playlist/I'm Not Okay (I Promise) - My Chemical Romance.mp3", title: 'MCR — I\u2019m Not Okay (I Promise)' },
  { src: 'playlist/Na Na Na (Na Na Na Na Na Na Na Na Na) - My Chemical Romance.mp3', title: 'MCR — Na Na Na' },
  { src: 'playlist/Teenagers - My Chemical Romance.mp3', title: 'MCR — Teenagers' },
  { src: 'playlist/The End. - My Chemical Romance.mp3', title: 'MCR — The End.' },
  { src: 'playlist/The Ghost of You - My Chemical Romance.mp3', title: 'MCR — The Ghost of You' },
  { src: 'playlist/The Sharpest Lives - My Chemical Romance.mp3', title: 'MCR — The Sharpest Lives' },
  { src: 'playlist/This Is How I Disappear - My Chemical Romance.mp3', title: 'MCR — This Is How I Disappear' },
  { src: 'playlist/Welcome to the Black Parade - My Chemical Romance.mp3', title: 'MCR — Welcome to the Black Parade' }
];
let storeIdx = Math.floor(Math.random() * storePlaylist.length); // start on a random track
const storeAudio = document.getElementById('storeAudio');
const storeTimeBtn = document.getElementById('storeTimeBtn');
const storeMuteBtn = document.getElementById('storeMuteBtn');
const storeFill = document.getElementById('storeProgressFill');

function fmtStoreTime(sec) {
  if (!isFinite(sec)) return '00:00';
  sec = Math.floor(sec);
  return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
}
function pickStoreNext() {
  if (storePlaylist.length < 2) return 0;
  let n = storeIdx;
  while (n === storeIdx) n = Math.floor(Math.random() * storePlaylist.length);
  return n;
}
function loadStoreTrack(i, autoplay) {
  if (!storeAudio) return;
  storeIdx = (i + storePlaylist.length) % storePlaylist.length;
  storeAudio.src = storePlaylist[storeIdx].src;
  storeAudio.load();
  if (autoplay) { stopAllAudio('store'); storeAudio.play().catch(() => {}); }
  syncStoreUI();
}
function syncStoreUI() {
  if (storeMuteBtn) storeMuteBtn.innerHTML = (storeAudio?.muted)
    ? '<i class="bi bi-volume-mute-fill"></i>'
    : '<i class="bi bi-volume-up-fill"></i>';
}
function toggleStorePlay() {
  if (!storeAudio) return;
  if (!storeAudio.getAttribute('src')) loadStoreTrack(storeIdx, false);
  if (storeAudio.paused) { stopAllAudio('store'); storeAudio.play().catch(() => {}); }
  else storeAudio.pause();
  syncStoreUI();
}
function updateStoreProgress() {
  if (!storeAudio) return;
  const cur = storeAudio.currentTime || 0;
  const dur = storeAudio.duration || 0;
  if (storeTimeBtn) storeTimeBtn.textContent = fmtStoreTime(cur);
  if (storeFill) storeFill.style.width = (dur > 0 ? (cur / dur) * 100 : 0) + '%';
}
if (storeAudio) {
  loadStoreTrack(storeIdx, false);
  storeAudio.addEventListener('timeupdate', updateStoreProgress);
  storeAudio.addEventListener('loadedmetadata', updateStoreProgress);
  storeAudio.addEventListener('play', syncStoreUI);
  storeAudio.addEventListener('pause', syncStoreUI);
  storeAudio.addEventListener('ended', () => loadStoreTrack(pickStoreNext(), true));
  storeAudio.addEventListener('error', () => {
    if (storeAudio.getAttribute('src')) loadStoreTrack(pickStoreNext(), true);
  }, true);
  storeTimeBtn?.addEventListener('click', toggleStorePlay);
  storeTimeBtn?.addEventListener('dblclick', e => { e.stopPropagation(); loadStoreTrack(pickStoreNext(), true); });
  storeMuteBtn?.addEventListener('click', () => {
    if (storeAudio.paused) { stopAllAudio('store'); storeAudio.play().catch(() => {}); }
    else { storeAudio.muted = !storeAudio.muted; }
    syncStoreUI();
  });

  /* Best-effort autoplay: browsers block unmuted audio until the first gesture */
  let storeAutoTried = false;
  function tryStoreAutoplay() {
    if (storeAutoTried || !storeAudio.paused) return;
    storeAutoTried = true;
    stopAllAudio('store');
    storeAudio.play().catch(() => {
      storeAutoTried = false;
      const kick = () => {
        if (storeAudio.paused) { stopAllAudio('store'); storeAudio.play().catch(() => {}); }
      };
      document.addEventListener('pointerdown', kick, { once: true });
      document.addEventListener('keydown', kick, { once: true });
    });
  }
  tryStoreAutoplay();
  setTimeout(() => { storeAutoTried = false; tryStoreAutoplay(); }, 900);
}
