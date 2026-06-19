import * as React from "react";
import type { Product } from "./products";

import { useAuth } from "./auth";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  update: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [open, setOpen] = React.useState(false);
  const { user, openAuthModal } = useAuth();

  const add = (product: Product, qty = 1) => {
    if (!user) {
      toast.error("Please sign in or register to add items to bag and purchase.");
      openAuthModal("login");
      return;
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setOpen(true);
  };
  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.product.id !== id));
  const update = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((i) => (i.product.id === id ? { ...i, quantity: Math.max(1, qty) } : i)),
    );
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.quantity * i.product.price, 0);

  return (
    <CartContext.Provider
      value={{ items, add, remove, update, clear, count, subtotal, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
