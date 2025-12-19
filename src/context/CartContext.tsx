import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { Product, CartItem } from "@/types";

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartState {
  items: CartItem[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "checkout_cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.product._id === action.payload._id
      );

      if (existingItem) {
        const maxQty = action.payload.stock;
        const newQty = Math.min(existingItem.quantity + 1, maxQty);
        return {
          ...state,
          items: state.items.map((item) =>
            item.product._id === action.payload._id
              ? { ...item, quantity: newQty }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.product._id !== action.payload),
      };

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product._id !== action.payload.productId
          ),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product._id === action.payload.productId
            ? {
                ...item,
                quantity: Math.min(action.payload.quantity, item.product.stock),
              }
            : item
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "LOAD_CART":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dispatch({ type: "LOAD_CART", payload: parsed });
        }
      }
    } catch (error) {
      console.error("Failed to load cart from storage:", error);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error("Failed to save cart to storage:", error);
    }
  }, [state.items]);

  const addItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
