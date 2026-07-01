/* ============================================================================
   JESUS TRIBE ABUJA SUMMER CAMP — EDITION 4
   app.js — Premium interactions, mobile menu, static content, filterable gallery
   ========================================================================== */

// ---- Hardcoded camp date (19–23 August 2026) ----
var CAMP_DATE = '2026-08-19T08:00:00';

// ---- Toast (optional) ----
function toast(msg, type) {
  var wrap = document.getElementById('toastWrap');
  if (!wrap) { alert(msg); return; }
  var el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(function() {
    el.style.transition = 'opacity 0.3s';
    el.style.opacity = '0';
    setTimeout(function() { el.remove(); }, 320);
  }, 4500);
}

function initIntro() {
  var overlay = document.getElementById('introOverlay');
  var tagline = document.getElementById('introTagline');
  if (!overlay || !tagline) return;

  // ---- Typed.js logic ----
  if (typeof Typed !== 'undefined') {
    var typed = new Typed(tagline, {
      strings: ['TCN ABUJA · JESUS TRIBE'],
      typeSpeed: 54,
      startDelay: 300,
      showCursor: false,
      cursorChar: '|',
      onComplete: function() {
        setTimeout(function() {
          overlay.classList.add('hide');
        }, 2200);
      }
    });
    window.typedInstance = typed;
  } else {
    // Fallback: static text
    tagline.textContent = 'TCN ABUJA · JESUS TRIBE PRESENTS';
    setTimeout(function() {
      overlay.classList.add('hide');
    }, 2500);
  }

  // ---- Click/tap to skip ----
  overlay.addEventListener('click', function() {
    if (!overlay.classList.contains('hide')) {
      overlay.classList.add('hide');
      if (window.typedInstance) {
        window.typedInstance.stop();
        window.typedInstance.cursor.remove();
      }
    }
  });
}

// ---- Nav & Mobile Menu ----
function initNav() {
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var overlay = document.getElementById('mobileMenuOverlay');
  var closeBtn = document.getElementById('mobileClose');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  function openMenu() {
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() { closeMenu(); });
  });
}

// ---- Scroll Reveal ----
function initReveal() {
  var items = document.querySelectorAll('.reveal');
  if (!items.length || !('IntersectionObserver' in window)) {
    items.forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(function(el) { obs.observe(el); });
}

// ---- Countdown ----
var _countdownInterval = null;
function startCountdown() {
  var target = new Date(CAMP_DATE).getTime();
  if (isNaN(target)) target = new Date('2026-08-19T08:00:00').getTime();

  var elDays = document.getElementById('cd-days');
  var elHours = document.getElementById('cd-hours');
  var elMins = document.getElementById('cd-mins');
  var elSecs = document.getElementById('cd-secs');
  if (!elDays) return;

  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      elDays.textContent = '00'; elHours.textContent = '00';
      elMins.textContent = '00'; elSecs.textContent = '00';
      if (_countdownInterval) clearInterval(_countdownInterval);
      return;
    }
    elDays.textContent = pad(Math.floor(diff / 86400000));
    elHours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    elMins.textContent = pad(Math.floor((diff % 3600000) / 60000));
    elSecs.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  tick();
  if (_countdownInterval) clearInterval(_countdownInterval);
  _countdownInterval = setInterval(tick, 1000);
}

// ---- FAQ Accordion ----
var faqData = [
  { q:"Who can attend?", a:"Teenagers ages 13–19. Everyone is welcome, whether new or returning." },
  { q:"How do I register?", a:"Tap any \"Register Now\" button – it will take you to our Google Form. Complete the form and you'll receive a confirmation email." },
  { q:"Is there a deadline?", a:"Registration closes when capacity is reached or on the announced cut‑off date." },
  { q:"What should I bring?", a:"Check the \"Requirements\" page for separate lists for boys and girls – it's kept up to date." },
  { q:"Is there a registration limit?", a:"Yes, to keep the experience safe and personal. Once full, registration closes." },
  { q:"How do I know I'm registered?", a:"You'll see a confirmation screen after submitting the Google Form and receive a confirmation email." },
  { q:"Can a parent register for me?", a:"Absolutely. The form captures both your details and parent/guardian info." },
  { q:"What is TCN / Jesus Tribe?", a:"The Covenant Nation (TCN) is a Nigerian church network. Jesus Tribe is its teen ministry." }
];

