const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('.theme-toggle__icon') : null;
const storedTheme = typeof loadSavedTheme === 'function' ? loadSavedTheme() : localStorage.getItem('theme');

if (storedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
} else if (storedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}

function updateToggleLabel() {
  if (!themeIcon || !themeToggle) return;
  const current = document.documentElement.getAttribute('data-theme');
  const isDark =
    current === 'dark' ||
    (current !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
}

if (themeToggle) {
  updateToggleLabel();
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const isDark =
      current === 'dark' ||
      (current !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    if (typeof saveThemeValue === 'function') {
      saveThemeValue(next);
    } else {
      localStorage.setItem('theme', next);
    }
    updateToggleLabel();
  });
}

const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav-list');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const quickViewBtns = document.querySelectorAll('.quick-view[data-title]');
const modal = document.getElementById('quick-view-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalClose = document.getElementById('modal-close');

if (modal && modalClose) {
  quickViewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (modalTitle) modalTitle.textContent = btn.dataset.title || 'Товар';
      if (modalDesc) modalDesc.textContent = btn.dataset.desc || '';
      modal.showModal();
    });
  });
  modalClose.addEventListener('click', () => modal.close());
}

const jsMessageEl = document.querySelector('[data-js-message]');
const productOutputEl = document.querySelector('[data-product-output]');

if (jsMessageEl && typeof products !== 'undefined') {
  jsMessageEl.textContent = 'JavaScript подключён корректно. Массив товаров и функции готовы.';
}

if (productOutputEl && typeof products !== 'undefined') {
  const availableCount = products.filter((p) => p.isAvailable).length;
  const avgPrice = products.length > 0
    ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
    : 0;

  productOutputEl.textContent = [
    `Всего товаров: ${products.length}`,
    `В наличии: ${availableCount}`,
    `Средняя цена: ${avgPrice.toLocaleString('ru-RU')} руб.`
  ].join('\n');
}

const detailRoot = document.querySelector('[data-product-detail]');
if (detailRoot && typeof products !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  const idParam = Number(params.get('id'));
  const product = products.find((item) => item.id === idParam) || products[0];

  if (product) {
    document.title = `${product.title} – TechNova`;

    const crumbCurrent = document.querySelector('[data-detail-breadcrumb]');
    const imgEl = detailRoot.querySelector('[data-detail-image]');
    const titleEl = detailRoot.querySelector('[data-detail-title]');
    const priceEl = detailRoot.querySelector('[data-detail-price]');
    const descEl = detailRoot.querySelector('[data-detail-description]');
    const addBtn = detailRoot.querySelector('[data-detail-add]');

    if (crumbCurrent) crumbCurrent.textContent = product.title;
    if (imgEl) {
      imgEl.src = product.image;
      imgEl.alt = product.title;
    }
    if (titleEl) titleEl.textContent = product.title;
    if (priceEl) {
      const finalPrice = typeof calculateFinalPrice === 'function'
        ? calculateFinalPrice(product.price, product.discountPercent)
        : product.price;
      priceEl.textContent = typeof formatPrice === 'function' ? formatPrice(finalPrice) : `${finalPrice} руб.`;
    }
    if (descEl) descEl.textContent = product.description;

    if (addBtn) {
      addBtn.disabled = !product.isAvailable;
      addBtn.textContent = product.isAvailable ? 'Добавить в корзину' : 'Нет в наличии';
      addBtn.addEventListener('click', () => {
        if (typeof addToCart === 'function') {
          addToCart(product.id);
        }
      });
    }

    const specsBody = document.querySelector('[data-product-specs]');
    if (specsBody && product.specs) {
      specsBody.replaceChildren();
      const rows = [
        ['Тип', product.specs.type],
        ['Подключение', product.specs.connection],
        ['Автономность / питание', product.specs.battery],
        ['Особенности', product.specs.anc],
        ['Вес', product.specs.weight]
      ];
      rows.forEach(([label, val]) => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.scope = 'row';
        th.dataset.label = 'Параметр';
        th.textContent = label;

        const td = document.createElement('td');
        td.dataset.label = 'Значение';
        td.textContent = val;

        tr.append(th, td);
        specsBody.append(tr);
      });
    }
  }
}