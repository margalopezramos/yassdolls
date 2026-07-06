// ============================================================
// YASS.DOLLS — product.js
// Loads a single doll (via ?id=) from Supabase and renders the
// full product page: gallery, video, description, reviews and
// related dolls.
// ============================================================

const ARTIST_ANCHORS = {
  'Ariana Grande': 'ariana',
  'Olivia Rodrigo': 'olivia',
  'Sabrina Carpenter': 'sabrina',
  'Taylor Swift': 'taylor'
};

function escapeHtmlP(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function starString(rating) {
  const rounded = Math.round(rating);
  return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
}

function relatedCardHTML(doll) {
  return `
    <div class="doll-card fade-in visible" data-id="${doll.id}">
      <a href="product.html?id=${encodeURIComponent(doll.id)}" class="doll-card-image-link">
        <div class="doll-card-image">
          <img src="${doll.main_image}" alt="${escapeHtmlP(doll.name)}" loading="lazy">
        </div>
      </a>
      <div class="doll-info">
        <a href="product.html?id=${encodeURIComponent(doll.id)}" class="doll-info-name-link">
          <span class="doll-info-name">${escapeHtmlP(doll.name)}</span>
        </a>
        <span class="doll-info-price">${doll.price}€</span>
      </div>
    </div>`;
}

function reviewHTML(review) {
  return `
    <div class="review-item">
      <div class="review-head">
        <span class="review-author">${escapeHtmlP(review.author)}</span>
        <span class="review-stars">${starString(review.rating)}</span>
      </div>
      <p class="review-comment">${escapeHtmlP(review.comment)}</p>
    </div>`;
}

function buildVideoSlideContent(container, videoUrl) {
  if (videoUrl.includes('instagram.com')) {
    container.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${videoUrl}" data-instgrm-version="14" style="margin:0; width:100%; max-width:400px;"></blockquote>`;
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  } else if (videoUrl.includes('tiktok.com')) {
    container.innerHTML = `<blockquote class="tiktok-embed" cite="${videoUrl}" style="max-width:325px;"><section></section></blockquote>`;
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  } else {
    container.innerHTML = `<a href="${videoUrl}" target="_blank" class="btn-pay" style="display:inline-block;">Watch the video ↗</a>`;
  }
}

function setupGallery(doll) {
  const images = [doll.main_image, ...(doll.gallery_images || [])].filter(Boolean);
  const track = document.getElementById('gallery-track');
  const dotsWrap = document.getElementById('gallery-dots');
  const carousel = document.getElementById('gallery-carousel');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');

  const slideDefs = images.map(src => ({ type: 'image', src }));
  if (doll.video_url) slideDefs.push({ type: 'video', src: doll.video_url });

  track.innerHTML = slideDefs.map((slide, i) => {
    if (slide.type === 'image') {
      return `<div class="gallery-slide"><img src="${slide.src}" alt="${escapeHtmlP(doll.name)} photo ${i + 1}"></div>`;
    }
    return `<div class="gallery-slide video-slide" id="video-slide-${i}"></div>`;
  }).join('');

  slideDefs.forEach((slide, i) => {
    if (slide.type === 'video') {
      buildVideoSlideContent(document.getElementById(`video-slide-${i}`), slide.src);
    }
  });

  const total = slideDefs.length;
  let current = 0;

  if (total <= 1) {
    carousel.classList.add('single-slide');
    dotsWrap.classList.add('hidden');
  } else {
    dotsWrap.innerHTML = slideDefs.map((_, i) => `<button class="gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}" type="button" aria-label="Go to slide ${i + 1}"></button>`).join('');
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dotsWrap.querySelectorAll('.gallery-dot').forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.getAttribute('data-index'), 10)));
  });

  // Swipe support
  let startX = 0, deltaX = 0, dragging = false;
  track.addEventListener('touchstart', e => { dragging = true; startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchmove', e => { if (dragging) deltaX = e.touches[0].clientX - startX; }, { passive: true });
  track.addEventListener('touchend', () => {
    if (dragging && Math.abs(deltaX) > 50) goTo(deltaX < 0 ? current + 1 : current - 1);
    dragging = false; deltaX = 0;
  });

  // Keyboard arrows when the carousel is focused/hovered
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
  });

  // Click an image slide → lightbox
  track.querySelectorAll('.gallery-slide img').forEach(img => {
    img.addEventListener('click', () => {
      const modal = document.getElementById('imageModal');
      const modalImg = document.getElementById('imageModalImg');
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
}

function initLightboxClose() {
  const modal = document.getElementById('imageModal');
  const closeBtn = document.querySelector('.image-modal-close');
  const close = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

async function loadAndRenderReviews(dollId) {
  const reviews = await fetchReviews(dollId);
  const reviewsListEl = document.getElementById('product-reviews-list');
  const ratingBox = document.getElementById('product-rating');

  if (reviews.length) {
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    ratingBox.style.display = 'flex';
    document.getElementById('product-stars').textContent = starString(avg);
    document.getElementById('product-rating-count').textContent = `${avg.toFixed(1)} · ${reviews.length} review${reviews.length === 1 ? '' : 's'}`;
    reviewsListEl.innerHTML = reviews.map(reviewHTML).join('');
  } else {
    ratingBox.style.display = 'none';
    reviewsListEl.innerHTML = `<p class="catalog-empty">No reviews yet — be the first to order this one ✦</p>`;
  }
}

function initStarPicker() {
  const picker = document.getElementById('star-picker');
  if (!picker) return;
  const stars = picker.querySelectorAll('span');

  function paint(rating) {
    stars.forEach(s => s.classList.toggle('filled', parseInt(s.dataset.value, 10) <= rating));
  }
  paint(5); // default 5 stars

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.value, 10);
      picker.dataset.rating = val;
      paint(val);
    });
  });
}

