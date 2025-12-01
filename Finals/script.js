(() => {
  /* ===== ELEMENTS ===== */
  const sections = document.querySelectorAll('.fade-section');
  const cursor = document.getElementById('cursor-glow');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeBtn = document.getElementById('themeBtn');
  const navbar = document.querySelector('nav.navbar');

  const tsFrontImg = document.getElementById('ts-front-img');
  const paramoreFrontImg = document.getElementById('paramore-front-img');
  const mcrFrontImg = document.getElementById('mcr-front-img');

  /* ===== REVEAL ON SCROLL ===== */
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12 });
    sections.forEach(s => revealObserver.observe(s));
  } else {
    sections.forEach(s => s.classList.add('visible'));
  }

  /* ===== SMOOTH NAVIGATION ===== */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close mobile menu if open
      document.querySelector('.nav-menu')?.classList.remove('open');
    });
  });
})();

(() => {
  const cursor = document.getElementById('cursor-glow');

  /* ===== CURSOR GLOW FOLLOW ===== */
  if (cursor) {
    // Default smaller size when idle
    let scale = 0.8;

    // Detect mobile/tablet and shrink further
    const isMobileOrTablet = window.matchMedia("(max-width: 1024px)").matches;
    if (isMobileOrTablet) {
      scale = 0.5;
    }

    // Follow mouse
    document.addEventListener('mousemove', e => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) scale(${scale})`;
      cursor.style.opacity = 1;
    });

    // Hide when leaving viewport
    document.addEventListener('mouseout', e => {
      if (!e.relatedTarget) cursor.style.opacity = 0;
    });

    // Enlarge slightly on interactive elements
    document.querySelectorAll('a, button, .nav-link').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = `translate3d(${cursor.offsetLeft}px, ${cursor.offsetTop}px, 0) scale(${scale + 0.5})`;
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = `translate3d(${cursor.offsetLeft}px, ${cursor.offsetTop}px, 0) scale(${scale})`;
      });
    });
  }

  /* ===== PARALLAX ACCENT ===== */
  let lastScroll = 0, ticking = false;
  const updateParallax = () => {
    document.body.style.backgroundPosition = `center ${lastScroll * 0.05}px`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    lastScroll = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
})();

(() => {
  const themeBtn = document.getElementById('themeBtn');
  const navbar = document.querySelector('nav.navbar');

  const tsFrontImg = document.getElementById('ts-front-img');
  const paramoreFrontImg = document.getElementById('paramore-front-img');
  const mcrFrontImg = document.getElementById('mcr-front-img');

  /* ===== APPLY THEME ===== */
  const applyTheme = (mode) => {
    const isLight = mode === 'light';
    document.documentElement.classList.toggle('light-mode', isLight);
    document.body.classList.toggle('light-mode', isLight);


    // Navbar styling
    if (navbar) {
      navbar.classList.toggle('bg-dark', !isLight);
      navbar.classList.toggle('bg-gray-100', isLight);
    }

    // Theme button icon
    if (themeBtn) {
      themeBtn.innerHTML = isLight
        ? '<i class="bi bi-sun"></i>'
        : '<i class="bi bi-moon-stars"></i>';
    }

    // Artist front images swap
    if (tsFrontImg) tsFrontImg.src = isLight ? "images/Taylor-Swift-lightmode.jpg" : "images/Taylor-Swift-darkmode.jpg";
    if (paramoreFrontImg) paramoreFrontImg.src = isLight ? "images/Paramore-lightmode.jpg" : "images/Paramore-darkmode.jpg";
    if (mcrFrontImg) mcrFrontImg.src = isLight ? "images/MCR-lightmode.jpg" : "images/MCR-darkmode.jpg";

    // Save preference
    localStorage.setItem('site-theme', mode);
  };

  // Load saved theme
  const savedTheme = localStorage.getItem('site-theme') || 'dark';
  applyTheme(savedTheme);

  // Toggle theme on button click
  themeBtn?.addEventListener('click', () => {
    const isCurrentlyLight = document.documentElement.classList.contains('light-mode');
    applyTheme(isCurrentlyLight ? 'dark' : 'light');
  });
})();

(() => {
  const tsCard = document.getElementById('ts-card');
  const tsAlbums = document.getElementById('ts-albums');
  const tsAlbumTitle = document.getElementById('ts-album-title');
  const tsAudio = document.getElementById('ts-audio');
  const tsPlayBtn = document.getElementById('ts-play-btn');
  const tsWrapper = tsCard?.querySelector('.album-wrapper');

  /* ===== MANUAL PLAY/PAUSE TOGGLE ===== */
  if (tsPlayBtn && tsAudio) {
    tsPlayBtn.addEventListener('click', () => {
      if (tsAudio.paused) {
        tsAudio.play();
        tsPlayBtn.textContent = "⏸ Pause";
      } else {
        tsAudio.pause();
        tsPlayBtn.textContent = "▶ Play";
      }
    });
  }

  /* ===== ALBUM SLIDESHOW ===== */
  if (tsAlbums && tsCard && tsAlbumTitle && tsAudio && tsWrapper) {
    const albumDataDark = [
      { src: "images/TS-Reputation.jpg", title: "Reputation" },
      { src: "images/TS-Folklore.jpg", title: "Folklore" },
      { src: "images/TS-TTPD.jpg", title: "The Tortured Poets Department" }
    ];

    const albumDataLight = [
      { src: "images/TS-1989-(Taylor's-Version).jpg", title: "1989 (Taylor's Version)" },
      { src: "images/TS-Midnights.jpg", title: "Midnights" },
      { src: "images/TS-Lover.jpg", title: "Lover" }
    ];

    const getAlbumSet = () =>
      document.documentElement.classList.contains('light-mode') ? albumDataLight : albumDataDark;

    const getAudioSrc = () =>
      document.documentElement.classList.contains('light-mode')
        ? "audios/Taylor-Swift-Blank-Space(Taylor's-Version).mp3"
        : "audios/Taylor-Swift-Look-What-You-Made-Me-Do.mp3";

    let index = 0;
    let interval;

    tsCard.addEventListener('mouseenter', () => {
      const albumSet = getAlbumSet();
      index = 0;
      tsAlbums.src = albumSet[index].src;
      tsAlbumTitle.textContent = albumSet[index].title;

      // Auto-play only if audio is fresh
      if (tsAudio.currentTime === 0 || tsAudio.ended) {
        tsAudio.src = getAudioSrc();
        tsAudio.play();
        tsPlayBtn.textContent = "⏸ Pause";
      }

      interval = setInterval(() => {
        tsWrapper.classList.remove('visible');
        void tsWrapper.offsetWidth; // force reflow

        setTimeout(() => {
          index = (index + 1) % albumSet.length;
          tsAlbums.src = albumSet[index].src;
          tsAlbumTitle.textContent = albumSet[index].title;
          tsWrapper.classList.add('visible');
        }, 300);
      }, 2000);
    });

    tsCard.addEventListener('mouseleave', () => {
      clearInterval(interval);
      index = 0;
      const albumSet = getAlbumSet();
      tsAlbums.src = albumSet[index].src;
      tsAlbumTitle.textContent = albumSet[index].title;
      tsWrapper.classList.add('visible');

      // Reset audio only if it was playing
      if (!tsAudio.paused) {
        tsAudio.pause();
        tsAudio.currentTime = 0;
        tsPlayBtn.textContent = "▶ Play";
      }
    });
  }
})();

(() => {
  const pmCard = document.getElementById('paramore-card');
  const pmAlbums = document.getElementById('paramore-albums');
  const pmAlbumTitle = document.getElementById('paramore-album-title');
  const pmAudio = document.getElementById('paramore-audio');
  const pmPlayBtn = document.getElementById('paramore-play-btn');
  const pmWrapper = pmCard?.querySelector('.album-wrapper');

  /* ===== MANUAL PLAY/PAUSE TOGGLE ===== */
  if (pmPlayBtn && pmAudio) {
    pmPlayBtn.addEventListener('click', () => {
      if (pmAudio.paused) {
        pmAudio.play();
        pmPlayBtn.textContent = "⏸ Pause";
      } else {
        pmAudio.pause();
        pmPlayBtn.textContent = "▶ Play";
      }
    });
  }

  /* ===== ALBUM SLIDESHOW ===== */
  if (pmAlbums && pmCard && pmAlbumTitle && pmAudio && pmWrapper) {
    const albumDataDark = [
      { src: "images/PM-Riot!.jpg", title: "Riot!" },
      { src: "images/PM-Brand-New-Eyes.jpg", title: "Brand New Eyes" },
      { src: "images/PM-All-We-Know-Is-Falling.jpg", title: "All We Know Is Falling" }
    ];

    const albumDataLight = [
      { src: "images/PM-Paramore.jpg", title: "Paramore" },
      { src: "images/PM-After-Laughter.jpg", title: "After Laughter" },
      { src: "images/PM-This-Is-Why.jpg", title: "This Is Why" }
    ];

    const getAlbumSet = () =>
      document.documentElement.classList.contains('light-mode') ? albumDataLight : albumDataDark;

    const getAudioSrc = () =>
      document.documentElement.classList.contains('light-mode')
        ? "audios/Paramore-Still-Into-You.mp3"
        : "audios/Paramore-Misery-Business.mp3";

    let index = 0;
    let interval;

    pmCard.addEventListener('mouseenter', () => {
      const albumSet = getAlbumSet();
      index = 0;
      pmAlbums.src = albumSet[index].src;
      pmAlbumTitle.textContent = albumSet[index].title;

      // Auto-play only if audio is fresh
      if (pmAudio.currentTime === 0 || pmAudio.ended) {
        pmAudio.src = getAudioSrc();
        pmAudio.play();
        pmPlayBtn.textContent = "⏸ Pause";
      }

      interval = setInterval(() => {
        pmWrapper.classList.remove('visible');
        void pmWrapper.offsetWidth; // force reflow

        setTimeout(() => {
          index = (index + 1) % albumSet.length;
          pmAlbums.src = albumSet[index].src;
          pmAlbumTitle.textContent = albumSet[index].title;
          pmWrapper.classList.add('visible');
        }, 300);
      }, 2000);
    });

    pmCard.addEventListener('mouseleave', () => {
      clearInterval(interval);
      index = 0;
      const albumSet = getAlbumSet();
      pmAlbums.src = albumSet[index].src;
      pmAlbumTitle.textContent = albumSet[index].title;
      pmWrapper.classList.add('visible');

      // Reset audio only if it was playing
      if (!pmAudio.paused) {
        pmAudio.pause();
        pmAudio.currentTime = 0;
        pmPlayBtn.textContent = "▶ Play";
      }
    });
  }
})();

(() => {
  const mcrCard = document.getElementById('mcr-card');
  const mcrAlbums = document.getElementById('mcr-albums');
  const mcrAlbumTitle = document.getElementById('mcr-album-title');
  const mcrAudio = document.getElementById('mcr-audio');
  const mcrPlayBtn = document.getElementById('mcr-play-btn');
  const mcrWrapper = mcrCard?.querySelector('.album-wrapper');

  /* ===== MANUAL PLAY/PAUSE TOGGLE ===== */
  if (mcrPlayBtn && mcrAudio) {
    mcrPlayBtn.addEventListener('click', () => {
      if (mcrAudio.paused) {
        mcrAudio.play();
        mcrPlayBtn.textContent = "⏸ Pause";
      } else {
        mcrAudio.pause();
        mcrPlayBtn.textContent = "▶ Play";
      }
    });
  }

  /* ===== ALBUM SLIDESHOW ===== */
  if (mcrAlbums && mcrCard && mcrAlbumTitle && mcrAudio && mcrWrapper) {
    const albumDataDark = [
      { src: "images/MCR-The-Black-Parade.jpg", title: "The Black Parade" },
      { src: "images/MCR-Three-Cheers-For-Sweet-Revenge.jpg", title: "Three Cheers for Sweet Revenge" },
      { src: "images/MCR-I-Brought-You-My-Bullets.jpg", title: "I Brought You My Bullets" }
      
    ];

    const albumDataLight = [
      { src: "images/MCR-Danger-Days.jpg", title: "Danger Days" },
      { src: "images/MCR-Conventional-Weapons.jpg", title: "Conventional Weapons" },
      { src: "images/MCR-May-Death-Never-Stop-You.jpg", title: "May Death Never Stop You" }
    ];

    const getAlbumSet = () =>
      document.documentElement.classList.contains('light-mode') ? albumDataLight : albumDataDark;

    const getAudioSrc = () =>
      document.documentElement.classList.contains('light-mode')
        ? "audios/MCR-Na-Na-Na.mp3"
        : "audios/MCR-Welcome-To-The-Black-Parade.mp3";

    let index = 0;
    let interval;

    mcrCard.addEventListener('mouseenter', () => {
      const albumSet = getAlbumSet();
      index = 0;
      mcrAlbums.src = albumSet[index].src;
      mcrAlbumTitle.textContent = albumSet[index].title;

      // Auto-play only if audio is fresh
      if (mcrAudio.currentTime === 0 || mcrAudio.ended) {
        mcrAudio.src = getAudioSrc();
        mcrAudio.play();
        mcrPlayBtn.textContent = "⏸ Pause";
      }

      interval = setInterval(() => {
        mcrWrapper.classList.remove('visible');
        void mcrWrapper.offsetWidth; // force reflow

        setTimeout(() => {
          index = (index + 1) % albumSet.length;
          mcrAlbums.src = albumSet[index].src;
          mcrAlbumTitle.textContent = albumSet[index].title;
          mcrWrapper.classList.add('visible');
        }, 300);
      }, 2000);
    });

    mcrCard.addEventListener('mouseleave', () => {
      clearInterval(interval);
      index = 0;
      const albumSet = getAlbumSet();
      mcrAlbums.src = albumSet[index].src;
      mcrAlbumTitle.textContent = albumSet[index].title;
      mcrWrapper.classList.add('visible');

      // Reset audio only if it was playing
      if (!mcrAudio.paused) {
        mcrAudio.pause();
        mcrAudio.currentTime = 0;
        mcrPlayBtn.textContent = "▶ Play";
      }
    });
  }
})();

(() => {
  /* ===== ACHIEVEMENTS VIDEO HOVER ===== */
  document.querySelectorAll('.skill-card').forEach(card => {
    const video = card.querySelector('video');
    if (video) {
      card.addEventListener('mouseenter', () => {
        video.play().catch(err => console.log("Autoplay blocked:", err));
      });
      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0; // reset to start
      });
    }
  });
})();


(() => {
  /* ===== SMOOTH SCROLLING (extra utility) ===== */
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close mobile menu if open
      document.querySelector('.nav-menu')?.classList.remove('open');
    });
  });

  /* ===== MOBILE MENU TOGGLE ===== */
(() => {
  const menuToggle = document.getElementById("menuToggle"); // ✅ use ID
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }
})();

  /* ===== INITIALIZATION ===== */
  window.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio initialized ✨ Gothic + Jewel theme active");
    // Trigger fade-in reveal once on load
    document.querySelectorAll('.fade-section').forEach(section => {
      section.classList.add('visible');
    });
  });
})();