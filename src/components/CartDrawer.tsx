import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { formatNGN } from "@/lib/products";

export function CartDrawer() {
  const { open, setOpen, items, update, remove, subtotal } = useCart();

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-foreground/30 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[440px] bg-background shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-7 h-20 border-b border-border/60">
          <h3 className="text-xs uppercase tracking-[0.25em]">Your Bag ({items.length})</h3>
          <button onClick={() => setOpen(false)} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className="mt-2 text-xs uppercase tracking-[0.25em] border-b border-foreground pb-1"
            >
              Discover the collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
              {items.map((i) => (
                <div key={i.product.id} className="flex gap-4">
                  <div className="w-24 h-32 bg-cream overflow-hidden shrink-0">
                    <img src={i.product.image} alt={i.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-2">
                      <Link
                        to="/product/$id"
                        params={{ id: i.product.id }}
                        onClick={() => setOpen(false)}
                        className="text-sm font-medium hover:underline"
                      >
                        {i.product.name}
                      </Link>
                      <span className="text-sm">{formatNGN(i.product.price * i.quantity)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize mt-1">
                      {i.product.category}
                    </span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center border border-border">
                        <button
                          onClick={() => update(i.product.id, i.quantity - 1)}
                          className="px-2 py-1.5 hover:bg-cream"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs">{i.quantity}</span>
                        <button
                          onClick={() => update(i.product.id, i.quantity + 1)}
                          className="px-2 py-1.5 hover:bg-cream"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(i.product.id)}
                        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <footer className="border-t border-border/60 px-7 py-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.2em] text-xs">Subtotal</span>
                <span className="font-medium">{formatNGN(subtotal)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Shipping, taxes and discounts calculated at checkout.
              </p>
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors"
              >
                Secure checkout
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