function initFaq() {
  var faqList = document.getElementById('faqList');
  if (!faqList) return;
  faqList.innerHTML = '';
  faqData.forEach(function(item) {
    var faqItem = document.createElement('div');
    faqItem.className = 'faq-item glass';
    faqItem.innerHTML = '<button class="faq-q" aria-expanded="false">' + item.q + ' <span class="plus">+</span></button><div class="faq-a"><div class="faq-a-inner">' + item.a + '</div></div>';
    faqList.appendChild(faqItem);
    var qBtn = faqItem.querySelector('.faq-q');
    var aDiv = faqItem.querySelector('.faq-a');
    qBtn.addEventListener('click', function() {
      var isOpen = faqItem.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(o) {
        o.classList.remove('open');
        var oa = o.querySelector('.faq-a'); if (oa) oa.style.maxHeight = null;
        var oq = o.querySelector('.faq-q'); if (oq) oq.setAttribute('aria-expanded','false');
      });
      if (!isOpen) {
        faqItem.classList.add('open');
        aDiv.style.maxHeight = aDiv.scrollHeight + 'px';
        qBtn.setAttribute('aria-expanded','true');
      }
    });
  });
}

// ============================================================
//  GALLERY — FILTERABLE VERTICAL GRID WITH LIGHTBOX
// ============================================================

var galleryPhotos = [];
var filteredPhotos = [];

