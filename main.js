// Donship Capital — Shared JS

(function () {

  // ---- Nav: solid on scroll ----
  const nav = document.querySelector('.nav');
  if (nav) {
    const setNav = () => nav.classList.toggle('solid', window.scrollY > 40);
    window.addEventListener('scroll', setNav, { passive: true });
    setNav();
  }

  // ---- Mobile hamburger ----
  const burger  = document.querySelector('.nav-hamburger');
  const mobile  = document.querySelector('.nav-mobile');
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobile.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobile.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  // ---- Active nav link ----
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if ((path === '/' || path === '/index.html') && (href === '/' || href === '/index.html')) {
      a.classList.add('active');
    } else if (href !== '/' && path.includes(href.replace('.html', ''))) {
      a.classList.add('active');
    }
  });

  // ---- Scroll-reveal animations ----
  const animEls = document.querySelectorAll('[data-anim]');
  if (animEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animEls.forEach(el => io.observe(el));
  }

  // ---- Counter animation ----
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const isFloat = el.dataset.count.includes('.');
    const suffix  = el.dataset.suffix || '';
    const prefix  = el.dataset.prefix || '';
    const duration = 1400;
    const start = performance.now();
    const update = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3); // cubic ease-out
      const val = target * ease;
      el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => co.observe(el));
  }

  // ---- Accordion rows ----
  document.querySelectorAll('.row-item.expandable').forEach(row => {
    row.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');
      // close others in same list
      const parent = row.closest('.row-list');
      if (parent) {
        parent.querySelectorAll('.row-item.open').forEach(r => r.classList.remove('open'));
      }
      if (!isOpen) row.classList.add('open');
    });
  });

  // ---- Marquee: duplicate content for seamless loop ----
  document.querySelectorAll('.marquee-track').forEach(track => {
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);
    clone.setAttribute('aria-hidden', 'true');
  });

  // ---- Add-ons cart ----
  (function initCart() {
    const rows = document.querySelectorAll('.rate-row.selectable');
    if (!rows.length) return;

    const cartEl    = document.getElementById('addons-cart');
    if (!cartEl) return;

    const pillEl    = cartEl.querySelector('.cart-pill');
    const labelEl   = cartEl.querySelector('.cart-label-text');
    const onetimeEl = cartEl.querySelector('.cart-onetime');
    const moEl      = cartEl.querySelector('.cart-monthly-label');
    const clearBtn  = cartEl.querySelector('.cart-clear-btn');
    const toggleBtn = cartEl.querySelector('.cart-toggle-btn');
    const panel     = cartEl.querySelector('.cart-items-panel');
    const listEl    = cartEl.querySelector('.cart-items-list');
    const bookBtn   = cartEl.querySelector('.cart-book-btn');

    const selected = new Map();

    function fmt(n) { return '$' + n.toLocaleString(); }

    function render() {
      const count = selected.size;
      cartEl.classList.toggle('visible', count > 0);
      if (!count) return;

      pillEl.textContent = count;
      labelEl.textContent = count === 1 ? 'add-on selected' : 'add-ons selected';

      let setup = 0, monthly = 0;
      selected.forEach(v => { setup += v.setup; monthly += v.monthly; });

      onetimeEl.textContent = fmt(setup || 0);
      moEl.textContent = monthly > 0 ? '+ ' + fmt(monthly) + '/mo' : '';

      if (listEl) {
        listEl.innerHTML = Array.from(selected.values()).map(v => {
          const parts = [];
          if (v.setup > 0)   parts.push(fmt(v.setup));
          if (v.monthly > 0) parts.push(fmt(v.monthly) + '/mo');
          return `<div class="cart-item-row">
            <span class="cart-item-name">${v.label}</span>
            <span class="cart-item-price">${parts.join(' + ')}</span>
          </div>`;
        }).join('');
      }

      if (bookBtn) {
        const names = encodeURIComponent(Array.from(selected.keys()).join(', '));
        bookBtn.href = '/book.html?addons=' + names;
      }
    }

    rows.forEach(row => {
      row.setAttribute('role', 'checkbox');
      row.setAttribute('aria-checked', 'false');
      row.tabIndex = 0;

      function toggle() {
        const name = row.dataset.name;
        if (selected.has(name)) {
          selected.delete(name);
          row.classList.remove('selected');
          row.setAttribute('aria-checked', 'false');
        } else {
          selected.set(name, {
            label:   row.dataset.name,
            setup:   parseInt(row.dataset.setup   || 0, 10),
            monthly: parseInt(row.dataset.monthly || 0, 10),
          });
          row.classList.add('selected');
          row.setAttribute('aria-checked', 'true');
        }
        render();
      }

      row.addEventListener('click', toggle);
      row.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        selected.clear();
        rows.forEach(r => { r.classList.remove('selected'); r.setAttribute('aria-checked', 'false'); });
        if (panel) panel.classList.remove('open');
        render();
      });
    }

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', () => {
        const open = panel.classList.toggle('open');
        toggleBtn.textContent = open ? 'Hide summary' : 'View summary';
      });
    }
  })();

})();
