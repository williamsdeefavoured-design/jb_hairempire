import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import hero from "@/assets/hero.jpg";
import wig1 from "@/wigs/wig 1.jpg";
import wig2 from "@/wigs/wig 2.jpg";
import wig3 from "@/wigs/wig 3.jpg";
import wig5 from "@/wigs/wig 5.jpg";
import wig10 from "@/wigs/wig 10.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const collections = [
  { 
    title: "New Arrivals", 
    subtitle: "Fresh from the atelier", 
    image: wig1, 
    to: "/shop",
    search: { category: "all", sort: "featured" } as const
  },
  { 
    title: "Best Sellers", 
    subtitle: "Loved by our community", 
    image: wig2, 
    to: "/shop",
    search: { category: "wigs", sort: "featured" } as const
  },
  { 
    title: "Wigs", 
    subtitle: "Hand-tied, undetectable", 
    image: wig3, 
    to: "/shop",
    search: { category: "wigs", sort: "featured" } as const
  },
  { 
    title: "Hair Treatments", 
    subtitle: "Daily ritual essentials", 
    image: wig5, 
    to: "/shop",
    search: { category: "treatment", sort: "featured" } as const
  },
];

function Index() {
  const featured = products.slice(0, 6);

  return (
    <div className="-mt-20">
      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={hero}
          alt="JB HAIRMPIRE editorial campaign"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/80 via-cream/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        <div className="relative h-full mx-auto max-w-7xl px-6 lg:px-10 flex items-end lg:items-center">
          <div className="max-w-xl pb-24 lg:pb-0 fade-up">
            <span className="text-[11px] uppercase tracking-[0.4em] text-foreground/70">
              The Spring Edit
            </span>
            <h1 className="mt-5 font-display text-5xl md:text-7xl leading-[1.02] text-balance">
              Hair, refined<br />to an art form.
            </h1>
            <p className="mt-6 text-base md:text-lg text-foreground/70 max-w-md leading-relaxed">
              Hand-crafted wigs, professional styling tools and elevated
              treatments — designed for women who expect more.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                to="/collections"
                className="border-b border-foreground pb-1 text-xs uppercase tracking-[0.25em] hover:text-foreground/70 transition-colors"
              >
                Explore the Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border/60 bg-cream py-5 overflow-hidden">
        <div className="flex whitespace-nowrap marquee text-xs uppercase tracking-[0.35em] text-foreground/70">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-12 pr-12">
              <span>Free worldwide shipping over $250</span>
              <span>·</span>
              <span>30-day returns</span>
              <span>·</span>
              <span>Hand-tied 100% raw hair</span>
              <span>·</span>
              <span>Made with intention</span>
              <span>·</span>
              <span>Atelier-grade tools</span>
              <span>·</span>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 md:py-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              Featured
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Collections</h2>
          </div>
          <Link to="/collections" className="hidden md:inline-block text-xs uppercase tracking-[0.25em] border-b border-foreground pb-1">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {collections.map((c) => (
            <Link
              key={c.title}
              to={c.to}
              search={c.search}
              className="group relative aspect-[3/4] overflow-hidden bg-cream hover-zoom"
            >
              <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-background">
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">{c.subtitle}</p>
                <h3 className="font-display text-2xl mt-2">{c.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 pb-24 md:pb-32">
        <div className="text-center mb-14">
          <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            The Edit
          </span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Most Coveted</h2>
          <div className="gold-line w-24 mx-auto mt-6" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 md:gap-x-8">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link
            to="/shop"
            className="inline-block bg-foreground text-background px-10 py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors"
          >
            Shop the edit
          </Link>
        </div>
      </section>

      {/* SPLIT EDITORIAL */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="aspect-[4/5] overflow-hidden">
            <img src={wig10} alt="Atelier" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              The House
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
              Crafted by hand.<br />Worn with confidence.
            </h2>
            <p className="mt-6 text-base text-foreground/70 leading-relaxed max-w-md">
              Every JB HAIRMPIRE piece is hand-tied by master artisans using
              ethically-sourced raw hair. Our tools are engineered with the
              same care — quiet, fast and forgiving.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-block text-xs uppercase tracking-[0.25em] border-b border-foreground pb-1"
            >
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="mx-auto max-w-4xl px-6 lg:px-10 py-24 md:py-32 text-center">
        <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
          ★ ★ ★ ★ ★
        </span>
        <blockquote className="mt-6 font-display text-2xl md:text-3xl leading-snug text-balance">
          &ldquo;The most beautiful unit I&rsquo;ve ever owned. Glueless, weightless and
          impossibly natural — JB HAIRMPIRE is in a league of its own.&rdquo;
        </blockquote>
        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Amara K. — verified client
        </p>
      </section>
    </div>
  );
}
