/* ═══════════════════════════════════════════════════════════════
   PAANTHERA — Main JS (Nav, Animations, Global Utilities)
   ═══════════════════════════════════════════════════════════════ */

const WA_NUMBER = '917387427007';
const WA_BASE   = `https://wa.me/${WA_NUMBER}`;

/* ─── WhatsApp helpers ──────────────────────────────────────── */
function buildWALink(message) {
  return `${WA_BASE}?text=${encodeURIComponent(message)}`;
}

function generalInquiryLink() {
  const msg = `Hi Paanthera! I'd like to learn more about your product range and pricing.\n\nCould you please share your catalog and export pricing details? Thank you!`;
  return buildWALink(msg);
}

/* ─── Navbar ─────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Scroll handler
  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('transparent');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      // Animate hamburger
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });

  // Hook up all WA nav buttons
  document.querySelectorAll('[data-wa-general]').forEach(el => {
    el.href = generalInquiryLink();
  });
}

/* ─── Scroll Animations ──────────────────────────────────────── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ─── Counter Animation ──────────────────────────────────────── */
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(ease * target);
    el.textContent = current + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.counter, 10);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ─── Product Card HTML ──────────────────────────────────────── */
function categoryLabel(cat) {
  const map = {
    polyester: 'Polyester Jersey',
    cotton:    'Cotton T-Shirt',
    shorts:    'Shorts',
    trousers:  'Trousers'
  };
  return map[cat] || cat;
}

function collarLabel(c) {
  if (!c) return null;
  const map = {
    'round-neck':  'Round Neck',
    'polo-collar': 'Polo Collar',
    'v-neck':      'V-Neck'
  };
  return map[c] || c;
}

function sleeveLabel(s) {
  if (!s) return null;
  return s === 'half' ? 'Half Sleeve' : 'Full Sleeve';
}

function subcategoryLabel(sub) {
  const map = {
    sublimation: 'Sublimation',
    plain:       'Plain',
    gym:         'Gym',
    casual:      'Casual',
    sports:      'Sports'
  };
  return map[sub] || sub;
}

function buildProductCard(product, linkPrefix = '') {
  const collar  = collarLabel(product.collar);
  const sleeve  = sleeveLabel(product.sleeve);
  const waLink  = buildWALink(
    `Hi Paanthera! I'm interested in the *${product.name}*.\n\nProduct: ${product.name}\nMaterial: ${product.material}\n${collar ? 'Collar: ' + collar + '\n' : ''}${sleeve ? 'Sleeve: ' + sleeve + '\n' : ''}\nCould you please share pricing, availability, and customization details? Thank you!`
  );

  const badges = [];
  if (product.subcategory) {
    badges.push(`<span class="badge ${product.subcategory === 'sublimation' ? 'badge-gold' : 'badge-dark'}">${subcategoryLabel(product.subcategory)}</span>`);
  }

  const specs = [];
  if (collar) specs.push(collar);
  if (sleeve) specs.push(sleeve);

  return `
    <div class="product-card fade-up" data-category="${product.category}" data-subcategory="${product.subcategory || ''}" data-collar="${product.collar || ''}" data-sleeve="${product.sleeve || ''}">
      <div class="product-card-img">
        ${product.image
          ? `<img src="${product.image}" alt="${product.shortName}" class="product-card-photo" loading="lazy">`
          : `<div class="product-card-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>${categoryLabel(product.category)}</span>
        </div>`}
        <div class="card-badges">${badges.join('')}</div>
        <div class="card-overlay">
          <a href="${linkPrefix}product.html?id=${product.id}" class="btn btn-primary btn-sm">View Details</a>
          <a href="${linkPrefix}enquiry.html?product=${encodeURIComponent(product.id)}" class="btn btn-gold btn-sm">
            Enquire
          </a>
        </div>
      </div>
      <div class="product-card-body">
        <div class="card-cat">${categoryLabel(product.category)}</div>
        <div class="card-name">${product.shortName}</div>
        <div class="card-specs">
          <span class="spec-pill">${product.material.split(' ').slice(0,2).join(' ')}</span>
          ${specs.map(s => `<span class="spec-pill">${s}</span>`).join('')}
        </div>
        <div class="card-footer">
          <div class="card-moq">MOQ <strong>${product.moq} pcs</strong></div>
          <a href="${linkPrefix}product.html?id=${product.id}" class="btn-ghost" style="font-size:0.72rem">Details</a>
        </div>
      </div>
    </div>`;
}

/* ─── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounters();
});

/* ─── Re-observe after dynamic renders ──────────────────────── */
function reObserveFadeUps() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up:not(.visible)').forEach(el => observer.observe(el));
}
