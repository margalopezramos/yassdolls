// 1. CARGA INICIAL DEL CARRITO (Fuera para que sea accesible)
let cart = JSON.parse(localStorage.getItem('yassCart')) || [];

// 2. LÓGICA DE SCROLL Y NAVBAR
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.navbar ul li a');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 60) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// 3. EVENTOS AL CARGAR EL DOM
document.addEventListener('DOMContentLoaded', () => {
  
  // --- CONTADOR DEL CARRITO ---
  const cartCount = document.getElementById('cart-count');
  if (cartCount) cartCount.innerText = cart.length;

  // --- MENÚ HAMBURGUESA MÓVIL ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksList = document.querySelector('.nav-links');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('active');
    });
  }

  // --- LÓGICA DE AÑADIR AL CARRITO ---
  const addButtons = document.querySelectorAll('.add-to-cart-btn');
  
  addButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); 
      const card = button.closest('.doll-card');
      const name = card.getAttribute('data-name');
      const price = parseFloat(card.getAttribute('data-price'));

      addToCart(name, price);
    });
  });

  function addToCart(name, price) {
    cart.push({ name, price });
    // Guardamos en la memoria del navegador para que aparezca en cart.html
    localStorage.setItem('yassCart', JSON.stringify(cart));
    
    // Actualizamos el contador visual en la navbar
    if (cartCount) cartCount.innerText = cart.length;
    
    // Feedback opcional
    alert("Added to your Yass Cart! 💖");
  }

  // --- TOOLTIP DE PRECIOS DE ENVÍO ---
  const trigger = document.getElementById('priceListTrigger');
  const tooltip = document.getElementById('priceTooltip');

  if (trigger && tooltip) {
    function positionTooltip() {
      const rect = trigger.getBoundingClientRect();
      tooltip.style.top = (rect.bottom + window.scrollY + 8) + 'px';
      tooltip.style.left = (rect.left + window.scrollX + rect.width / 2) + 'px';
    }

    trigger.addEventListener('mouseenter', () => {
      tooltip.classList.add('visible');
      positionTooltip();
    });

    trigger.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  }

  // --- SELECT DE ARTISTAS ---
  const select = document.getElementById("artistSelect");
  if (select) {
    select.addEventListener("change", (e) => {
      const targetId = e.target.value;
      if (targetId) {
        const section = document.querySelector(targetId);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});

