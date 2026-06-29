/* ============================================================================
   JESUS TRIBE ABUJA SUMMER CAMP — EDITION 4
   app.js — Premium interactions, mobile menu, static content, horizontal gallery
   ========================================================================== */

// ---- Hardcoded camp date ----
var CAMP_DATE = '2026-08-13T08:00:00';

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

// ---- Intro Overlay ----
function initIntro() {
  var overlay = document.getElementById('introOverlay');
  if (!overlay) return;
  window.addEventListener('load', function() {
    setTimeout(function() { overlay.classList.add('hide'); }, 1800);
  });
}

// ---- Nav & Mobile Menu (slide from left) ----
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
  if (isNaN(target)) target = new Date('2026-08-13T08:00:00').getTime();

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

// ---- Gallery (horizontal scroll, no filters) ----
function initGallery() {
  var scroll = document.getElementById('galleryScroll');
  if (!scroll) return;

  
  var photos = [
    // === First batch (10 images) ===
    { label: 'Moments', src: 'IMG_5872.jpg' },
    { label: 'Moments', src: 'IMG_5900.jpg' },
    { label: 'Sessions', src: 'IMG_5908.jpg' },
    { label: 'Moments', src: 'IMG_6343.jpg' },
    { label: 'Moments', src: 'IMG_6397.jpg' },
    { label: 'Moments', src: 'IMG_6402.jpg' },
    { label: 'Creative Tracks', src: 'IMG_6419.jpg' },
    { label: 'Moments', src: 'IMG_6421.jpg' },
    { label: 'Camp Highlights', src: 'IMG_6460.jpg' },
    { label: 'Main Worship', src: 'IMG_6537.jpg' },

    // === New batch (8 images) ===
    { label: 'Arrival & Check-in', src: 'IMG_5181.jpg' },
    { label: 'Moments', src: 'IMG_5183.jpg' },
    { label: 'Moments', src: 'IMG_5189.jpg' },
    { label: 'Teaching Session', src: 'IMG_5192.jpg' },
    { label: 'Games & Fun', src: 'IMG_5200.jpg' },
    { label: 'Small Groups', src: 'IMG_5209.jpg' },
    { label: 'Prayer Session', src: 'IMG_5210.jpg' },
    { label: 'Group Activities', src: 'IMG_5215.jpg' }
];

  scroll.innerHTML = '';
  photos.forEach(function(photo) {
    var item = document.createElement('div');
    item.className = 'gallery-item';
    var img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.label;
    img.loading = 'lazy';
    img.onerror = function() {
      this.style.display = 'none';
      var fallback = item.querySelector('.placeholder-fallback');
      if (fallback) fallback.style.display = 'flex';
    };
    item.appendChild(img);

    var fallback = document.createElement('div');
    fallback.className = 'placeholder-content placeholder-fallback';
    fallback.style.display = 'none';
    fallback.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28"><rect x="2" y="3" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" fill="none"/></svg><span>JT Camp</span>';
    item.appendChild(fallback);

    var tag = document.createElement('span');
    tag.className = 'edition-tag';
    tag.textContent = 'Grounded';
    item.appendChild(tag);

    item.addEventListener('click', function() {
      openLightbox(photo.src, photo.label);
    });
    scroll.appendChild(item);
  });
}

// ---- Lightbox ----
function openLightbox(src, label) {
  var lightbox = document.getElementById('lightbox');
  var img = document.getElementById('lightboxImg');
  var labelEl = document.getElementById('lightboxLabel');
  if (!lightbox) return;
  if (src) {
    img.src = src;
    img.alt = label || 'Camp photo';
    img.style.display = 'block';
    labelEl.style.display = 'none';
  } else {
    img.style.display = 'none';
    labelEl.style.display = 'block';
    labelEl.textContent = label || 'Photo';
  }
  lightbox.classList.add('open');
}
function closeLightbox() {
  var lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.classList.remove('open');
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

// ---- Boot ----
document.addEventListener('DOMContentLoaded', function() {
  initIntro();
  initNav();
  initReveal();
  startCountdown();
  initFaq();
  initGallery();
  initTestimonials();
  initMobileCta();

  // Lightbox close events
  var closeBtn = document.getElementById('lightboxClose');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
});
