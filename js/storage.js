const STORAGE_KEYS = {
  cart: 'technova_kr4_cart_v1',
  favorites: 'technova_kr4_favorites_v1',
  theme: 'theme'
};

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cart);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.productId === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
  } catch {
  }
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.favorites);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id) => typeof id === 'number');
  } catch {
    return [];
  }
}

function saveFavorites(ids) {
  try {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(ids));
  } catch {
  }
}

function loadSavedTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.theme);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
}

function saveThemeValue(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  } catch {  }
}