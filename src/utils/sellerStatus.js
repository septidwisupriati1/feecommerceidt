// Utility to determine whether a seller is new (no products, no chats, no orders)
const isNewSeller = () => {
  try {
    const products = JSON.parse(localStorage.getItem('seller_products') || '[]');
    const chats = JSON.parse(localStorage.getItem('seller_chats') || '{}');
    const orders = JSON.parse(localStorage.getItem('seller_orders') || '[]');

    const hasProducts = Array.isArray(products) && products.length > 0;
    const hasChats = (chats && ((Array.isArray(chats.buyer) && chats.buyer.length > 0) || (Array.isArray(chats.admin) && chats.admin.length > 0)));
    const hasOrders = Array.isArray(orders) && orders.length > 0;

    return !(hasProducts || hasChats || hasOrders);
  } catch (e) {
    console.error('isNewSeller error', e);
    return true; // safer to treat as new if any error
  }
};

export { isNewSeller };