function initGallery() {
  var grid = document.getElementById('galleryGrid');
  if (!grid) return;

  // ---- PHOTOS ARRAY (with years) ----
  galleryPhotos = [
    // Grounded, 2025
    { label: 'Moments', src: 'IMG-20260629-WA0003.jpg', edition: "Grounded, 2025" },
    { label: 'Moments', src: 'IMG-20260629-WA0004.jpg', edition: "Evolve, 2024" },
    { label: 'Sessions', src: 'IMG-20260629-WA0005.jpg', edition: "Grounded, 2025" },
    { label: 'Moments', src: 'IMG_5872.jpg', edition: "Grounded, 2025" },
    { label: 'Moments', src: 'IMG_5900.jpg', edition: "Grounded, 2025" },
    { label: 'Sessions', src: 'IMG_5908.jpg', edition: "Grounded, 2025" },
    { label: 'Moments', src: 'IMG_6343.jpg', edition: "Grounded, 2025" },
    { label: 'Moments', src: 'IMG_6397.jpg', edition: "Grounded, 2025" },
    { label: 'Moments', src: 'IMG_6402.jpg', edition: "Grounded, 2025" },
    { label: 'Creative Tracks', src: 'IMG_6419.jpg', edition: "Grounded, 2025" },
    { label: 'Moments', src: 'IMG_6421.jpg', edition: "Grounded, 2025" },
    { label: 'Camp Highlights', src: 'IMG_6460.jpg', edition: "Grounded, 2025" },
    { label: 'Main Worship', src: 'IMG_6537.jpg', edition: "Grounded, 2025" },
    { label: 'Arrival & Check-in', src: 'IMG_5181.jpg', edition: "Grounded, 2025" },
    { label: 'Moments', src: 'IMG_5183.jpg', edition: "Grounded, 2025" },
    { label: 'Moments', src: 'IMG_5189.jpg', edition: "Grounded, 2025" },
    { label: 'Teaching Session', src: 'IMG_5192.jpg', edition: "Grounded, 2025" },
    { label: 'Games & Fun', src: 'IMG_5200.jpg', edition: "Grounded, 2025" },
    { label: 'Small Groups', src: 'IMG_5209.jpg', edition: "Grounded, 2025" },
    { label: 'Prayer Session', src: 'IMG_5210.jpg', edition: "Grounded, 2025" },
    { label: 'Group Activities', src: 'IMG_5215.jpg', edition: "Grounded, 2025" },

    // It's Time, 2023 (20)
    { label: 'Check-in', src: 'MG_0476.JPG', edition: "It's Time, 2023" },
    { label: 'Moments', src: 'MG_0477.JPG', edition: "It's Time, 2023" },
    { label: 'Workshop', src: 'MG_0487.JPG', edition: "It's Time, 2023" },
    { label: 'Networking', src: 'MG_0488.JPG', edition: "It's Time, 2023" },
    { label: 'Discussion', src: 'MG_0494.JPG', edition: "It's Time, 2023" },
    { label: 'Community', src: 'MG_0496.JPG', edition: "It's Time, 2023" },
    { label: 'Group Photo', src: 'MG_1285.JPG', edition: "It's Time, 2023" },
    { label: 'Team', src: 'MG_1286.JPG', edition: "It's Time, 2023" },
    { label: 'Learning', src: 'MG_1309.JPG', edition: "It's Time, 2023" },
    { label: 'Audience', src: 'MG_1310.JPG', edition: "It's Time, 2023" },
    { label: 'Creative Session', src: '_MG_1311.JPG', edition: "It's Time, 2023" },
    { label: 'Workshop', src: '_MG_1313.JPG', edition: "It's Time, 2023" },
    { label: 'Speakers', src: '_MG_1315.JPG', edition: "It's Time, 2023" },
    { label: 'Collaboration', src: '_MG_1316.JPG', edition: "It's Time, 2023" },
    { label: 'Presentation', src: '_MG_1319.JPG', edition: "It's Time, 2023" },
    { label: 'Discussion', src: '_MG_1320.JPG', edition: "It's Time, 2023" },
    { label: 'Portrait', src: '_MG_1321.JPG', edition: "It's Time, 2023" },
    { label: 'Community', src: '_MG_1328.JPG', edition: "It's Time, 2023" },
    { label: 'Interaction', src: '_MG_1331.JPG', edition: "It's Time, 2023" },
    { label: 'Teaching', src: '_MG_1334.JPG', edition: "It's Time, 2023" },

    // Evolve, 2024 – Stage & Indoor (20)
    { label: 'Audience', src: '_MG_2473.jpg', edition: "Evolve, 2024" },
    { label: 'Check-in', src: '_MG_2475.jpg', edition: "Evolve, 2024" },
    { label: 'Speaker', src: '_MG_2476.jpg', edition: "Evolve, 2024" },
    { label: 'Presentation', src: '_MG_2478.jpg', edition: "Evolve, 2024" },
    { label: 'Discussion', src: '_MG_2483.jpg', edition: "Evolve, 2024" },
    { label: 'Audience', src: '_MG_2484.jpg', edition: "Evolve, 2024" },
    { label: 'Worship', src: '_MG_2486.jpg', edition: "Evolve, 2024" },
    { label: 'Praise', src: '_MG_2487.jpg', edition: "Evolve, 2024" },
    { label: 'Moments', src: '_MG_2490.jpg', edition: "Evolve, 2024" },
    { label: 'Community', src: '_MG_2493.jpg', edition: "Evolve, 2024" },
    { label: 'Engagement', src: '_MG_2495.jpg', edition: "Evolve, 2024" },
    { label: 'Audience', src: '_MG_2497.jpg', edition: "Evolve, 2024" },
    { label: 'Learning', src: '_MG_2500.jpg', edition: "Evolve, 2024" },
    { label: 'Discussion', src: '_MG_2502.jpg', edition: "Evolve, 2024" },
    { label: 'Celebration', src: '_MG_2510.jpg', edition: "Evolve, 2024" },
    { label: 'Speaker', src: '_MG_2511.jpg', edition: "Evolve, 2024" },
    { label: 'Panel', src: '_MG_2518.jpg', edition: "Evolve, 2024" },
    { label: 'Conversation', src: '_MG_2541.jpg', edition: "Evolve, 2024" },
    { label: 'Portrait', src: '_MG_2549.jpg', edition: "Evolve, 2024" },
    { label: 'Session', src: '_MG_2556.jpg', edition: "Evolve, 2024" },

    // Evolve, 2024 – Outdoor & Activities (20)
    { label: 'Panel', src: '_MG_2566.jpg', edition: "Evolve, 2024" },
    { label: 'Discussion', src: '_MG_2568.jpg', edition: "Evolve, 2024" },
    { label: 'Moments', src: '_MG_2576.jpg', edition: "Evolve, 2024" },
    { label: 'Portrait', src: '_MG_2581.jpg', edition: "Evolve, 2024" },
    { label: 'Speaker', src: '_MG_2582.jpg', edition: "Evolve, 2024" },
    { label: 'Volunteer', src: '_MG_2587.jpg', edition: "Evolve, 2024" },
    { label: 'Group Photo', src: '_MG_2590.jpg', edition: "Evolve, 2024" },
    { label: 'Team', src: '_MG_2592.jpg', edition: "Evolve, 2024" },
    { label: 'Sports', src: '_MG_2623.jpg', edition: "Evolve, 2024" },
    { label: 'Basketball', src: '_MG_2641.jpg', edition: "Evolve, 2024" },
    { label: 'Community', src: '_MG_2644.jpg', edition: "Evolve, 2024" },
    { label: 'Activities', src: '_MG_2646.jpg', edition: "Evolve, 2024" },
    { label: 'Moments', src: '_MG_2648.jpg', edition: "Evolve, 2024" },
    { label: 'Football', src: '_MG_2665.jpg', edition: "Evolve, 2024" },
    { label: 'Teamwork', src: '_MG_2679.jpg', edition: "Evolve, 2024" },
    { label: 'Basketball', src: '_MG_2685.jpg', edition: "Evolve, 2024" },
    { label: 'Sports', src: '_MG_2687.jpg', edition: "Evolve, 2024" },
    { label: 'Games', src: '_MG_2690.jpg', edition: "Evolve, 2024" },
    { label: 'Activities', src: '_MG_2697.jpg', edition: "Evolve, 2024" },
    { label: 'Fellowship', src: '_MG_2699.jpg', edition: "Evolve, 2024" }
  ];

  // ---- Render function ----
  function render(edition) {
    grid.innerHTML = '';
    filteredPhotos = edition === 'all'
      ? galleryPhotos
      : galleryPhotos.filter(function(p) { return p.edition === edition; });

    if (filteredPhotos.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted); text-align:center; width:100%; padding:40px 0;">No photos for this edition yet.</p>';
      window._filteredPhotos = [];
      return;
    }

    filteredPhotos.forEach(function(photo, index) {
      var item = document.createElement('div');
      item.className = 'gallery-item';
      item.dataset.index = index;

      var img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.label;
      img.loading = 'lazy';
      img.onerror = function() {
        this.style.display = 'none';
        var fb = item.querySelector('.placeholder-fallback');
        if (fb) fb.style.display = 'flex';
      };
      item.appendChild(img);

      var fallback = document.createElement('div');
      fallback.className = 'placeholder-content placeholder-fallback';
      fallback.style.display = 'none';
      fallback.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28"><rect x="2" y="3" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" fill="none"/></svg><span>JT Camp</span>';
      item.appendChild(fallback);

      var tag = document.createElement('span');
      tag.className = 'edition-tag';
      tag.textContent = photo.edition || 'Moments';
      item.appendChild(tag);

      item.addEventListener('click', function() {
        var idx = parseInt(this.dataset.index);
        openLightbox(idx);
      });

      grid.appendChild(item);
    });

    window._filteredPhotos = filteredPhotos;
  }

  // ---- Filter buttons ----
  var btns = document.querySelectorAll('.filter-btn');
  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      btns.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      render(this.dataset.edition);
    });
  });

  // ---- Clicking an edition tag filters the gallery ----
  // Using event delegation on the grid
  grid.addEventListener('click', function(e) {
    var tag = e.target.closest('.edition-tag');
    if (tag) {
      e.stopPropagation();
      var edition = tag.textContent.trim();
      var btns = document.querySelectorAll('.filter-btn');
      btns.forEach(function(btn) {
        // Match by data-edition or display text
        if (btn.dataset.edition === edition || btn.textContent.trim() === edition) {
          btn.click();
        }
      });
    }
  });

  // ---- Initial render (All) ----
  render('all');
}

