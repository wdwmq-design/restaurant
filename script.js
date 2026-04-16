/* ═══════════════════════════════════════════════
   METRO INN RESIDENCY — MAIN JAVASCRIPT
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── STICKY NAVBAR ──────────────────────────── */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── HAMBURGER MENU ─────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── SMOOTH SCROLL ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 10;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── ACTIVE NAV LINK HIGHLIGHT ──────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const highlightNavLink = () => {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNavLink, { passive: true });

  /* ── SCROLL-REVEAL (AOS-lite) ───────────────── */
  const aosElements = document.querySelectorAll('[data-aos]');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay) || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  aosElements.forEach(el => revealObserver.observe(el));

  /* ── FLOATING BUTTONS VISIBILITY ────────────── */
  const floatingBtns = document.getElementById('floating-buttons');
  const floatingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        floatingBtns.style.opacity = '0';
        floatingBtns.style.pointerEvents = 'none';
      } else {
        floatingBtns.style.opacity = '1';
        floatingBtns.style.pointerEvents = 'auto';
      }
    });
  }, { threshold: 0.5 });

  const heroSection = document.getElementById('home');
  if (heroSection) floatingObserver.observe(heroSection);
  floatingBtns.style.transition = 'opacity 0.4s ease';

  /* ── GALLERY LIGHTBOX ───────────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    position:fixed; inset:0; z-index:2000;
    background:rgba(0,0,0,0.92);
    display:none; align-items:center; justify-content:center;
    cursor:zoom-out; opacity:0;
    transition: opacity 0.35s ease;
    backdrop-filter: blur(10px);
  `;

  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = `
    max-width:90vw; max-height:85vh;
    border-radius:12px; object-fit:contain;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
    transform: scale(0.92); opacity:0;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease;
  `;

  const lightboxCaption = document.createElement('p');
  lightboxCaption.style.cssText = `
    position:absolute; bottom:2rem; left:50%;
    transform:translateX(-50%);
    color:#E8C97A; font-size:1rem;
    letter-spacing:0.15em; font-weight:600;
    text-transform:uppercase;
  `;

  const lightboxClose = document.createElement('button');
  lightboxClose.innerHTML = '&times;';
  lightboxClose.style.cssText = `
    position:absolute; top:1.5rem; right:2rem;
    background:none; border:none;
    color:#C9A84C; font-size:2.5rem;
    cursor:pointer; line-height:1;
    transition: color 0.25s;
  `;
  lightboxClose.addEventListener('mouseenter', () => lightboxClose.style.color = '#fff');
  lightboxClose.addEventListener('mouseleave', () => lightboxClose.style.color = '#C9A84C');

  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(lightboxCaption);
  lightbox.appendChild(lightboxClose);
  document.body.appendChild(lightbox);

  const openLightbox = (src, caption) => {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      lightbox.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
      lightboxImg.style.opacity = '1';
    });
  };

  const closeLightbox = () => {
    lightbox.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.92)';
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }, 350);
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-overlay span')?.textContent || '';
      openLightbox(img.src, caption);
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxClose) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightbox();
  });

  /* ── NAV-LINK ACTIVE STATE STYLE ────────────── */
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--gold) !important;
      background: rgba(201,168,76,0.08);
    }
  `;
  document.head.appendChild(style);

  /* ── PANNELLUM 360° VIEWER ─────────────────── */
  const panoramaEl = document.getElementById('panorama');
  const panoLoader = document.getElementById('pannellum-loader');

  if (panoramaEl && typeof pannellum !== 'undefined') {
    const viewer = pannellum.viewer('panorama', {
      type:        'equirectangular',
      panorama:    'images/room1.jpeg',
      autoLoad:    true,
      autoRotate:  -2,
      autoRotateInactivityDelay: 3000,
      compass:     false,
      showControls: true,
      showFullscreenCtrl: true,
      showZoomCtrl: true,
      hfov:        100,
      minHfov:     50,
      maxHfov:     120,
      pitch:       0,
      yaw:         0,
      mouseZoom:   true,
      friction:    0.15,
      hotSpotDebug: false,
      sceneFadeDuration: 1000,
    });

    // Hide custom loader when panorama is ready
    viewer.on('load', () => {
      if (panoLoader) panoLoader.classList.add('hidden');
    });

    // Fallback: hide loader after 5s in case event doesn't fire
    setTimeout(() => {
      if (panoLoader && !panoLoader.classList.contains('hidden')) {
        panoLoader.classList.add('hidden');
      }
    }, 5000);
  }

  /* ── CHAT WIDGET ──────────────────────────── */
  const chatWidget  = document.getElementById('chat-widget');
  const chatToggle  = document.getElementById('chat-toggle');
  const chatClose   = document.getElementById('chat-close');
  const chatWindow  = document.getElementById('chat-window');
  const chatBody    = document.getElementById('chat-body');
  const qrButtons   = document.querySelectorAll('.qr-btn');

  let greeted = false; // show welcome only once per session

  /* ── Responses map ────────────────────────── */
  const RESPONSES = {
    rooms:
      'Our rooms include split AC, free high-speed WiFi, premium bedding, clean attached bathrooms, and daily housekeeping. We have Deluxe, Standard, and Executive Suite options. 🛏',
    amenities:
      'We offer free WiFi throughout the property, 24/7 room service, round-the-clock CCTV security, daily housekeeping, quick check-in/out, and a prime location near key areas. ✨',
    location:
      'We are conveniently located near APMC Market, Kalyan. Easy access to local transport, markets, and major attractions. 📍',
    booking:
      'You can book directly by calling us:\n📞 8451848400  or  9004771777\n\nOur front desk is available 24/7 to assist you!',
    food:
      'Food service is available at the property. Several popular restaurants and eateries are also located nearby for your convenience. 🍽',
  };

  /* ── Helpers ──────────────────────────────── */
  const getTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const scrollToBottom = () => {
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const addMessage = (text, role) => {
    const wrap = document.createElement('div');
    wrap.className = `chat-msg ${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;

    const time = document.createElement('span');
    time.className = 'chat-time';
    time.textContent = getTime();

    wrap.appendChild(bubble);
    wrap.appendChild(time);
    chatBody.appendChild(wrap);
    scrollToBottom();
  };

  const showTyping = () => {
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg bot';
    wrap.id = 'typing-wrap';

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;

    wrap.appendChild(indicator);
    chatBody.appendChild(wrap);
    scrollToBottom();
  };

  const removeTyping = () => {
    const el = document.getElementById('typing-wrap');
    if (el) el.remove();
  };

  const botReply = (text, delay = 1200) => {
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMessage(text, 'bot');
    }, delay);
  };

  /* ── Open / Close ─────────────────────────── */
  const openChat = () => {
    chatWidget.classList.add('is-open');
    chatToggle.setAttribute('aria-expanded', 'true');
    chatToggle.setAttribute('aria-label', 'Close chat');
    chatWindow.setAttribute('aria-hidden', 'false');

    // Show welcome message only the first time
    if (!greeted) {
      greeted = true;
      setTimeout(() => {
        botReply('Hi! 👋 Welcome to Metro Inn Residency. How can I help you today?', 600);
      }, 300);
    }
  };

  const closeChat = () => {
    chatWidget.classList.remove('is-open');
    chatToggle.setAttribute('aria-expanded', 'false');
    chatToggle.setAttribute('aria-label', 'Open chat');
    chatWindow.setAttribute('aria-hidden', 'true');
  };

  chatToggle.addEventListener('click', () => {
    chatWidget.classList.contains('is-open') ? closeChat() : openChat();
  });

  chatClose.addEventListener('click', closeChat);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWidget.classList.contains('is-open')) {
      closeChat();
      chatToggle.focus();
    }
  });

  /* ── Quick Reply buttons ──────────────────── */
  qrButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const label = btn.textContent.trim();

      // Show user bubble
      addMessage(label, 'user');

      // Bot responds after typing delay
      const response = RESPONSES[key] || "Sorry, I didn't understand that. Please try another option.";
      botReply(response, 1300);
    });
  });

});
