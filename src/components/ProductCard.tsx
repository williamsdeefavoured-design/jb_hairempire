import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { type Product, formatNGN } from "@/lib/products";
import { useCart } from "@/lib/cart";

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            className={`h-3 w-3 ${filled ? "fill-foreground text-foreground" : "text-muted-foreground/40"}`}
            strokeWidth={1.5}
          />
        );
      })}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <div className="group">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block relative aspect-[4/5] bg-cream overflow-hidden hover-zoom"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
            {product.badge}
          </span>
        )}
        <button
          aria-label="Wishlist"
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-background/90 backdrop-blur grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            add(product, 1);
          }}
          className="absolute bottom-0 left-0 right-0 bg-foreground text-background text-[11px] uppercase tracking-[0.25em] py-3.5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
        >
          Add to bag
        </button>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            {product.name}
          </Link>
          <p className="text-xs text-muted-foreground mt-1 capitalize">
            {product.category === "wigs" && product.texture
              ? `${product.texture}${product.length ? ` · ${product.length}"` : ""}`
              : product.category === "treatment"
                ? "Hair treatment"
                : product.category}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Stars rating={product.rating} />
            <span className="text-[10px] text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviews})
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-sm">{formatNGN(product.price)}</span>
          {product.compareAt && (
            <span className="block text-xs text-muted-foreground line-through">
              {formatNGN(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
