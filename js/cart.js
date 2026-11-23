const cartTbody = document.querySelector('[data-cart-items]');
const cartEmpty = document.querySelector('[data-cart-empty]');
const cartContent = document.querySelector('[data-cart-content]');
const subtotalEl = document.querySelector('[data-cart-subtotal]');
const discountEl = document.querySelector('[data-cart-discount]');
const totalEl = document.querySelector('[data-cart-total]');
const promoForm = document.querySelector('[data-promo-form]');
const promoInput = document.querySelector('#promo-code');
const promoMessage = document.querySelector('[data-promo-message]');
const clearCartBtn = document.querySelector('[data-clear-cart]');

let appliedPromoPercent = 0;

function updateCounters() {
  const cart = typeof loadCart === 'function' ? loadCart() : [];
  const favorites = typeof loadFavorites === 'function' ? loadFavorites() : [];

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = String(totalQty);
  });

  document.querySelectorAll('[data-fav-count]').forEach((el) => {
    el.textContent = String(favorites.length);
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product || !product.isAvailable) return;

  const cart = loadCart();
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }

  saveCart(cart);
  updateCounters();
  renderCart();
}

function updateItemQuantity(productId, delta) {
  const cart = loadCart();
  const target = cart.find((item) => item.productId === productId);
  if (!target) return;

  target.quantity += delta;
  const nextCart = target.quantity <= 0
    ? cart.filter((item) => item.productId !== productId)
    : cart;

  saveCart(nextCart);
  updateCounters();
  renderCart();
}

function removeCartItem(productId) {
  const nextCart = loadCart().filter((item) => item.productId !== productId);
  saveCart(nextCart);
  updateCounters();
  renderCart();
}

function toggleFavorite(productId) {
  const favorites = loadFavorites();
  const exists = favorites.includes(productId);
  const nextFavorites = exists
    ? favorites.filter((id) => id !== productId)
    : [...favorites, productId];

  saveFavorites(nextFavorites);
  updateCounters();
}

function calculateSubtotal(cartItems) {
  return cartItems.reduce((sum, entry) => {
    const product = products.find((p) => p.id === entry.productId);
    if (!product) return sum;
    const unitPrice = typeof calculateFinalPrice === 'function'
      ? calculateFinalPrice(product.price, product.discountPercent)
      : product.price;
    return sum + unitPrice * entry.quantity;
  }, 0);
}

function renderCart() {
  const cart = loadCart();
  const hasItems = cart.length > 0;

  if (cartEmpty) cartEmpty.hidden = hasItems;
  if (cartContent) cartContent.hidden = !hasItems;

  if (!cartTbody) return;

  cartTbody.replaceChildren();

  cart.forEach((entry) => {
    const product = products.find((p) => p.id === entry.productId);
    if (!product) return;

    const unitPrice = typeof calculateFinalPrice === 'function'
      ? calculateFinalPrice(product.price, product.discountPercent)
      : product.price;
    const lineSum = unitPrice * entry.quantity;

    const tr = document.createElement('tr');

    const titleTd = document.createElement('td');
    titleTd.dataset.label = 'Товар';
    titleTd.textContent = product.title;

    const priceTd = document.createElement('td');
    priceTd.dataset.label = 'Цена';
    priceTd.textContent = typeof formatPrice === 'function' ? formatPrice(unitPrice) : `${unitPrice} руб.`;

    const qtyTd = document.createElement('td');
    qtyTd.dataset.label = 'Количество';

    const decBtn = document.createElement('button');
    decBtn.type = 'button';
    decBtn.className = 'button button--secondary';
    decBtn.textContent = '−';
    decBtn.dataset.cartOp = 'dec';
    decBtn.dataset.productId = String(product.id);

    const qtyVal = document.createElement('span');
    qtyVal.textContent = ` ${entry.quantity} `;
    qtyVal.style.paddingInline = '0.4rem';

    const incBtn = document.createElement('button');
    incBtn.type = 'button';
    incBtn.className = 'button button--secondary';
    incBtn.textContent = '+';
    incBtn.dataset.cartOp = 'inc';
    incBtn.dataset.productId = String(product.id);

    qtyTd.append(decBtn, qtyVal, incBtn);

    const sumTd = document.createElement('td');
    sumTd.dataset.label = 'Сумма';
    sumTd.textContent = typeof formatPrice === 'function' ? formatPrice(lineSum) : `${lineSum} руб.`;

    const actTd = document.createElement('td');
    actTd.dataset.label = 'Действие';
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'button button--danger';
    delBtn.textContent = 'Удалить';
    delBtn.dataset.cartOp = 'remove';
    delBtn.dataset.productId = String(product.id);
    actTd.append(delBtn);

    tr.append(titleTd, priceTd, qtyTd, sumTd, actTd);
    cartTbody.append(tr);
  });

  const subtotal = calculateSubtotal(cart);
  const discountSum = Math.round((subtotal * appliedPromoPercent) / 100);
  const total = Math.max(0, subtotal - discountSum);

  if (subtotalEl) {
    subtotalEl.textContent = typeof formatPrice === 'function' ? formatPrice(subtotal) : `${subtotal} руб.`;
  }
  if (discountEl) {
    discountEl.textContent = typeof formatPrice === 'function' ? formatPrice(discountSum) : `${discountSum} руб.`;
  }
  if (totalEl) {
    totalEl.textContent = typeof formatPrice === 'function' ? formatPrice(total) : `${total} руб.`;
  }
}

if (cartTbody) {
  cartTbody.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-cart-op]');
    if (!btn) return;

    const productId = Number(btn.dataset.productId);
    const op = btn.dataset.cartOp;

    if (op === 'inc') updateItemQuantity(productId, 1);
    if (op === 'dec') updateItemQuantity(productId, -1);
    if (op === 'remove') removeCartItem(productId);
  });
}

if (promoForm && promoInput && promoMessage) {
  promoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const code = promoInput.value.trim().toUpperCase();

    if (!code) {
      appliedPromoPercent = 0;
      promoMessage.hidden = false;
      promoMessage.textContent = 'Промокод сброшен.';
      renderCart();
      return;
    }

    if (typeof promoCodes !== 'undefined' && Object.hasOwn(promoCodes, code)) {
      appliedPromoPercent = promoCodes[code];
      promoMessage.hidden = false;
      promoMessage.textContent = `Промокод ${code} применён — скидка ${appliedPromoPercent}%.`;
    } else {
      appliedPromoPercent = 0;
      promoMessage.hidden = false;
      promoMessage.textContent = 'Неизвестный промокод. Попробуйте TECHNOVA10 или START5.';
    }
    renderCart();
  });
}

if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    saveCart([]);
    appliedPromoPercent = 0;
    if (promoMessage) {
      promoMessage.textContent = '';
      promoMessage.hidden = true;
    }
    updateCounters();
    renderCart();
  });
}

updateCounters();
renderCart();