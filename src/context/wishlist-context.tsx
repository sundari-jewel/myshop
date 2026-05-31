"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useCustomerAuth } from "./customer-auth-context";

interface WishlistContextValue {
  items: string[];
  count: number;
  isSaved: (productId: string) => boolean;
  toggle: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function key(email?: string) {
  return email ? `sundari_wishlist_${email}` : "sundari_wishlist_guest";
}

function readWishlist(storageKey: string) {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { customer, ready } = useCustomerAuth();
  const [items, setItems] = useState<string[]>([]);
  const storageKey = key(customer?.email);
  const skipNextPersist = useRef(false);

  useEffect(() => {
    if (!ready) return;

    const nextItems = readWishlist(storageKey);
    if (customer) {
      const guestItems = readWishlist(key());
      const merged = Array.from(new Set([...nextItems, ...guestItems]));
      skipNextPersist.current = true;
      queueMicrotask(() => setItems(merged));
      localStorage.setItem(storageKey, JSON.stringify(merged));
      localStorage.removeItem(key());
      return;
    }

    skipNextPersist.current = true;
    queueMicrotask(() => setItems(nextItems));
  }, [customer, ready, storageKey]);

  useEffect(() => {
    if (!ready) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, ready, storageKey]);

  const isSaved = useCallback((productId: string) => items.includes(productId), [items]);

  const toggle = useCallback((productId: string) => {
    let added = false;
    setItems((current) => {
      if (current.includes(productId)) return current.filter((item) => item !== productId);
      added = true;
      return [...current, productId];
    });
    return added;
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({ items, count: items.length, isSaved, toggle, clearWishlist }),
    [clearWishlist, isSaved, items, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
