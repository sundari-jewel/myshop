"use client";

import {
  createContext, useContext, useEffect, useReducer, useCallback, useMemo, useRef, type ReactNode,
} from "react";
import { useCustomerAuth } from "./customer-auth-context";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  material: string;
  price: number;
  qty: number;
  size?: string;
}

interface CartState {
  items: CartItem[];
  open: boolean;
}

type CartAction =
  | { type: "ADD";    payload: CartItem }
  | { type: "REMOVE"; productId: string; size?: string }
  | { type: "UPDATE"; productId: string; size?: string; qty: number }
  | { type: "CLEAR" }
  | { type: "LOAD";   items: CartItem[] }
  | { type: "SET_OPEN"; open: boolean };

function key(productId: string, size?: string) {
  return size ? `${productId}::${size}` : productId;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD":
      return { ...state, items: action.items };

    case "ADD": {
      const k    = key(action.payload.productId, action.payload.size);
      const idx  = state.items.findIndex(i => key(i.productId, i.size) === k);
      const items = idx >= 0
        ? state.items.map((item, i) => i === idx ? { ...item, qty: item.qty + action.payload.qty } : item)
        : [...state.items, action.payload];
      return { ...state, items, open: true };
    }

    case "REMOVE": {
      const k = key(action.productId, action.size);
      return { ...state, items: state.items.filter(i => key(i.productId, i.size) !== k) };
    }

    case "UPDATE": {
      const k = key(action.productId, action.size);
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter(i => key(i.productId, i.size) !== k) };
      }
      return { ...state, items: state.items.map(i => key(i.productId, i.size) === k ? { ...i, qty: action.qty } : i) };
    }

    case "CLEAR":
      return { ...state, items: [] };

    case "SET_OPEN":
      return { ...state, open: action.open };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQty: (productId: string, size?: string, qty?: number) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function storageKey(email?: string) {
  return email ? `sundari_cart_${email}` : "sundari_cart_guest";
}

function readCart(keyName: string) {
  try {
    return JSON.parse(localStorage.getItem(keyName) ?? "[]") as CartItem[];
  } catch {
    return [];
  }
}

function mergeItems(primary: CartItem[], secondary: CartItem[]) {
  const merged = [...primary];
  for (const item of secondary) {
    const itemKey = key(item.productId, item.size);
    const index = merged.findIndex((current) => key(current.productId, current.size) === itemKey);
    if (index >= 0) {
      merged[index] = { ...merged[index], qty: merged[index].qty + item.qty };
    } else {
      merged.push(item);
    }
  }
  return merged;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], open: false });
  const { customer, ready } = useCustomerAuth();
  const activeStorageKey = useMemo(() => storageKey(customer?.email), [customer?.email]);
  const skipNextPersist = useRef(false);

  useEffect(() => {
    if (!ready) return;

    const savedItems = readCart(activeStorageKey);

    if (customer) {
      const guestItems = readCart(storageKey());
      const merged = mergeItems(savedItems, guestItems);
      skipNextPersist.current = true;
      dispatch({ type: "LOAD", items: merged });
      localStorage.setItem(activeStorageKey, JSON.stringify(merged));
      localStorage.removeItem(storageKey());
    } else {
      skipNextPersist.current = true;
      dispatch({ type: "LOAD", items: savedItems });
    }

  }, [activeStorageKey, customer, ready]);

  useEffect(() => {
    if (!ready) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    localStorage.setItem(activeStorageKey, JSON.stringify(state.items));
  }, [activeStorageKey, ready, state.items]);

  const addItem    = useCallback((item: CartItem)                          => dispatch({ type: "ADD", payload: item }), []);
  const removeItem = useCallback((productId: string, size?: string)        => dispatch({ type: "REMOVE", productId, size }), []);
  const updateQty  = useCallback((productId: string, size?: string, qty = 1) => dispatch({ type: "UPDATE", productId, size, qty }), []);
  const clearCart  = useCallback(()                                         => dispatch({ type: "CLEAR" }), []);
  const setOpen    = useCallback((open: boolean)                            => dispatch({ type: "SET_OPEN", open }), []);

  const count    = state.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items: state.items, count, subtotal, open: state.open, addItem, removeItem, updateQty, clearCart, setOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
