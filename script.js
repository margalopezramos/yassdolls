// ============================================================
// YASS.DOLLS — script.js
// General site behaviors shared across pages: nav scroll-spy,
// hamburger menu, commission form, shipping tooltip, artist
// select. Cart logic lives in js/cart-utils.js, catalog
// rendering in js/catalog.js, product page in js/product.js.
// ============================================================

// ── SCROLL: ACTIVE NAV LINK + FADE-IN ───────────────────────
window.addEventListener('scroll', () => {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navbar ul li a');
  let current = '';

  sections.forEach(sec => {
    if (pageYOffset >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });

  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) el.classList.add('visible');
  });
});

// ── DOM READY ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // ─ Hamburger menu ───────────────────────────────────────
  const menuToggle  = document.querySelector('.menu-toggle');
  const navLinksList = document.querySelector('.nav-links');

  if (menuToggle && navLinksList) {
    menuToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('open');
      const spans = menuToggle.querySelectorAll('span');
      menuToggle.classList.toggle('open');
      if (menuToggle.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    navLinksList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.querySelectorAll('span').forEach(s => {
          s.style.transform = ''; s.style.opacity = '';
        });
      });
    });
  }

  // ─ Fade-in on load (static, non-catalog elements) ───────
  document.querySelectorAll('.fade-in').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) el.classList.add('visible');
  });

  // ─ Commission form submit ────────────────────────────────
  const commForm = document.getElementById('commission-form');
  if (commForm) {
    commForm.addEventListener('submit', e => {
      e.preventDefault();
      const name  = document.getElementById('comm-name').value.trim();
      const email = document.getElementById('comm-email').value.trim();
      const desc  = document.getElementById('comm-description').value.trim();

      if (!name || !email || !desc) {
        showToast('Please fill in all fields 💖', 'error');
        return;
      }

      if (typeof emailjs !== 'undefined') {
        emailjs.send("service_4tj2erx", "template_fs1e76s", {
          order_id: 'COMM-' + Date.now(),
          user_name: name,
          user_email: email,
          user_address: '(Commission request)',
          user_country: '-',
          order_details: desc,
          total_price: 'TBD'
        }).then(() => {
          showToast('Proposal sent! I\'ll contact you soon 💌');
        }).catch(() => {
          showToast('Sent! ✨ (demo mode)');
        });
      } else {
        showToast('Proposal sent! I\'ll contact you soon 💌');
      }

      commForm.reset();
    });
  }

  // ─ Shipping price tooltip ───────────────────────────────
  const trigger = document.getElementById('priceListTrigger');
  const tooltip = document.getElementById('priceTooltip');

  if (trigger && tooltip) {
    trigger.addEventListener('mouseenter', () => tooltip.classList.add('visible'));
    trigger.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
  }

  // ─ Artist select scroll ─────────────────────────────────
  const select = document.getElementById('artistSelect');
  if (select) {
    select.addEventListener('change', e => {
      const section = document.querySelector(e.target.value);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  }

});
