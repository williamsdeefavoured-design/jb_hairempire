import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import * as React from "react";
import { Minus, Plus, Truck, Shield, Heart, Star } from "lucide-react";
import { getProduct, getDbProducts, formatNGN } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name ?? "Product"} — JB HAIRMPIRE` },
      { name: "description", content: loaderData?.product.description ?? "" },
      { property: "og:title", content: `${loaderData?.product.name} — JB HAIRMPIRE` },
      { property: "og:image", content: loaderData?.product.image ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="text-center py-32">
      <p className="text-sm text-muted-foreground">Product not found.</p>
      <Link
        to="/shop"
        search={{ category: "all", sort: "featured" }}
        className="mt-4 inline-block text-xs uppercase tracking-[0.25em] border-b border-foreground pb-1"
      >
        Back to shop
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="text-center py-32 text-sm">{error.message}</div>,
  component: ProductPage,
});

function ProductPage() {
  const { product: initialProduct } = Route.useLoaderData();
  const { id } = Route.useParams();
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const isFav = has(id);
  const [qty, setQty] = React.useState(1);

  const [product, setProduct] = React.useState(initialProduct);
  const [allProducts, setAllProducts] = React.useState(() => getDbProducts());

  React.useEffect(() => {
    setProduct(getProduct(id) || initialProduct);
  }, [id, initialProduct]);

  React.useEffect(() => {
    const handleUpdate = () => {
      setProduct(getProduct(id) || initialProduct);
      setAllProducts(getDbProducts());
    };
    window.addEventListener("jb_products_updated", handleUpdate);
    return () => window.removeEventListener("jb_products_updated", handleUpdate);
  }, [id, initialProduct]);

  const related = React.useMemo(() => {
    return allProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);
  }, [product, allProducts]);

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 md:py-16">
      <nav className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" search={{ category: "all", sort: "featured" }} className="hover:text-foreground">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="aspect-4/5 bg-cream overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[product.image, product.image, product.image, product.image].map((src, i) => (
              <div key={i} className="aspect-square bg-cream overflow-hidden cursor-pointer">
                <img src={src} alt="" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 self-start">
          {product.badge && (
            <span className="inline-block bg-cream px-3 py-1 text-[10px] uppercase tracking-[0.25em] mb-4">
              {product.badge}
            </span>
          )}
          <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-2xl">{formatNGN(product.price)}</span>
            {product.compareAt && (
              <span className="text-base text-muted-foreground line-through">
                {formatNGN(product.compareAt)}
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-gold text-gold" />
              ))}
            </div>
            <span>· 248 reviews</span>
          </div>

          <p className="mt-8 text-sm text-foreground/70 leading-relaxed">
            {product.description}
          </p>

          <ul className="mt-6 space-y-2 text-sm text-foreground/70">
            {product.details.map((d: string) => (
              <li key={d} className="flex gap-3">
                <span className="text-gold">—</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Qty + Add */}
          <div className="mt-10 flex items-stretch gap-3">
            <div className="inline-flex items-center border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 hover:bg-cream" aria-label="Decrease">
                <Minus className="h-3 w-3" />
              </button>
              <span className="px-5 text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-4 hover:bg-cream" aria-label="Increase">
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <button
              onClick={() => add(product, qty)}
              className="flex-1 bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors"
            >
              Add to bag — {formatNGN(product.price * qty)}
            </button>
            <button
              onClick={() => toggle(product)}
              className="border border-border px-4 hover:bg-cream flex items-center justify-center transition-colors cursor-pointer"
              aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-4 w-4 ${isFav ? "fill-gold text-gold" : ""}`} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-3 p-4 bg-cream">
              <Truck className="h-4 w-4 mt-0.5 text-gold" />
              <div>
                <p className="font-medium uppercase tracking-[0.15em]">Free Shipping</p>
                <p className="text-muted-foreground mt-1">On orders over ₦400,000</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-cream">
              <Shield className="h-4 w-4 mt-0.5 text-gold" />
              <div>
                <p className="font-medium uppercase tracking-[0.15em]">Secure Checkout</p>
                <p className="text-muted-foreground mt-1">30-day easy returns</p>
              </div>
            </div>
          </div>

          {/* Accordions */}
          <div className="mt-10 border-t border-border">
            {[
              { t: "Description", c: product.description },
              {
                t: "Shipping & Returns",
                c: "Complimentary express shipping on orders over ₦400,000. All orders are dispatched within 48 hours from our atelier. Returns accepted within 30 days on unopened items.",
              },
              { t: "Care", c: "Wash with sulfate-free shampoo. Air dry when possible. Store on a wig stand to maintain shape and density." },
            ].map((s) => (
              <details key={s.t} className="group border-b border-border py-5">
                <summary className="flex items-center justify-between cursor-pointer text-sm uppercase tracking-[0.2em] list-none">
                  {s.t}
                  <Plus className="h-4 w-4 group-open:hidden" />
                  <Minus className="h-4 w-4 hidden group-open:block" />
                </summary>
                <p className="mt-4 text-sm text-foreground/70 leading-relaxed">{s.c}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-24 border-t border-border pt-16">
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Loved by clients</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">Reviews</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "Imani", t: "Better than I imagined. The lace is invisible." },
            { n: "Sade", t: "Quality is unreal. Worth every cent." },
            { n: "Maya", t: "My third order — they never miss." },
          ].map((r) => (
            <div key={r.n} className="bg-cream p-8">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-4 text-sm text-foreground/80 leading-relaxed">"{r.t}"</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">— {r.n}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl mb-10">You may also love</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 md:gap-x-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