// ============================================================
//  LIGHTBOX — WORKS WITH FILTERED PHOTOS
// ============================================================

var lightboxIndex = 0;

function openLightbox(index) {
  var photos = window._filteredPhotos || [];
  if (!photos.length) return;
  lightboxIndex = index;
  showLightboxPhoto(index);
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLightboxPhoto(index) {
  var photos = window._filteredPhotos || [];
  var img = document.getElementById('lightboxImg');
  var label = document.getElementById('lightboxLabel');
  if (!img || !label) return;
  var photo = photos[index];
  if (!photo) return;

  if (photo.src) {
    img.src = photo.src;
    img.alt = photo.label || 'Camp photo';
    img.style.display = 'block';
    label.style.display = 'none';
  } else {
    img.style.display = 'none';
    label.style.display = 'block';
    label.textContent = photo.label || 'Photo';
  }
  updateLightboxNav(index, photos.length);
}

function updateLightboxNav(current, total) {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  var nav = lightbox.querySelector('.lightbox-nav');
  if (!nav) {
    nav = document.createElement('div');
    nav.className = 'lightbox-nav';
    nav.innerHTML = `
      <button class="lightbox-prev" aria-label="Previous">‹</button>
      <span class="lightbox-counter">${current + 1} / ${total}</span>
      <button class="lightbox-next" aria-label="Next">›</button>
    `;
    lightbox.querySelector('.lightbox-content').appendChild(nav);
    nav.querySelector('.lightbox-prev').addEventListener('click', function(e) {
      e.stopPropagation();
      lightboxNavigate(-1);
    });
    nav.querySelector('.lightbox-next').addEventListener('click', function(e) {
      e.stopPropagation();
      lightboxNavigate(1);
    });
  }
  var counter = nav.querySelector('.lightbox-counter');
  if (counter) counter.textContent = (current + 1) + ' / ' + total;
}

function lightboxNavigate(direction) {
  var photos = window._filteredPhotos || [];
  if (!photos.length) return;
  var newIndex = lightboxIndex + direction;
  if (newIndex < 0) newIndex = photos.length - 1;
  if (newIndex >= photos.length) newIndex = 0;
  lightboxIndex = newIndex;
  showLightboxPhoto(lightboxIndex);
}

function closeLightbox() {
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ---- Lightbox Touch Swipe & Keyboard ----
function initLightboxSwipe() {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var touchStartX = 0;

  lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, { passive: false });

  lightbox.addEventListener('touchend', function(e) {
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) lightboxNavigate(1);
      else lightboxNavigate(-1);
    }
  }, { passive: true });

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') lightboxNavigate(-1);
    if (e.key === 'ArrowRight') lightboxNavigate(1);
    if (e.key === 'Escape') closeLightbox();
  });
}

