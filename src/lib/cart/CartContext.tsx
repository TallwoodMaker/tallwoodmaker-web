"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const CART_STORAGE_KEY = "twm-cart";

function readStoredCart(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

function writeStoredCart(ids: string[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable (private browsing, etc.) — cart just won't persist.
  }
}

type CartContextValue = {
  productIds: string[];
  ready: boolean;
  isInCart: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Deferred via queueMicrotask rather than calling setState synchronously
    // in the effect body — same pattern as CountdownTimer/ConsentContext,
    // satisfies react-hooks/set-state-in-effect.
    queueMicrotask(() => {
      setProductIds(readStoredCart());
      setReady(true);
    });
  }, []);

  const add = useCallback((id: string) => {
    setProductIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeStoredCart(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setProductIds((prev) => {
      const next = prev.filter((x) => x !== id);
      writeStoredCart(next);
      return next;
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setProductIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      writeStoredCart(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setProductIds([]);
    writeStoredCart([]);
  }, []);

  const isInCart = useCallback(
    (id: string) => productIds.includes(id),
    [productIds]
  );

  return (
    <CartContext.Provider
      value={{ productIds, ready, isInCart, add, remove, toggle, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
