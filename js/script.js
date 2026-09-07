/* =========================================================
   ATELIER ROAST — Shared site behavior
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Sticky header shadow on scroll ---- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileNav.classList.remove('is-open'))
    );
  }

  /* ---- Toast helper (used for "Order Cup", newsletter, forms) ---- */
  const toast = document.querySelector('.toast');
  let toastTimer;
  window.showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  /* ---- "Order Cup" buttons (menu + home signature drinks) ---- */
  document.querySelectorAll('[data-order]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.showToast(`${btn.dataset.order} added to your cup ☕`);
    });
  });

  /* ---- Newsletter form (footer) ---- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.showToast('Welcome to the Monograph Journal.');
      form.reset();
    });
  });

  /* ---- Generic contact / booking forms ---- */
  document.querySelectorAll('form[data-confirm]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.showToast(form.dataset.confirm);
      form.reset();
    });
  });

  /* ---- Menu page: search + category filter ---- */
  const menuGrid = document.querySelector('[data-menu-grid]');
  if (menuGrid) {
    const items = Array.from(menuGrid.querySelectorAll('[data-menu-item]'));
    const searchInput = document.querySelector('[data-menu-search]');
    const chips = document.querySelectorAll('[data-menu-filter]');
    const countLabel = document.querySelector('[data-menu-count]');
    let activeFilter = 'all';

    function applyFilters() {
      const query = (searchInput?.value || '').trim().toLowerCase();
      let visible = 0;
      items.forEach(item => {
        const cats = (item.dataset.categories || '').toLowerCase();
        const text = item.textContent.toLowerCase();
        const matchesFilter = activeFilter === 'all' || cats.includes(activeFilter);
        const matchesQuery = !query || text.includes(query);
        const show = matchesFilter && matchesQuery;
        item.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (countLabel) countLabel.textContent = `Showing ${visible} artisan offering${visible === 1 ? '' : 's'}`;
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        activeFilter = chip.dataset.menuFilter;
        applyFilters();
      });
    });

    searchInput?.addEventListener('input', applyFilters);
    applyFilters();
  }

  /* ---- Elegant scroll reveal ----
     Any element with [data-reveal] fades/rises in once it enters the
     viewport. Any element with [data-reveal-group] has its direct
     children auto-tagged and staggered, so whole grids (cards, pillars,
     menu items) animate in one after another rather than all at once. */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-reveal-group]').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = prefersReducedMotion ? '0ms' : `${Math.min(i, 8) * 90}ms`;
    });
  });

  document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('reveal'));

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  /* ---- Smooth scroll for in-page anchor links (e.g. footer, "#top") ---- */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

});

/* ---------- Gathering detail modal ---------- */
const packageDetails = {
  breakfast: {
    eyebrow: 'Morning',
    title: 'Celebratory Breakfast',
    description: 'A relaxed morning spread with pastries, brunch plates, and a rotating filter-coffee bar.',
    duration: '2.5 hours',
    capacity: 'Up to 20 guests',
    price: '₱18,000',
    includes: [
      'Room styling & fresh florals',
      'Dedicated barista service',
      'Custom pastry & brunch plate selection',
      'Printed tasting menus'
    ],
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop'
    ]
  },
  retreat: {
    eyebrow: 'Most Booked',
    title: 'Corporate Retreat',
    description: 'Full-day salon access with a coffee cupping session, AV setup, and continuous beverage service.',
    duration: 'Full day',
    capacity: 'Up to 35 guests',
    price: '₱42,000',
    includes: [
      'Full-day room booking with AV setup',
      'Guided coffee cupping session',
      'Continuous coffee & tea service',
      'Dedicated event coordinator'
    ],
    images: [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?q=80&w=600&auto=format&fit=crop'
    ]
  },
  salon: {
    eyebrow: 'Evening',
    title: "Book Reading & Salon Night",
    description: 'An intimate evening setup with low lighting, a curated dessert pairing, and quiet acoustics.',
    duration: '3 hours',
    capacity: 'Up to 25 guests',
    price: '₱22,000',
    includes: [
      'Ambient evening lighting setup',
      'Curated dessert pairing menu',
      'Dedicated barista service',
      'Quiet acoustic arrangement'
    ],
    images: [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop'
    ]
  }
};

const modalOverlay = document.querySelector('[data-modal-overlay]');
if (modalOverlay) {
  const modalGallery = modalOverlay.querySelector('[data-modal-gallery]');
  const modalEyebrow = modalOverlay.querySelector('[data-modal-eyebrow]');
  const modalTitle = modalOverlay.querySelector('[data-modal-title]');
  const modalDescription = modalOverlay.querySelector('[data-modal-description]');
  const modalDuration = modalOverlay.querySelector('[data-modal-duration]');
  const modalCapacity = modalOverlay.querySelector('[data-modal-capacity]');
  const modalPrice = modalOverlay.querySelector('[data-modal-price]');
  const modalIncludes = modalOverlay.querySelector('[data-modal-includes]');
  const modalInquireBtn = modalOverlay.querySelector('[data-modal-inquire]');
  let lastFocused = null;

  function openPackageModal(key) {
    const pkg = packageDetails[key];
    if (!pkg) return;

    modalGallery.innerHTML = pkg.images.map(src => `<img src="${src}" alt="${pkg.title} setup">`).join('');
    modalEyebrow.textContent = pkg.eyebrow;
    modalTitle.textContent = pkg.title;
    modalDescription.textContent = pkg.description;
    modalDuration.textContent = pkg.duration;
    modalCapacity.textContent = pkg.capacity;
    modalPrice.textContent = pkg.price;
    modalIncludes.innerHTML = pkg.includes.map(item => `<li>· ${item}</li>`).join('');
    modalInquireBtn.onclick = () => {
      closePackageModal();
      const select = document.getElementById('ev-package');
      if (select) select.value = pkg.title;
    };

    lastFocused = document.activeElement;
    modalOverlay.hidden = false;
    requestAnimationFrame(() => modalOverlay.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
  }

  function closePackageModal() {
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { modalOverlay.hidden = true; }, 300);
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-view-package]').forEach(btn => {
    btn.addEventListener('click', () => openPackageModal(btn.dataset.viewPackage));
  });

  modalOverlay.querySelectorAll('[data-modal-close]').forEach(el =>
    el.addEventListener('click', closePackageModal)
  );

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closePackageModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) closePackageModal();
  });
}