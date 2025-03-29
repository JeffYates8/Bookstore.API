// Import React tools for context and state management
import { createContext, ReactNode, useContext, useState } from 'react';
import { CartItem } from '../types/CartItem';

// Define the shape of the cart context's value
interface CartContextType {
  cart: CartItem[];                          // List of items currently in the cart
  addToCart: (item: CartItem) => void;      // Function to add or update items in the cart
  removeFromCart: (bookId: number) => void; // Function to remove an item from the cart
  clearCart: () => void;                    // Function to clear the entire cart
}

// Create the context (initially undefined)
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component that wraps the app and makes cart state available
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]); // Cart state is stored as an array

  // Adds a new item or updates an existing one
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => c.bookId === item.bookId);

      // If the item is already in the cart, update its quantity and subtotal
      if (existingItem) {
        return prevCart.map((c) =>
          c.bookId === item.bookId
            ? {
                ...c,
                quantity: c.quantity + item.quantity,
                subtotal: (c.quantity + item.quantity) * c.price,
              }
            : c
        );
      } else {
        // If it's a new item, add it to the cart with a calculated subtotal
        return [
          ...prevCart,
          {
            ...item,
            subtotal: item.quantity * item.price,
          },
        ];
      }
    });
  };

  // Removes a book from the cart based on bookId
  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookId !== bookId));
  };

  // Clears all items from the cart
  const clearCart = () => {
    setCart(() => []);
  };

  // Provide the cart state and functions to any children components
  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access cart context from any component
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
