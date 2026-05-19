import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((items) => {
      const existingItem = items.find((item) => item.product === product._id);

      if (existingItem) {
        return items.map((item) =>
          item.product === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.countInStock) }
            : item
        );
      }

      return [
        ...items,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock,
          quantity
        }
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((items) =>
      items.map((item) =>
        item.product === productId
          ? { ...item, quantity: Math.max(1, Math.min(Number(quantity), item.countInStock)) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((items) => items.filter((item) => item.product !== productId));
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      itemCount
    }),
    [cartItems, subtotal, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
