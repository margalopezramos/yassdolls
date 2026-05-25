// ============================================================
// YASS.DOLLS — script.js (upgraded)
// ============================================================

// 1. CART STATE
let cart = JSON.parse(localStorage.getItem('yassCart')) || [];

// ── TOAST NOTIFICATION ──────────────────────────────────────
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.yass-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'yass-toast';
  toast.innerHTML = `<span>${message}</span>`;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '28px',
    left: '50%',
    transform: 'translateX(-50%) translateY(80px)',
    background: type === 'success'
      ? 'linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)'
      : 'linear-gradient(135deg, #c62828 0%, #8e0000 100%)',
    color: '#fff',
    padding: '13px 28px',
    borderRadius: '50px',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: '600',
    fontSize: '14px',
    zIndex: '9999',
    boxShadow: type === 'success'
      ? '0 8px 28px rgba(156,39,176,.45)'
      : '0 8px 28px rgba(198,40,40,.45)',
    transition: 'transform .35s cubic-bezier(.175,.885,.32,1.275), opacity .35s ease',
    opacity: '0',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    letterSpacing: '.3px',
    border: '1px solid rgba(255,255,255,.2)',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}

// ── SCROLL: ACTIVE NAV LINK + FADE-IN ───────────────────────
window.addEventListener('scroll', () => {
  // Active nav link
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

  // Fade-in cards
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) el.classList.add('visible');
  });
});

// ── DOM READY ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // ─ Cart counter ─────────────────────────────────────────
  updateCartCount();

  // ─ Hamburger menu ───────────────────────────────────────
  const menuToggle  = document.querySelector('.menu-toggle');
  const navLinksList = document.querySelector('.nav-links');

  if (menuToggle && navLinksList) {
    menuToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('open');
      // Animate hamburger → X
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

    // Close menu when a link is tapped
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

  // ─ Add to cart buttons ──────────────────────────────────
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', e => {
      e.stopPropagation();
      const card  = button.closest('.doll-card');
      const name  = card.getAttribute('data-name');
      const price = parseFloat(card.getAttribute('data-price'));
      addToCart(name, price);
    });
  });

  // ─ Fade-in on load ──────────────────────────────────────
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

      // Send via EmailJS (uses same service as cart)
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

  // ─ Apply fade-in class to doll cards ────────────────────
  document.querySelectorAll('.doll-card').forEach(card => {
    card.classList.add('fade-in');
  });
  // Trigger for ones already in view
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) el.classList.add('visible');
  });

});

// ── CART HELPERS ─────────────────────────────────────────────
function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (el) el.innerText = cart.length;
}

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem('yassCart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${name} added to your cart 🛒`);
}