const productsContainer = document.querySelector('[data-products-container]');
const searchInput = document.querySelector('#catalog-search');
const categoryCheckboxes = Array.from(document.querySelectorAll('input[name="category"]'));
const priceFromInput = document.querySelector('#price-from');
const priceToInput = document.querySelector('#price-to');
const sortSelect = document.querySelector('#sort-select');
const filtersForm = document.querySelector('#filters-form');
const catalogCount = document.querySelector('[data-catalog-count]');
const catalogEmpty = document.querySelector('[data-catalog-empty]');
const resetFiltersBtn = document.querySelector('[data-reset-filters]');

const catalogState = {
  query: '',
  categories: [],
  priceFrom: 0,
  priceTo: Infinity,
  sort: 'default'
};

function calculateFinalPrice(price, discountPercent) {
  const discount = Number.isFinite(discountPercent) && discountPercent > 0 ? discountPercent : 0;
  return Math.round(price * (1 - discount / 100));
}

function formatPrice(price) {
  return `${Number(price).toLocaleString('ru-RU')} руб.`;
}

function searchProducts(items, query) {
  const normalized = String(query).trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((item) => item.title.toLowerCase().includes(normalized));
}

function filterProductsByCategories(items, categories) {
  if (!categories || categories.length === 0) return items;
  return items.filter((item) => categories.includes(item.category));
}

function filterProductsByPrice(items, minPrice, maxPrice) {
  const min = Number.isFinite(minPrice) && minPrice > 0 ? minPrice : 0;
  const max = Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : Infinity;
  return items.filter((item) => {
    const finalPrice = calculateFinalPrice(item.price, item.discountPercent);
    return finalPrice >= min && finalPrice <= max;
  });
}

function sortProducts(items, sortType) {
  const copy = [...items];
  if (sortType === 'price-asc') {
    return copy.sort(
      (a, b) => calculateFinalPrice(a.price, a.discountPercent) - calculateFinalPrice(b.price, b.discountPercent)
    );
  }
  if (sortType === 'price-desc') {
    return copy.sort(
      (a, b) => calculateFinalPrice(b.price, b.discountPercent) - calculateFinalPrice(a.price, a.discountPercent)
    );
  }
  if (sortType === 'title-asc') {
    return copy.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
  }
  if (sortType === 'rating-desc') {
    return copy.sort((a, b) => b.rating - a.rating);
  }
  return copy;
}

function getPreparedProducts(items, state) {
  let result = [...items];
  result = searchProducts(result, state.query);
  result = filterProductsByCategories(result, state.categories);
  result = filterProductsByPrice(result, state.priceFrom, state.priceTo);
  result = sortProducts(result, state.sort);
  return result;
}

