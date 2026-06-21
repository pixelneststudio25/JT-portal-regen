/* ============================================================================
   JESUS TRIBE ABUJA SUMMER CAMP — EDITION 4
   app.js — Premium interactions, mobile menu, API, animations
   ========================================================================== */

var API_URL = 'https://script.google.com/macros/s/PASTE_YOUR_DEPLOYMENT_ID_HERE/exec';
var FALLBACK_CAMP_DATE = '2025-08-14T09:00:00';

// ---- API Helpers ----
async function apiGet(action, params) {
  var url = API_URL + '?action=' + encodeURIComponent(action);
  if (params) {
    for (var key in params) {
      if (params[key] !== undefined && params[key] !== null)
        url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }
  }
  var res = await fetch(url, { method:'GET' });
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

async function apiPost(action, payload) {
  var body = Object.assign({ action: action }, payload || {});
  var res = await fetch(API_URL, {
    method:'POST',
    headers: { 'Content-Type':'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

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

  // Close on link click
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
function startCountdown(targetDateStr) {
  var target = new Date(targetDateStr).getTime();
  if (isNaN(target)) target = new Date(FALLBACK_CAMP_DATE).getTime();

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
  { q:"Who can attend?", a:"Teenagers ages 10–19. Everyone is welcome, whether new or returning." },
  { q:"How do I register?", a:"Tap any \"Register Now\" button and complete the 3‑step form. You'll receive a confirmation email." },
  { q:"Is there a deadline?", a:"Registration closes when capacity is reached or on the announced cut‑off date." },
  { q:"What should I bring?", a:"Check the \"What To Bring\" section — it's updated regularly. Essentials: toiletries, Bible, notebook." },
  { q:"Is there a registration limit?", a:"Yes, to keep the experience safe and personal. Once full, registration closes." },
  { q:"How do I know I'm registered?", a:"You'll see a success screen with your Registration ID and receive a confirmation email." },
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

// ---- Gallery with stock placeholders ----
function initGallery() {
  var grid = document.getElementById('galleryGrid');
  if (!grid) return;

  // Replace these with real photos; currently using Unsplash placeholders
  var photos = [
    { edition:'ed1', label:'It’s Time – Worship', theme:'It’s Time',   src:'https://images.unsplash.com/photo-1506784365847-bad9fdd2e4f2?w=400&q=70' },
    { edition:'ed1', label:'It’s Time – Games',   theme:'It’s Time',   src:'' },
    { edition:'ed1', label:'It’s Time – Group',   theme:'It’s Time',   src:'' },
    { edition:'ed2', label:'Evolve – Sessions',   theme:'Evolve',      src:'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=70' },
    { edition:'ed2', label:'Evolve – Outdoor',    theme:'Evolve',      src:'' },
    { edition:'ed2', label:'Evolve – Finale',     theme:'Evolve',      src:'' },
    { edition:'ed3', label:'Grounded – Opening',  theme:'Grounded',    src:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70' },
    { edition:'ed3', label:'Grounded – Crew',     theme:'Grounded',    src:'' },
    { edition:'ed3', label:'Grounded – Encounter',theme:'Grounded',    src:'' }
  ];

  function render(filter) {
    grid.innerHTML = '';
    photos.forEach(function(photo) {
      if (filter !== 'all' && photo.edition !== filter) return;
      var item = document.createElement('div');
      item.className = 'gallery-item';
      var edTag = photo.edition.replace('ed','Edition ');

      if (photo.src) {
        var img = document.createElement('img');
        img.src = photo.src; img.alt = photo.label;
        img.onerror = function() { this.style.display='none'; item.querySelector('.placeholder-fallback').style.display='flex'; };
        item.appendChild(img);
        var placeholder = document.createElement('div');
        placeholder.className = 'placeholder-content placeholder-fallback';
        placeholder.style.display = 'none';
        placeholder.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28"><rect x="2" y="3" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" fill="none"/></svg><span>'+photo.theme+'</span>';
        item.appendChild(placeholder);
      } else {
        var placeholder = document.createElement('div');
        placeholder.className = 'placeholder-content';
        placeholder.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28"><rect x="2" y="3" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" fill="none"/></svg><span>'+photo.theme+'</span>';
        item.appendChild(placeholder);
      }
      var tag = document.createElement('span');
      tag.className = 'edition-tag'; tag.textContent = edTag;
      item.appendChild(tag);
      item.addEventListener('click', function() { openLightbox(photo); });
      grid.appendChild(item);
    });
  }
  render('all');

  document.querySelectorAll('.gallery-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.gallery-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      render(tab.getAttribute('data-filter'));
    });
  });

  var lightbox = document.getElementById('lightbox');
  var closeBtn = document.getElementById('lightboxClose');
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeLightbox(); });
}

function openLightbox(photo) {
  var lightbox = document.getElementById('lightbox');
  var img = document.getElementById('lightboxImg');
  var label = document.getElementById('lightboxLabel');
  if (!lightbox) return;
  if (photo.src && img) {
    img.src = photo.src; img.alt = photo.label; img.style.display = 'block';
    label.style.display = 'none';
  } else {
    img.style.display = 'none';
    label.style.display = 'block';
    label.textContent = photo.theme + ' – ' + photo.label;
  }
  lightbox.classList.add('open');
}
function closeLightbox() {
  var lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.classList.remove('open');
}

// ---- Testimonials (static data) ----
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

// ---- Config & Requirements Loading ----
async function loadLandingData() {
  document.getElementById('year').textContent = new Date().getFullYear();

  try {
    var cfgRes = await apiGet('getConfig');
    if (cfgRes && cfgRes.ok && cfgRes.config) {
      var c = cfgRes.config;
      setText('heroTheme', c.CAMP_THEME || 'Theme to be announced');
      setText('infoTheme', c.CAMP_THEME || 'TBA');
      setText('infoLocation', c.CAMP_LOCATION);
      if (c.CAMP_TAGLINE) setText('heroTagline', c.CAMP_TAGLINE);
      if (c.CAMP_DATE) {
        setText('infoDate', formatHumanDate(c.CAMP_DATE));
        startCountdown(c.CAMP_DATE);
      } else {
        startCountdown(FALLBACK_CAMP_DATE);
      }
    } else {
      startCountdown(FALLBACK_CAMP_DATE);
    }
  } catch (err) {
    startCountdown(FALLBACK_CAMP_DATE);
  }

  loadRequirements();
}

async function loadRequirements() {
  var list = document.getElementById('reqList');
  if (!list) return;
  try {
    var res = await apiGet('getRequirements');
    if (res && res.ok && res.requirements && res.requirements.length) {
      list.innerHTML = '';
      res.requirements.forEach(function(req) {
        var item = document.createElement('div');
        item.className = 'req-item glass';
        item.innerHTML = '<span class="check"><svg viewBox="0 0 24 24" width="18" height="18"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/></svg></span><span class="txt"></span>';
        item.querySelector('.txt').textContent = req;
        list.appendChild(item);
      });
    } else {
      list.innerHTML = '<div class="req-item glass"><span class="txt">Requirements coming soon.</span></div>';
    }
  } catch (err) {
    list.innerHTML = '<div class="req-item glass"><span class="txt">Could not load requirements.</span></div>';
  }
}

function setText(id, value) {
  var el = document.getElementById(id);
  if (el && value !== undefined && value !== null && value !== '') el.textContent = value;
}

function formatHumanDate(iso) {
  try {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  } catch(e) { return iso; }
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
  initFaq();
  initGallery();
  initTestimonials();
  initMobileCta();
  loadLandingData();
});