function initReviewForm(dollId) {
  const form = document.getElementById('review-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const author = document.getElementById('review-author').value.trim();
    const comment = document.getElementById('review-comment').value.trim();
    const code = document.getElementById('review-code').value.trim();
    const rating = parseInt(document.getElementById('star-picker').dataset.rating, 10) || 5;

    if (!author || !comment || !code) {
      showToast('Please fill in your name, review and code 💖', 'error');
      return;
    }

    const submitBtn = form.querySelector('.review-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const result = await submitReviewWithCode(dollId, author, rating, comment, code);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit review';

    if (!result || !result.success) {
      const message = result && result.error === 'invalid_code'
        ? 'That review code is invalid or already used ✦'
        : 'Something went wrong, please try again';
      showToast(message, 'error');
      return;
    }

    showToast('Thank you for your review! 💕');
    form.reset();
    document.getElementById('star-picker').dataset.rating = 5;
    initStarPicker();
    loadAndRenderReviews(dollId);
  });
}

async function renderProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const loadingEl = document.getElementById('product-loading');
  const notFoundEl = document.getElementById('product-not-found');
  const contentEl = document.getElementById('product-content');

  if (!id) {
    loadingEl.style.display = 'none';
    notFoundEl.style.display = 'block';
    return;
  }

  const doll = await fetchDollById(id);

  if (!doll) {
    loadingEl.style.display = 'none';
    notFoundEl.style.display = 'block';
    return;
  }

  document.title = `${doll.name} — Yass.Dolls`;

  // Breadcrumb
  const anchor = ARTIST_ANCHORS[doll.artist] || 'others';
  document.getElementById('crumb-artist').textContent = doll.artist;
  document.getElementById('crumb-artist').href = `index.html#${anchor}`;
  document.getElementById('crumb-current').textContent = doll.name;

  // Gallery (photos + video as slides in one sliding carousel)
  setupGallery(doll);
  initLightboxClose();

  // Buy box
  document.getElementById('product-artist').textContent = doll.artist;
  document.getElementById('product-title').textContent = doll.name;
  document.getElementById('product-price').textContent = `${doll.price}€`;
  document.getElementById('product-size').textContent = doll.size || '—';
  document.getElementById('product-materials').textContent = doll.materials || '—';
  document.getElementById('product-description').textContent = doll.description || '';

  document.getElementById('product-add-btn').addEventListener('click', () => {
    addToCart(doll);
  });

  // Reviews
  await loadAndRenderReviews(doll.id);
  initStarPicker();
  initReviewForm(doll.id);

  // Related dolls
  const related = await fetchRelatedDolls(doll.artist, doll.id, 4);
  if (related.length) {
    document.getElementById('related-label').textContent = `More ${doll.artist} dolls`;
    document.getElementById('related-grid').innerHTML = related.map(relatedCardHTML).join('');
    document.getElementById('product-related-section').style.display = 'block';
  }

  loadingEl.style.display = 'none';
  contentEl.style.display = 'grid';
}

document.addEventListener('DOMContentLoaded', renderProductPage);