function createProductCard(product, isFavorite) {
  const card = document.createElement('article');
  card.classList.add('product-card');
  card.dataset.category = product.category;
  card.dataset.price = String(product.price);

  if (product.badge && product.badgeText) {
    const badge = document.createElement('span');
    badge.classList.add('product-card__badge');
    if (product.badge === 'hit') badge.classList.add('product-card__badge--hit');
    if (product.badge === 'sale') badge.classList.add('product-card__badge--sale');
    badge.textContent = product.badgeText;
    card.append(badge);
  }

  const image = document.createElement('img');
  image.classList.add('product-card__image');
  image.src = product.image;
  image.alt = product.title;
  image.width = 640;
  image.height = 480;
  image.loading = 'lazy';
  image.addEventListener('error', () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="#e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#475569" font-family="sans-serif" font-size="22">${product.title}</text></svg>`;
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, { once: true });

  const meta = document.createElement('div');
  meta.classList.add('product-card__meta');

  const statusSpan = document.createElement('span');
  statusSpan.classList.add('product-card__status');
  if (product.isAvailable) {
    statusSpan.classList.add('product-card__status--available');
    statusSpan.textContent = 'В наличии';
  } else {
    statusSpan.classList.add('product-card__status--unavailable');
    statusSpan.textContent = 'Нет в наличии';
  }

  const ratingSpan = document.createElement('span');
  ratingSpan.classList.add('product-card__rating');
  ratingSpan.textContent = `★ ${product.rating.toFixed(1)}`;

  meta.append(statusSpan, ratingSpan);

  const titleLink = document.createElement('a');
  titleLink.href = `product.html?id=${encodeURIComponent(String(product.id))}`;

  const title = document.createElement('h3');
  title.classList.add('product-card__title');
  title.textContent = product.title;
  titleLink.append(title);

  const description = document.createElement('p');
  description.classList.add('product-card__description');
  description.textContent = product.description;

  const finalPrice = calculateFinalPrice(product.price, product.discountPercent);
  const priceWrap = document.createElement('div');
  priceWrap.classList.add('product-card__price-wrap');

  const priceEl = document.createElement('p');
  priceEl.classList.add('product-card__price');
  priceEl.textContent = formatPrice(finalPrice);
  priceWrap.append(priceEl);

  if (product.discountPercent > 0) {
    const oldPriceEl = document.createElement('span');
    oldPriceEl.classList.add('product-card__old-price');
    oldPriceEl.textContent = formatPrice(product.price);
    priceWrap.append(oldPriceEl);
  }

  const actions = document.createElement('div');
  actions.classList.add('product-card__actions');

  const quickViewBtn = document.createElement('button');
  quickViewBtn.type = 'button';
  quickViewBtn.classList.add('button', 'button--secondary', 'quick-view');
  quickViewBtn.dataset.action = 'quick-view';
  quickViewBtn.dataset.productId = String(product.id);
  quickViewBtn.textContent = 'Быстрый просмотр';

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.classList.add('button', 'button--primary');
  addBtn.dataset.action = 'add-to-cart';
  addBtn.dataset.productId = String(product.id);
  addBtn.disabled = !product.isAvailable;
  addBtn.textContent = product.isAvailable ? 'В корзину' : 'Недоступно';

  const favBtn = document.createElement('button');
  favBtn.type = 'button';
  favBtn.classList.add('favorite-btn');
  if (isFavorite) favBtn.classList.add('is-favorite');
  favBtn.dataset.action = 'toggle-favorite';
  favBtn.dataset.productId = String(product.id);
  favBtn.setAttribute('aria-pressed', String(Boolean(isFavorite)));
  favBtn.setAttribute('aria-label', isFavorite ? 'Убрать из избранного' : 'Добавить в избранное');
  favBtn.textContent = isFavorite ? '♥' : '♡';

  actions.append(quickViewBtn, addBtn, favBtn);
  card.append(image, meta, titleLink, description, priceWrap, actions);
  return card;
}

function renderCatalog(items) {
  if (!productsContainer) return;

  const favoriteIds = typeof loadFavorites === 'function' ? loadFavorites() : [];
  productsContainer.replaceChildren();

  if (catalogCount) {
    catalogCount.textContent = `Найдено товаров: ${items.length}`;
  }

  if (catalogEmpty) {
    catalogEmpty.hidden = items.length > 0;
  }

  items.forEach((product) => {
    const card = createProductCard(product, favoriteIds.includes(product.id));
    productsContainer.append(card);
  });
}

function syncFiltersFromDom() {
  catalogState.categories = categoryCheckboxes
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  const rawFrom = priceFromInput ? priceFromInput.value.trim() : '';
  const rawTo = priceToInput ? priceToInput.value.trim() : '';

  catalogState.priceFrom = rawFrom !== '' && Number.isFinite(Number(rawFrom)) ? Number(rawFrom) : 0;
  catalogState.priceTo = rawTo !== '' && Number.isFinite(Number(rawTo)) && Number(rawTo) > 0
    ? Number(rawTo)
    : Infinity;
}

function updateCatalog() {
  const prepared = getPreparedProducts(products, catalogState);
  renderCatalog(prepared);
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    catalogState.query = event.target.value;
    updateCatalog();
  });
}

categoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    syncFiltersFromDom();
    updateCatalog();
  });
});

if (sortSelect) {
  sortSelect.addEventListener('change', (event) => {
    catalogState.sort = event.target.value;
    updateCatalog();
  });
}

if (filtersForm) {
  filtersForm.addEventListener('submit', (event) => {
    event.preventDefault();
    syncFiltersFromDom();
    updateCatalog();
  });
}

if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener('click', () => {
    catalogState.query = '';
    catalogState.categories = [];
    catalogState.priceFrom = 0;
    catalogState.priceTo = Infinity;
    catalogState.sort = 'default';

    if (searchInput) searchInput.value = '';
    categoryCheckboxes.forEach((cb) => {
      cb.checked = false;
    });
    if (priceFromInput) priceFromInput.value = '';
    if (priceToInput) priceToInput.value = '';
    if (sortSelect) sortSelect.value = 'default';

    updateCatalog();
  });
}

if (productsContainer) {
  productsContainer.addEventListener('click', (event) => {
    const actionBtn = event.target.closest('[data-action]');
    if (!actionBtn || !productsContainer.contains(actionBtn)) return;

    const productId = Number(actionBtn.dataset.productId);
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const action = actionBtn.dataset.action;

    if (action === 'add-to-cart' && product.isAvailable) {
      if (typeof addToCart === 'function') {
        addToCart(productId);
      }
    }

    if (action === 'toggle-favorite') {
      if (typeof toggleFavorite === 'function') {
        toggleFavorite(productId);
        updateCatalog();
      }
    }

    if (action === 'quick-view') {
      const modal = document.getElementById('quick-view-modal');
      const modalTitle = document.getElementById('modal-title');
      const modalDesc = document.getElementById('modal-desc');
      if (modal && modalTitle && modalDesc) {
        modalTitle.textContent = product.title;
        modalDesc.textContent = `${product.description} Цена: ${formatPrice(calculateFinalPrice(product.price, product.discountPercent))}.`;
        modal.showModal();
      }
    }
  });

  updateCatalog();
}