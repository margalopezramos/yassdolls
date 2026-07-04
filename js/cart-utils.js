// ============================================================
// YASS.DOLLS — cart-utils.js
// Shared cart logic + toast notifications, used on every page.
// Cart items now carry {id, name, price, image, artist} so the
// cart page can show a thumbnail and link back to the product.
// ============================================================

let cart = JSON.parse(localStorage.getItem('yassCart')) || [];

// ── TOAST NOTIFICATION ──────────────────────────────────────
function showToast(message, type = 'success') {
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

// ── CART HELPERS ─────────────────────────────────────────────
function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (el) el.innerText = cart.length;
}

function addToCart(doll) {
  // doll: { id, name, price, image, artist }
  cart.push({
    id: doll.id,
    name: doll.name,
    price: doll.price,
    image: doll.image || doll.main_image || '',
    artist: doll.artist || ''
  });
  localStorage.setItem('yassCart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${doll.name} added to your cart 🛒`);
}

function removeFromCart(index) {
  const removed = cart[index];
  cart.splice(index, 1);
  localStorage.setItem('yassCart', JSON.stringify(cart));
  updateCartCount();
  return removed;
}

document.addEventListener('DOMContentLoaded', updateCartCount);
