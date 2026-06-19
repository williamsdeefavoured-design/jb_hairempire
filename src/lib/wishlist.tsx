import * as React from "react";
import type { Product } from "./products";

interface WishlistContextValue {
  items: Product[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  toggle: (p: Product) => void;
  has: (id: string) => boolean;
  count: number;
}

const WishlistContext = React.createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Product[]>([]);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("jb-hairmpire-wishlist");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {}
  }, []);

  // Save to localStorage on change
  const saveItems = (newItems: Product[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("jb-hairmpire-wishlist", JSON.stringify(newItems));
    } catch {}
  };

  const add = (product: Product) => {
    if (items.some((i) => i.id === product.id)) return;
    saveItems([...items, product]);
  };

  const remove = (id: string) => {
    saveItems(items.filter((i) => i.id !== id));
  };

  const toggle = (product: Product) => {
    if (items.some((i) => i.id === product.id)) {
      remove(product.id);
    } else {
      add(product);
    }
  };

  const has = (id: string) => {
    return items.some((i) => i.id === id);
  };

  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, add, remove, toggle, has, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = React.useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
