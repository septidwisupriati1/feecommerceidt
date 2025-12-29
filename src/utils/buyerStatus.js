// Utility to check if buyer is new (no orders, chats, or cart history)
const isNewBuyer = () => {
  try {
    // Check for buyer orders in localStorage
    const orders = localStorage.getItem('buyer_orders');
    const hasOrders = orders && JSON.parse(orders).length > 0;
    
    // Check for buyer chats in localStorage
    const chats = localStorage.getItem('buyer_chats');
    const hasChats = chats && JSON.parse(chats).length > 0;
    
    // Check for cart history (completed purchases)
    const cartHistory = localStorage.getItem('buyer_cart_history');
    const hasCartHistory = cartHistory && JSON.parse(cartHistory).length > 0;
    
    // Buyer is new if they have no orders, chats, or cart history
    return !hasOrders && !hasChats && !hasCartHistory;
  } catch (e) {
    console.error('isNewBuyer error', e);
    return true;
  }
};

export { isNewBuyer };
