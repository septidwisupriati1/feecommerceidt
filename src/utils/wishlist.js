const WISHLIST_KEY = 'wishlist';

export const getWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const saveWishlist = (ids) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  } catch (e) {
    // ignore
  }
};

export const isInWishlist = (id) => {
  const ids = getWishlist();
  return ids.includes(id);
};

export const addToWishlist = (id) => {
  const ids = getWishlist();
  if (!ids.includes(id)) {
    ids.push(id);
    saveWishlist(ids);
  }
  return ids;
};

export const removeFromWishlist = (id) => {
  const ids = getWishlist().filter(i => i !== id);
  saveWishlist(ids);
  return ids;
};

export const toggleWishlist = (id) => {
  if (isInWishlist(id)) return removeFromWishlist(id);
  return addToWishlist(id);
};

export default {
  getWishlist,
  saveWishlist,
  isInWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist
};
