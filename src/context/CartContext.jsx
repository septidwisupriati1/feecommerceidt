import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// Normalisasi data produk yang disimpan di cart agar aman dirender
const normalizeProductForCart = (product) => {
  if (!product) return product;

  const categoryName = typeof product.category === 'object'
    ? product.category?.name
      ?? product.category?.category_name
      ?? product.category?.title
      ?? product.category?.label
      ?? ''
    : product.category ?? '';

  const productId = product.id ?? product.product_id ?? product.slug ?? product.sku;
  const numericPrice = Number(product.price ?? 0);
  const sellerId = product.seller_id ?? product.sellerId ?? product.seller?.seller_id ?? product.seller?.id;

  return {
    ...product,
    id: productId ?? Date.now(),
    product_id: product.product_id ?? productId ?? Date.now(),
    seller_id: sellerId ?? null,
    name: product.name ?? product.title ?? product.product_name ?? 'Produk',
    price: Number.isFinite(numericPrice) ? numericPrice : 0,
    quantity: Number.isFinite(product.quantity) ? product.quantity : 1,
    category: categoryName,
    category_id: product.category_id ?? product.category?.category_id ?? null,
    image: product.image || product.primary_image || product.image_url || product.picture || '',
  };
};

const isValidCartItem = (item) => {
  if (!item) return false;
  if (!item.id) return false;
  if (!Number.isFinite(item.price)) return false;
  if (!Number.isFinite(item.quantity)) return false;
  return true;
};

const sanitizeCartItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map(normalizeProductForCart)
    .filter(isValidCartItem);
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      return sanitizeCartItems(parsed);
    } catch (err) {
      console.warn('Cart parse error, resetting cart', err);
      return [];
    }
  });

  const [selectedItems, setSelectedItems] = useState(() => {
    // Load from localStorage
    const savedSelected = localStorage.getItem('selectedItems');
    return savedSelected ? JSON.parse(savedSelected) : [];
  });

  const [orders, setOrders] = useState(() => {
    // Load from localStorage
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save to localStorage whenever selected items change
  useEffect(() => {
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
  }, [selectedItems]);

  // Save to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product, quantity = 1) => {
    const normalizedProduct = normalizeProductForCart(product);
    const normalizedQuantity = Number.isFinite(quantity) ? quantity : 1;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === normalizedProduct.id);
      if (existingItem) {
        const updated = prevItems.map(item =>
          item.id === normalizedProduct.id
            ? { ...item, quantity: item.quantity + normalizedQuantity }
            : item
        );
        return sanitizeCartItems(updated);
      }

      return sanitizeCartItems([...prevItems, { ...normalizedProduct, quantity: normalizedQuantity }]);
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    // Also remove from selected items
    setSelectedItems(prev => prev.filter(id => id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const safeQty = Number.isFinite(quantity) ? quantity : 1;
    if (safeQty <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: safeQty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedItems([]);
  };

  const toggleSelectItem = (productId) => {
    setSelectedItems(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  // Set selected items explicitly (used by buy-now flows)
  const selectItemsById = (ids, { append = false } = {}) => {
    const incoming = Array.isArray(ids) ? ids : [ids];
    const normalized = incoming.filter(Boolean);

    setSelectedItems(prev => {
      const next = append ? [...prev, ...normalized] : normalized;
      return Array.from(new Set(next));
    });
  };

  const removeSelectedItems = () => {
    setCartItems(prevItems => prevItems.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSelectedTotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSelectedItemsCount = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((count, item) => count + item.quantity, 0);
  };

  const createOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      orderNumber: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'pending', // pending, processing, shipped, delivered, cancelled
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const cancelOrder = (orderId) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedItems,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleSelectItem,
        toggleSelectAll,
        selectItemsById,
        removeSelectedItems,
        getCartTotal,
        getSelectedTotal,
        getCartItemsCount,
        getSelectedItemsCount,
        createOrder,
        updateOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
