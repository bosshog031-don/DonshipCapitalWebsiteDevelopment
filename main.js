// Donship Capital — Shared JS

(function () {

  // ---- Scroll Progress Bar ----
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.id = 'scroll-progress';
  document.body.appendChild(progressBar);

  const updateProgressBar = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressWidth = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = progressWidth + '%';
  };
  window.addEventListener('scroll', updateProgressBar, { passive: true });
  updateProgressBar();

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
        if (e.isIntersecting) {
          const el = e.target;
          el.classList.add('in');
          
          // Stagger children if any exist inside this animated section
          const children = el.querySelectorAll('.row-item, .pkg-card, .stat-item, .product-card, .book-step');
          if (children.length) {
            children.forEach((child, i) => {
              setTimeout(() => {
                child.classList.add('in');
              }, i * 90);
            });
          }
          
          io.unobserve(el);
        }
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

  // ---- Hero: Word Swapper ----
  const cycleWordEl = document.getElementById('hero-cycle-word');
  if (cycleWordEl) {
    const words = ['Fund', 'Build', 'Scale', 'Automate'];
    let index = 0;
    setInterval(() => {
      cycleWordEl.classList.add('exit');
      setTimeout(() => {
        index = (index + 1) % words.length;
        cycleWordEl.textContent = words[index];
        cycleWordEl.classList.remove('exit');
        cycleWordEl.classList.add('active');
      }, 400);
    }, 3000);
  }

  // ---- Hero: Interactive Canvas Background ----
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    let mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });
    
    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
    
    window.addEventListener('resize', () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initGrid();
    });

    let dots = [];
    const spacing = 45;
    
    function initGrid() {
      dots = [];
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          dots.push({ x, y, ox: x, oy: y });
        }
      }
    }
    
    initGrid();
    
    let active = true;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        active = entries[0].isIntersecting;
      }, { threshold: 0.01 });
      observer.observe(canvas);
    }
    
    function animate() {
      if (active) {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];
          const dx = mouse.x - d.x;
          const dy = mouse.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            const force = (120 - dist) / 120;
            const angle = Math.atan2(dy, dx);
            d.x = d.ox - Math.cos(angle) * force * 15;
            d.y = d.oy - Math.sin(angle) * force * 15;
            ctx.fillStyle = `rgba(29, 158, 117, ${0.2 + force * 0.45})`;
          } else {
            d.x += (d.ox - d.x) * 0.1;
            d.y += (d.oy - d.y) * 0.1;
            ctx.fillStyle = 'rgba(29, 158, 117, 0.2)';
          }
          
          ctx.beginPath();
          ctx.arc(d.x, d.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ---- Cursor Glow Spotlight ----
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
    }, { passive: true });
  }

  // ---- Button Press Ripple Effect ----
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      btn.appendChild(ripple);
      
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    }
  });

  // ---- Page Transition Overlay ----
  const transitionOverlay = document.createElement('div');
  transitionOverlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: var(--ink);
    z-index: 10000;
    transition: opacity 0.3s ease;
    pointer-events: none;
    opacity: 1;
  `;
  document.body.appendChild(transitionOverlay);

  // Fade in page on load
  const fadeInPage = () => {
    setTimeout(() => {
      transitionOverlay.style.opacity = '0';
    }, 40);
  };
  
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', fadeInPage);
  } else {
    fadeInPage();
  }

  // Intercept internal link clicks to fade out before loading
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (anchor && anchor.hostname === window.location.hostname && !anchor.hash) {
      const href = anchor.getAttribute('href');
      if (href && !href.startsWith('#') && anchor.target !== '_blank' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        transitionOverlay.style.opacity = '1';
        setTimeout(() => {
          window.location.href = href;
        }, 280);
      }
    }
  });

  // ---- 3D Card Tilt Effect ----
  const tiltCards = document.querySelectorAll('.product-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const rx = ((yc - y) / yc) * 8; // max 8 degrees tilt
      const ry = ((x - xc) / xc) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    }, { passive: true });
    
    card.style.transition = 'transform 0.15s ease-out, border-color var(--t), box-shadow var(--t)';
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

})();
