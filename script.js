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

// Menú hamburguesa móvil
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
  // Tooltip del trigger
  const trigger = document.getElementById('priceListTrigger');
  const tooltip = document.getElementById('priceTooltip');

  if (trigger && tooltip) {
    function positionTooltip() {
      const rect = trigger.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      tooltip.style.top = (rect.bottom + scrollTop + 8) + 'px';
      tooltip.style.left = (rect.left + scrollLeft + rect.width / 2) + 'px';
    }

    // Hover
    trigger.addEventListener('mouseenter', () => {
      tooltip.classList.add('visible');
      tooltip.setAttribute('aria-hidden', 'false');
      positionTooltip();
    });

    trigger.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
      tooltip.setAttribute('aria-hidden', 'true');
    });

    // Click
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      tooltip.classList.toggle('visible');
      tooltip.setAttribute('aria-hidden', tooltip.classList.contains('visible') ? 'false' : 'true');
      positionTooltip();
    });

    // Cerrar si clicas fuera
    document.addEventListener('click', (e) => {
      if (!trigger.contains(e.target) && !tooltip.contains(e.target)) {
        tooltip.classList.remove('visible');
        tooltip.setAttribute('aria-hidden', 'true');
      }
    });

    // Recalcula posición
    window.addEventListener('scroll', () => {
      if (tooltip.classList.contains('visible')) positionTooltip();
    });
    window.addEventListener('resize', () => {
      if (tooltip.classList.contains('visible')) positionTooltip();
    });
  }


});

document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("artistSelect");

    select.addEventListener("change", (e) => {
      const targetId = e.target.value;
      if (targetId) {
        const section = document.querySelector(targetId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });