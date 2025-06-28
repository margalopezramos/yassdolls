// Highlight menu item on scroll
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

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('priceListTrigger');
  const tooltip = document.getElementById('priceTooltip');

  // Función para posicionar tooltip respecto al trigger
  function positionTooltip() {
    const rect = trigger.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    tooltip.style.top = (rect.bottom + scrollTop + 8) + 'px'; // 8px margen
    tooltip.style.left = (rect.left + scrollLeft + rect.width / 2) + 'px';
  }

  // Mostrar tooltip (hover)
  trigger.addEventListener('mouseenter', () => {
    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');
    positionTooltip();
  });

  // Ocultar tooltip (hover)
  trigger.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible');
    tooltip.setAttribute('aria-hidden', 'true');
  });

  // Toggle tooltip con click para móviles
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    if (tooltip.classList.contains('visible')) {
      tooltip.classList.remove('visible');
      tooltip.setAttribute('aria-hidden', 'true');
    } else {
      tooltip.classList.add('visible');
      tooltip.setAttribute('aria-hidden', 'false');
      positionTooltip();
    }
  });

  // Opcional: ocultar tooltip si clicas fuera
  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target) && !tooltip.contains(e.target)) {
      tooltip.classList.remove('visible');
      tooltip.setAttribute('aria-hidden', 'true');
    }
  });

  // Recalcula posición en resize o scroll
  window.addEventListener('scroll', () => {
    if (tooltip.classList.contains('visible')) {
      positionTooltip();
    }
  });

  window.addEventListener('resize', () => {
    if (tooltip.classList.contains('visible')) {
      positionTooltip();
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('priceListTrigger');

  // Toggle tooltip on click (para móviles)
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    trigger.classList.toggle('active');
  });

  // Opcional: ocultar tooltip si clicas fuera
  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target)) {
      trigger.classList.remove('active');
    }
  });
});
