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

  /* ---- Simple reveal-on-load for hero (single orchestrated moment) ---- */
  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    requestAnimationFrame(() => {
      el.style.transition = `opacity .5s ease ${i * 80}ms, transform .5s ease ${i * 80}ms`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });

});
