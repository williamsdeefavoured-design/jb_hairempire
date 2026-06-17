import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ProductCard } from "@/components/ProductCard";
import { getDbProducts, type Category } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: (search.category as Category | "all" | undefined) ?? "all",
    sort: (search.sort as "featured" | "price-asc" | "price-desc" | undefined) ?? "featured",
  }),
  head: () => ({
    meta: [
      { title: "Shop — JB HAIRMPIRE" },
      { name: "description", content: "Shop luxury wigs, professional hair equipment and elevated treatments at JB HAIRMPIRE." },
    ],
  }),
  component: Shop,
});

const filters: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "wigs", label: "Wigs" },
  { value: "equipment", label: "Equipment" },
  { value: "treatment", label: "Treatments" },
];

function Shop() {
  const { category, sort } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [currentProducts, setCurrentProducts] = React.useState(() => getDbProducts());

  React.useEffect(() => {
    const handleUpdate = () => {
      setCurrentProducts(getDbProducts());
    };
    window.addEventListener("jb_products_updated", handleUpdate);
    return () => window.removeEventListener("jb_products_updated", handleUpdate);
  }, []);

  const filtered = React.useMemo(() => {
    let list = category === "all" ? currentProducts : currentProducts.filter((p) => p.category === category);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, sort, currentProducts]);

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24">
      <div className="text-center mb-12">
        <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
          The Boutique
        </span>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Shop</h1>
        <div className="gold-line w-24 mx-auto mt-6" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 border-y border-border/60 py-5">
        <div className="flex flex-wrap gap-2 md:gap-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => navigate({ search: { category: f.value, sort } })}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                category === f.value
                  ? "bg-foreground text-background"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
          <label className="text-muted-foreground">Sort</label>
          <select
            value={sort}
            onChange={(e) =>
              navigate({
                search: { category, sort: e.target.value as "featured" | "price-asc" | "price-desc" },
              })
            }
            className="bg-transparent border-b border-border py-1 outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 md:gap-x-8">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-20 text-sm">
          No products in this collection yet.
        </p>
      )}
    </div>
  );
}