// ---- Testimonials ----
function initTestimonials() {
  var grid = document.getElementById('testiGrid');
  if (!grid) return;
  var testimonialData = [
    { quote:"Camp literally changed how I see my faith. I came shy and left with a whole squad of real friends.", name:"David A.", meta:"Edition 3" },
    { quote:"The worship nights gave me chills. I'd never felt God that close before. Best three days of my year.", name:"Zara O.", meta:"Editions 2 & 3" },
    { quote:"I was nervous because I didn't know anyone. By day one everyone felt like family.", name:"Tobi E.", meta:"Edition 3" },
    { quote:"My parents were unsure at first, but after Edition 1 I begged to go back every year. Jesus Tribe is my second home.", name:"Mary K.", meta:"Editions 1–3" },
    { quote:"The leaders actually listen. I learned so much about purpose and made memories I'll never forget.", name:"Joshua N.", meta:"Edition 2" }
  ];
  grid.innerHTML = '';
  testimonialData.forEach(function(t) {
    var card = document.createElement('div');
    card.className = 'testi-card glass';
    card.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" stroke="#CAA53C" fill="none" style="margin-bottom:10px;"><path d="M10 11H4V6c0-2 1-4 4-4h1M20 11h-6V6c0-2 1-4 4-4h1" stroke-width="2"/></svg><p class="quote">' + t.quote + '</p><div class="testi-author"><div class="testi-avatar">' + t.name.charAt(0) + '</div><div><div class="name">' + t.name + '</div><div class="meta">' + t.meta + '</div></div></div>';
    grid.appendChild(card);
  });
}

// ---- Mobile Floating CTA ----
function initMobileCta() {
  var cta = document.getElementById('mobileCta');
  if (!cta) return;
  var hero = document.getElementById('hero');
  function check() {
    if (window.innerWidth <= 680 && hero && window.scrollY > hero.offsetHeight * 0.5) {
      cta.classList.add('show');
    } else {
      cta.classList.remove('show');
    }
  }
  window.addEventListener('scroll', check);
  window.addEventListener('resize', check);
}

// ---- Requirements Page: Gateway + Display ----
function initRequirements() {
  var gateway = document.getElementById('genderGateway');
  var display = document.getElementById('requirementsDisplay');
  var boysList = document.getElementById('boysList');
  var girlsList = document.getElementById('girlsList');
  var changeBtn = document.getElementById('changeGenderBtn');
  var cards = document.querySelectorAll('.gender-card');

  if (!gateway || !display || !boysList || !girlsList || !changeBtn || !cards.length) return;

  function showGender(gender) {
    gateway.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    gateway.style.opacity = '0';
    gateway.style.transform = 'scale(0.95)';

    setTimeout(function() {
      gateway.style.display = 'none';
      display.style.display = 'block';
      requestAnimationFrame(function() {
        display.classList.add('visible');
      });
    }, 400);

    if (gender === 'boys') {
      boysList.style.display = 'block';
      girlsList.style.display = 'none';
    } else {
      boysList.style.display = 'none';
      girlsList.style.display = 'block';
    }
  }

  function resetToGateway() {
    display.classList.remove('visible');
    display.style.display = 'none';
    gateway.style.display = 'block';
    requestAnimationFrame(function() {
      gateway.style.opacity = '1';
      gateway.style.transform = 'scale(1)';
    });
  }

  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      var gender = this.dataset.gender;
      showGender(gender);
    });
  });

  changeBtn.addEventListener('click', resetToGateway);
}

// ---- BOOT ----
document.addEventListener('DOMContentLoaded', function() {
  initIntro();
  initNav();
  initReveal();
  startCountdown();
  initFaq();
  initGallery();
  initTestimonials();
  initMobileCta();
  initLightboxSwipe();
  initRequirements();

  // Lightbox close events
  var closeBtn = document.getElementById('lightboxClose');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
});
