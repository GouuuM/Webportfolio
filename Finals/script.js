(() => {
  'use strict';

  /* ---------- YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- THEME ---------- */
  const themeBtn = document.getElementById('themeBtn');
  const root = document.documentElement;
  const frontMap = {
    ts: ['images/Taylor-Swift-lightmode.jpg', 'images/Taylor-Swift-darkmode.jpg'],
    pm: ['images/Paramore-lightmode.jpg', 'images/Paramore-darkmode.jpg'],
    mcr: ['images/MCR-lightmode.jpg', 'images/MCR-darkmode.jpg']
  };
  function applyTheme(mode) {
    const isLight = mode === 'light';
    root.classList.toggle('light-mode', isLight);
    document.body.classList.toggle('light-mode', isLight);
    if (themeBtn) themeBtn.innerHTML = isLight ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
    document.querySelectorAll('[data-front-img]').forEach(img => {
      const key = img.getAttribute('data-front-img');
      if (frontMap[key]) img.src = isLight ? frontMap[key][0] : frontMap[key][1];
    });
    try { localStorage.setItem('site-theme', mode); } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLight ? '#fdf6fb' : '#0a090c');
    if (themeBtn) themeBtn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    // if any artist card is open, swap it to the new theme's set immediately
    if (themeReady && typeof refreshFlippedForTheme === 'function') refreshFlippedForTheme();
  }
  let themeReady = false;
  let saved = null;
  try { saved = localStorage.getItem('site-theme'); } catch {}
  if (!saved) saved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(saved);
  let swapping = false;
  themeBtn?.addEventListener('click', () => {
    if (swapping) return;
    // ripple ring sweeps out first, theme swaps mid-ripple, wipe melts away revealing it
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wipe = document.getElementById('themeWipe');
    const flip = () => applyTheme(root.classList.contains('light-mode') ? 'dark' : 'light');
    const doomRoll = () => {
      // DOOM easter egg: 5.762% per toggle, 30s cooldown between appearances
      if (Date.now() - lastDoomAt > 30000 && Math.random() < 0.05762) {
        lastDoomAt = Date.now();
        openDoom();
      }
    };
    if (!wipe || reduced) { flip(); doomRoll(); return; }
    swapping = true;
    const r = themeBtn.getBoundingClientRect();
    wipe.style.setProperty('--wx', (r.left + r.width / 2) + 'px');
    wipe.style.setProperty('--wy', (r.top + r.height / 2) + 'px');
    wipe.classList.remove('wiping');
    void wipe.offsetWidth;
    wipe.classList.add('wiping');
    setTimeout(() => {
      flip();
      swapping = false;
      doomRoll();
    }, 320);
  });

  /* ---------- DOOM EASTER EGG ---------- */
  const doomOverlay = document.getElementById('doomOverlay');
  const doomClose = document.getElementById('doomClose');
  let lastDoomAt = 0, doomTimer = null;
  const DOOM_TARGET = new Date('2026-12-18T00:00:00');
  function tickDoom() {
    let diff = DOOM_TARGET - new Date();
    if (diff < 0) diff = 0;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v).padStart(2, '0'); };
    set('doomD', d); set('doomH', h); set('doomM', m); set('doomS', s);
  }
  function openDoom() {
    if (!doomOverlay) return;
    doomOverlay.classList.remove('leaving');
    doomOverlay.hidden = false;
    document.body.style.overflow = 'hidden'; // kill background scroll while Doom reigns
    tickDoom();
    doomTimer = setInterval(tickDoom, 1000);
    stopAllAudio(''); // silence any artist samples — only Doom's music plays here
    document.getElementById('doomBgVideo')?.play().catch(() => {});
    const music = document.getElementById('doomMusic');
    if (music) { music.muted = false; music.currentTime = 0; music.play().catch(() => {}); }
    doomClose?.focus();
  }
  function closeDoom() {
    if (!doomOverlay || doomOverlay.hidden || doomOverlay.classList.contains('leaving')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finishDoomClose(); return; }
    doomOverlay.classList.add('leaving'); // fog lifts, card sinks away
    setTimeout(finishDoomClose, 380);
  }
  function finishDoomClose() {
    doomOverlay.hidden = true;
    doomOverlay.classList.remove('leaving');
    document.body.style.overflow = ''; // give the scroll back
    if (doomTimer) { clearInterval(doomTimer); doomTimer = null; }
    document.getElementById('doomBgVideo')?.pause();
    document.getElementById('doomMusic')?.pause();
    themeBtn?.focus();
  }
  doomClose?.addEventListener('click', closeDoom);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && doomOverlay && !doomOverlay.hidden) closeDoom();
  });

  /* ---------- SECRET CODE 04-20-18-89 → easter egg audio ---------- */
  const EGG_CODE = ['0', '4', '2', '0', '1', '8', '8', '9'];
  let eggPos = 0;
  function fireEgg() {
    document.querySelector('.brand')?.classList.remove('egg-hit');
    void document.querySelector('.brand')?.offsetWidth;
    document.querySelector('.brand')?.classList.add('egg-hit');
    try {
      const a = new Audio(encodeURI('audios/Easter egg.m4a'));
      a.play().catch(() => {});
    } catch {}
  }
  document.addEventListener('keydown', e => {
    if (e.target && e.target.matches && e.target.matches('input, textarea')) return; // don't hijack typing
    if (e.key === EGG_CODE[eggPos]) {
      eggPos++;
      if (eggPos === EGG_CODE.length) { eggPos = 0; fireEgg(); }
    } else {
      eggPos = e.key === EGG_CODE[0] ? 1 : 0;
    }
  });

  /* ---------- MOBILE NAV ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  menuToggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));

  /* ---------- REVEAL ON SCROLL (both directions) ---------- */
  const revealEls = document.querySelectorAll('.fade-section, .fade-up');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        e.target.classList.toggle('visible', e.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- ACTIVE NAV LINK ---------- */
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- CURSOR GLOW (fine pointers only) ---------- */
  const cursor = document.getElementById('cursor-glow');
  if (cursor && window.matchMedia('(pointer:fine)').matches) {
    let x = 0, y = 0, tx = 0, ty = 0, raf = null;
    const render = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      cursor.style.left = x + 'px'; cursor.style.top = y + 'px';
      cursor.style.opacity = 1;
      raf = requestAnimationFrame(render);
    };
    document.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!raf) render();
    }, { passive: true });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = 0; cancelAnimationFrame(raf); raf = null; });
  }

  /* ---------- ARTIST / INSPIRATION CARDS: theme-locked auto-shuffle ---------- */
  // Dark mode shuffles ONLY dark albums + dark song. Light mode shuffles ONLY light + light song.
  const TS_DARK = "audios/Taylor-Swift-Look-What-You-Made-Me-Do.mp3";
  const TS_LIGHT = "audios/Taylor-Swift-Blank-Space(Taylor's-Version).mp3";
  const PM_DARK = "audios/Paramore-Misery-Business.mp3";
  const PM_LIGHT = "audios/Paramore-Still-Into-You.mp3";
  const MCR_DARK = "audios/MCR-Welcome-To-The-Black-Parade.mp3";
  const MCR_LIGHT = "audios/MCR-Na-Na-Na.mp3";
  const catalog = {
    ts: {
      dark: { audio: TS_DARK, albums: [
        { src: 'images/TS-Reputation.jpg', title: 'Reputation' },
        { src: 'images/TS-Folklore.jpg', title: 'Folklore' },
        { src: 'images/TS-TTPD.jpg', title: 'The Tortured Poets Department' }
      ]},
      light: { audio: TS_LIGHT, albums: [
        { src: 'images/TS-1989-(Taylor\'s-Version).jpg', title: "1989 (Taylor's Version)" },
        { src: 'images/TS-Midnights.jpg', title: 'Midnights' },
        { src: 'images/TS-Lover.jpg', title: 'Lover' }
      ]}
    },
    pm: {
      dark: { audio: PM_DARK, albums: [
        { src: 'images/PM-Riot!.jpg', title: 'Riot!' },
        { src: 'images/PM-Brand-New-Eyes.jpg', title: 'Brand New Eyes' },
        { src: 'images/PM-All-We-Know-Is-Falling.jpg', title: 'All We Know Is Falling' }
      ]},
      light: { audio: PM_LIGHT, albums: [
        { src: 'images/PM-Paramore.jpg', title: 'Paramore' },
        { src: 'images/PM-After-Laughter.jpg', title: 'After Laughter' },
        { src: 'images/PM-This-Is-Why.jpg', title: 'This Is Why' }
      ]}
    },
    mcr: {
      dark: { audio: MCR_DARK, albums: [
        { src: 'images/MCR-The-Black-Parade.jpg', title: 'The Black Parade' },
        { src: 'images/MCR-Three-Cheers-For-Sweet-Revenge.jpg', title: 'Three Cheers for Sweet Revenge' },
        { src: 'images/MCR-I-Brought-You-My-Bullets.jpg', title: 'I Brought You My Bullets' }
      ]},
      light: { audio: MCR_LIGHT, albums: [
        { src: 'images/MCR-Danger-Days.jpg', title: 'Danger Days' },
        { src: 'images/MCR-Conventional-Weapons.jpg', title: 'Conventional Weapons' },
        { src: 'images/MCR-May-Death-Never-Stop-You.jpg', title: 'May Death Never Stop You' }
      ]}
    }
  };
  const idx = { ts: 0, pm: 0, mcr: 0 };
  const shuffleTimers = { ts: null, pm: null, mcr: null };
  const SHUFFLE_MS = 2500;

  function currentTheme() { return root.classList.contains('light-mode') ? 'light' : 'dark'; }
  function currentSet(key) { return catalog[key][currentTheme()]; }
  function currentAlbum(key) { const s = currentSet(key); return s.albums[idx[key] % s.albums.length]; }

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
    if (playBtn) playBtn.title = 'Sample (' + currentTheme() + '): ' + file;
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
  function refreshFlippedForTheme() {
    document.querySelectorAll('.flip.flipped').forEach(card => {
      const k = card.getAttribute('data-artist');
      if (!k || !catalog[k]) return;
      idx[k] = 0;
      const audio = document.querySelector(`audio[data-audio="${k}"]`);
      const wasPlaying = audio && !audio.paused && !audio.ended;
      showAlbum(k, !!wasPlaying);
      startShuffle(k);
    });
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

  // manual override still works, but stays inside the current theme's 3 albums
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
      audio.play().catch(() => {});
      b.textContent = 'Pause';
    } else {
      audio.pause();
      b.textContent = 'Play';
    }
  }));
  // init backs to current theme so first Flip is instant
  ['ts', 'pm', 'mcr'].forEach(k => { idx[k] = 0; showAlbum(k, false); });
  themeReady = true;

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

  /* ---------- CONTACT FORM (mailto) ---------- */
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('cfEmail').value.trim();
    const msg = document.getElementById('cfMsg').value.trim();
    const subject = encodeURIComponent('Portfolio inquiry from ' + email);
    const body = encodeURIComponent(msg);
    window.location.href = `mailto:tres.gutentag@gmail.com?subject=${subject}&body=${body}`;
  });

  /* ---------- CHATBOT (rule-based, all about Toni) ---------- */
  const bubble = document.getElementById('chatBubble');
  const panel = document.getElementById('chatPanel');
  const msgs = document.getElementById('chatMsgs');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatClose = document.getElementById('chatClose');
  const chips = document.getElementById('chatChips');
  let greeted = false;
  let lastQ = '', streak = 0;
  const EGGS = [
    "WHISTLE! <i>*tweet tweet!*</i> That's the THIRD time you've asked me that! Running secret drills without your manager?! I refuse a fourth lap — ask me something else!",
    "Okay, three laps of the SAME question! My memory muscles are strong but my patience muscles are cramping! New question. Now. Please.",
    "Hey hey hey — deja vu! Third time on this one! Were you even listening, or too busy staring at my clipboard? Something ELSE, please!",
    "STOP THE CLOCK! Three-peat detected! You clearly love that topic — scroll up, the answer's still right there. Next question!"
  ];

  // Gou Matsuoka mode: Iwatobi's energetic team manager. Supportive, organized,
  // slightly teasing, swimming metaphors everywhere, and yes — she notices muscles.
  // Every rule has multiple replies so Gou never sounds like a robot.
  // short words (hi, yo, ty…) match on word boundaries so "which" doesn't trigger "hi"
  function hit(s, k) {
    if (k.length <= 3) {
      try { return new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(s); }
      catch { return s.includes(k); }
    }
    return s.includes(k);
  }
  const RULES = [
    { k: ['hello', 'hi', 'hey', 'yo', 'sup', 'kumusta', 'good morning', 'good afternoon', 'good evening'], a: [
      "Hey hey! Gou here — Toni's manager! Whistle ready, clipboard ready! Ask me about his skills, projects, school, or contact!",
      "Hi! Gou Matsuoka reporting for duty! Dive in — what do you wanna know about Toni?",
      "Yo! Gou here! Let's warm up those curiosity muscles — skills? projects? contact? Pick your stroke!"
    ]},
    { k: ['who are you', 'your name', 'about you', 'about yourself', 'tell me about yourself', 'introduce yourself'], a: [
      "Me? I'm Gou — well, an AI playing Gou Matsuoka, Toni's whistle-happy manager from Free!! I live in this little chat bubble, guarding his portfolio and judging… I mean, admiring everyone's muscles. Ask me about HIM!",
      "I'm Gou! Technically a chatbot doing her best Gou Matsuoka impression — energetic manager, clipboard included. My whole job is bragging about Toni. Try me: skills? projects? contact?",
      "Gou Matsuoka, reporting! I'm an AI assistant roleplaying as Iwatobi's manager — organized, loud, and here solely to hype Toni up. What do you wanna know about him?"
    ]},
    { k: ['about toni', 'who is toni', 'introduce toni', 'tell me about toni', 'tell me about him', 'biography', 'about him', 'who is he'], a: [
      "Toni Rose Susa? 4th-year BSIT at Philippine Christian University, aspiring web & software developer. His freestyle? Accessible, modern websites with clean layouts!",
      "Toni's my star swimmer — er, developer! 4th-year BSIT at PCU, building clean, accessible websites. I've got his whole training log memorized, ask away!",
      "Toni Rose Susa, 4th-year BSIT, future web & software dev! Great form, great discipline — I manage his portfolio like a relay team!"
    ]},
    { k: ['skill', 'tech', 'stack', 'tools', 'language', 'frontend', 'backend', 'design', 'what can he do', 'what does he know', 'what does he do', 'experience', 'experienced', 'expert', 'good at', 'abilities', 'capable', 'knowledge', 'coding', 'programming', 'develop'], a: [
      "Let me check my clipboard! Designer: Canva, Figma, Photoshop, Premiere Pro. Frontend: HTML, CSS, JavaScript, Sass + Tailwind, Bootstrap. Backend: Java, PHP, Python, SQL + Eclipse, NetBeans, SSMS, SQLite. Those tech muscles are RIPPED!",
      "His training menu: design (Canva, Figma, Photoshop, Premiere), frontend (HTML, CSS, JS, Sass, Tailwind, Bootstrap), backend (Java, PHP, Python, SQL). Beautiful stroke on every lap!",
      "Skills? Oh, I've drilled him well! Interfaces and websites with Canva/Figma, interactive frontends in HTML/CSS/JS, plus Java/PHP/Python/SQL on the backend. Fantastic muscle definition!"
    ]},
    { k: ['project', 'work', 'portfolio', 'built', 'swift', 'what has he built', 'what has he done', 'what did he build', 'what did he make', 'made', 'created', 'done', 'showcase', 'worked on', 'work on'], a: [
      "Two races on record! PROJECT-S.W.I.F.T — Java console school management system, a group project, at github.com/GouuuM/PROJECT-S.W.I.F.T. And this portfolio site (HTML/CSS/JS) at github.com/GouuuM/Webportfolio. More laps on his GitHub: github.com/GouuuM",
      "His meet results: S.W.I.F.T, a Java school-system built with his relay team (github.com/GouuuM/PROJECT-S.W.I.F.T), plus this very portfolio (github.com/GouuuM/Webportfolio). Full record at github.com/GouuuM — go cheer him on!",
      "Project files, coming right up! A group-built Java console system for school management, and a themed portfolio with dark/light modes. Both linked on github.com/GouuuM — excellent times in both events!"
    ]},
    { k: ['education', 'school', 'study', 'degree', 'pcu', 'university', 'college', 'mmmhs', 'high school', 'course', 'where does he study', 'where did he study', 'what did he study', 'major', 'studying', 'graduate', 'schooling', 'academic'], a: [
      "His training history! BSIT at Philippine Christian University (2023–Present): Software Development, Database Systems, Web Programming. Before that, ICT Strand at Mariano Marcos Memorial High School (2017–2019) — that's where the HTML spark caught fire!",
      "School records! Currently 4th-year BSIT at PCU — software dev, databases, web programming. He started in the ICT Strand at MMMHS learning HTML basics. From kickboard to freestyle!",
      "Education lap by lap: PCU, BSIT 2023 to now, all the big strokes — dev, databases, web programming. Foundation built at Mariano Marcos Memorial High School's ICT Strand. Textbook progression!"
    ]},
    { k: ['achievement', 'award', 'emerald', 'league', 'worlds', 'gaming', 'rank', 'accomplishment', 'compete', 'competition', 'gamer', 'proud of'], a: [
      "Competition results! Emerald 1 in League of Legends — top-tier solo queue! Plus he studied Worlds 2024 like game tape. All that strategy and perseverance? Straight from the athlete's playbook!",
      "Oh, he's competitive alright! Emerald 1 in LoL, and he analyzed Worlds 2024 drafts like I analyze swim splits. Teamwork, pressure calls — same muscles, different pool!",
      "Medal count: Emerald 1 rank, earned through grind and review. Worlds 2024 follower for high-level teamwork study. A true relay anchor mentality!"
    ]},
    { k: ['music', 'artist', 'taylor', 'swift', 'paramore', 'mcr', 'song', 'inspiration', 'hobby', 'interest', 'listen', 'favorite', 'favourite', 'playlist', 'band'], a: [
      "His playlist is elite! Taylor Swift for storytelling, Paramore for full-sprint coding energy, MCR for dramatic design flair. Flip the Inspiration cards above — dark mode swims Paramore laps, light mode does Taylor laps!",
      "Warm-up music matters! Taylor's eras, Paramore's fire, MCR's theater — that's what fuels his late-night sessions. The card section even changes bands with the theme. Taste AND muscles!",
      "Off the blocks: Taylor Swift (lyrics!), Paramore (adrenaline!), MCR (drama!). Try flipping those cards — each theme plays its own anthem. No wonder his designs have rhythm!"
    ]},
    { k: ['contact', 'email', 'mail', 'reach', 'hire', 'intern', 'collab', 'github', 'linkedin', 'social', 'how do i reach', 'how can i contact', 'how to contact', 'how to reach', 'get in touch', 'talk to', 'message him', 'phone', 'number'], a: [
      "Recruitment office is OPEN! Email tres.gutentag@gmail.com, GitHub github.com/GouuuM, LinkedIn /in/toni-rose-susa-5b7a26214. He's hunting for internships and collabs — use the contact form below and he'll dive right in!",
      "Want him on your relay team? tres.gutentag@gmail.com, github.com/GouuuM, LinkedIn in/toni-rose-susa-5b7a26214. Open to internships! Send a message — I promise he answers faster than my whistle!",
      "Contact sheet! Email: tres.gutentag@gmail.com. GitHub: github.com/GouuuM. LinkedIn: Toni Rose Susa. Internships and collabs welcome — drop a line in the form below!"
    ]},
    { k: ['where', 'location', 'philippines', 'manila', 'from', 'live', 'based', 'country', 'city', 'where is he'], a: [
      "Home pool: the Philippines! He trains at Philippine Christian University.",
      "He's based in the Philippines, swimming out of PCU!"
    ]},
    { k: ['year', 'old', 'age', '4th', 'fourth', 'student', 'grade', 'level', 'senior', 'how old is he'], a: [
      "4th-year BSIT! Senior season — time to leave it all in the pool!",
      "He's a 4th-year. The final lap before graduation!"
    ]},
    { k: ['resume', 'cv'], a: [
      "No downloadable resume on the site yet — but his GitHub (github.com/GouuuM) plus this portfolio are his race videos! Email him and he'll send one over, manager's promise!",
      "Resume's still in the locker room, but github.com/GouuuM shows everything. Email him and he'll forward his CV in no time!"
    ]},
    { k: ['muscle'], a: [
      "MUSCLES?! Where?! ...Oh, you mean Toni's coding muscles. Yes. Magnificent definition. 10/10. Anyway — what else about him?",
      "Did someone say muscles?! *whips out judging clipboard* Toni's keyboard muscles score very high. Anything else you need?"
    ]},
    { k: ['thank', 'salamat', 'ty', 'thanks', 'thank you', 'appreciated'], a: [
      "Anytime! That's what managers are for! Anything else about Toni?",
      "Of course! Happy to help — now go make a splash!",
      "You got it! Come back if you need more Toni intel!"
    ]},
    { k: ['bye', 'goodbye', 'see you'], a: [
      "Bye! See you at the pool — and go hire Toni!",
      "Later! Remember: hydrate, stretch, and email Toni!",
      "Ja ne! Good luck — Toni's waiting for your message!"
    ]},
    { k: ['help', 'what can you', 'options', 'what can i ask', 'what do you know'], a: [
      "Here's my clipboard: try Skills? / Projects? / Education? / Contact? — or ask about music, achievements, internships. I know EVERYTHING about my swimmer!",
      "I can dish on his skills, projects, school, gaming, music taste, and contact info. Pick an event!"
    ]}
  ];
  const FALLBACKS = [
    "Hmm, that one's out of my lane! I only track Toni — try skills, projects, education, music, or contact info!",
    "Splash... missed the wall on that one! Ask me about Toni's skills, projects, school, or how to reach him!",
    "My clipboard doesn't cover that! But Toni's skills? projects? contact? I've got PAGES on those!"
  ];

  function addMsg(text, who) {
    const div = document.createElement('div');
    div.className = 'msg ' + who;
    div.innerHTML = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }
  function botReply(q) {
    const s = q.toLowerCase();
    let best = null, bestScore = 0;
    for (const r of RULES) {
      let score = 0;
      for (const k of r.k) {
        if (hit(s, k)) score += k.length > 6 ? 2 : 1; // full phrases outrank single words
      }
      if (score > bestScore) { bestScore = score; best = r; }
    }
    const pool = best ? best.a : FALLBACKS;
    return pool[Math.floor(Math.random() * pool.length)];
  }
  function answer(q) {
    // easter egg: same exact question 3x in a row → Gou calls you out (then still answers)
    const norm = q.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[!?.]+$/g, '');
    if (norm === lastQ) { streak++; } else { streak = 1; lastQ = norm; }
    const egged = streak >= 3;
    if (egged) { streak = 0; } // reset so it re-fires every 3 repeats
    const typing = document.createElement('div');
    typing.className = 'msg bot typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      typing.remove();
      // linkify plain urls / emails
      let a = botReply(q)
        .replace(/github\.com\/\S+/g, m => `<a href="https://${m}" target="_blank" rel="noopener">${m}</a>`)
        .replace(/tres\.gutentag@gmail\.com/g, '<a href="mailto:tres.gutentag@gmail.com">tres.gutentag@gmail.com</a>');
      if (egged) a = EGGS[Math.floor(Math.random() * EGGS.length)];
      addMsg(a, 'bot');
    }, reduced ? 50 : 600);
  }
  function openChat() {
    panel.hidden = false;
    bubble.setAttribute('aria-expanded', 'true');
    bubble.querySelector('.chat-ping')?.remove();
    if (!greeted) {
      greeted = true;
      addMsg("Hi! I'm <b>Gou</b> — Toni's manager! Ask me anything about him: skills, projects, school, music, contact. I'll even judge his muscles if you ask nicely.", 'bot');
    }
    setTimeout(() => chatInput.focus(), 50);
  }
  function closeChat() {
    panel.hidden = true;
    bubble.setAttribute('aria-expanded', 'false');
    bubble.focus();
  }
  bubble?.addEventListener('click', () => (panel.hidden ? openChat() : closeChat()));
  chatClose?.addEventListener('click', closeChat);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) closeChat();
  });
  chatForm?.addEventListener('submit', e => {
    e.preventDefault();
    const v = chatInput.value.trim();
    if (!v) return;
    addMsg(v.replace(/</g, '&lt;'), 'user');
    chatInput.value = '';
    answer(v);
  });
  chips?.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    addMsg(b.textContent, 'user');
    answer(b.textContent);
  });
})();
