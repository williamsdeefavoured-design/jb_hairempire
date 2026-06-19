import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { formatNGN } from "@/lib/products";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({
    meta: [
      { title: "Your Wishlist · JB HAIRMPIRE" },
      {
        name: "description",
        content: "View your saved luxury wigs, care items and hair styling tools.",
      },
    ],
  }),
});

function WishlistPage() {
  const { items, remove } = useWishlist();
  const { add } = useCart();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-display tracking-wide mb-10 text-center">Your Wishlist</h1>

      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-muted-foreground mb-6">Your wishlist is empty.</p>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[0.25em] border-b border-foreground pb-1"
          >
            Discover the Boutique
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/60"
            >
              {/* Product Image */}
              <Link
                to="/product/$id"
                params={{ id: p.id }}
                className="w-32 h-40 bg-cream overflow-hidden shrink-0 block"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 text-center sm:text-left">
                <Link
                  to="/product/$id"
                  params={{ id: p.id }}
                  className="text-lg font-display hover:underline block"
                >
                  {p.name}
                </Link>
                <span className="text-xs text-muted-foreground capitalize mt-1 block">
                  {p.category} {p.texture ? `· ${p.texture}` : ""} {p.length ? `· ${p.length}"` : ""}
                </span>
                <span className="text-sm font-medium mt-2 block">
                  {formatNGN(p.price)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => add(p, 1)}
                  className="flex items-center gap-2 bg-foreground text-background px-5 py-3 text-xs uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Add to bag
                </button>
                <button
                  onClick={() => remove(p.id)}
                  aria-label="Remove from wishlist"
                  className="p-3 border border-border hover:bg-cream/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
