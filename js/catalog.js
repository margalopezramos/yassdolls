// ============================================================
// YASS.DOLLS — catalog.js
// Fetches all dolls from Supabase and renders them into the
// artist sections on index.html.
// ============================================================

function dollCardHTML(doll) {
  return `
    <div class="doll-card fade-in" data-id="${doll.id}" data-name="${escapeHtml(doll.name)}" data-price="${doll.price}">
      <a href="product.html?id=${encodeURIComponent(doll.id)}" class="doll-card-image-link">
        <div class="doll-card-image">
          <img src="${doll.main_image}" alt="${escapeHtml(doll.name)}" loading="lazy">
          <div class="doll-overlay">
            <button class="add-to-cart-btn" type="button">Add to Cart</button>
          </div>
        </div>
      </a>
      <div class="doll-info">
        <a href="product.html?id=${encodeURIComponent(doll.id)}" class="doll-info-name-link">
          <span class="doll-info-name">${escapeHtml(doll.name)}</span>
        </a>
        <span class="doll-info-price">${doll.price}€</span>
      </div>
    </div>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const SECTION_GRID_IDS = {
  'Ariana Grande': 'grid-ariana',
  'Olivia Rodrigo': 'grid-olivia',
  'Sabrina Carpenter': 'grid-sabrina',
  'Taylor Swift': 'grid-taylor',
  'Others': 'grid-others'
};
const SECTION_COUNT_IDS = {
  'Ariana Grande': 'count-ariana',
  'Olivia Rodrigo': 'count-olivia',
  'Sabrina Carpenter': 'count-sabrina',
  'Taylor Swift': 'count-taylor',
  'Others': 'count-others'
};

async function renderCatalog() {
  const dolls = await fetchAllDolls();

  if (!dolls.length) {
    Object.values(SECTION_GRID_IDS).forEach(gridId => {
      const grid = document.getElementById(gridId);
      if (grid) {
        grid.innerHTML = `<p class="catalog-empty">Couldn't load the dolls right now — please refresh in a moment ✦</p>`;
      }
    });
    return;
  }

  const groups = groupDollsByArtist(dolls);

  Object.entries(groups).forEach(([artist, dollList]) => {
    const gridId = SECTION_GRID_IDS[artist];
    const countId = SECTION_COUNT_IDS[artist];
    const grid = document.getElementById(gridId);
    const countEl = document.getElementById(countId);

    if (countEl) countEl.textContent = `${dollList.length} doll${dollList.length === 1 ? '' : 's'}`;
    if (!grid) return;

    if (!dollList.length) {
      grid.innerHTML = `<p class="catalog-empty">No dolls here yet ✦</p>`;
      return;
    }

    grid.innerHTML = dollList.map(dollCardHTML).join('');
  });

  attachCatalogInteractions();
}

function attachCatalogInteractions() {
  // Quick "Add to Cart" — stays on the page, doesn't follow the card's link
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const card = button.closest('.doll-card');
      addToCart({
        id: card.getAttribute('data-id'),
        name: card.getAttribute('data-name'),
        price: parseFloat(card.getAttribute('data-price')),
        image: card.querySelector('img')?.getAttribute('src') || ''
      });
    });
  });

  // Fade-in for newly rendered cards
  document.querySelectorAll('.doll-card.fade-in:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) el.classList.add('visible');
  });
}

document.addEventListener('DOMContentLoaded', renderCatalog);
