import { createFileRoute, Link } from "@tanstack/react-router";
import wig1 from "@/wigs/wig 1.jpg";
import wig2 from "@/wigs/wig 2.jpg";
import wig3 from "@/wigs/wig 3.jpg";
import wig4 from "@/wigs/wig 4.jpg";
import wig5 from "@/wigs/wig 5.jpg";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — JB HAIRMPIRE" },
      { name: "description", content: "Discover the JB HAIRMPIRE collections — wigs, equipment and treatments curated for the modern woman." },
    ],
  }),
  component: Collections,
});

const items = [
  {
    title: "New Arrivals",
    subtitle: "Fresh from the atelier",
    image: wig1,
    copy: "The latest pieces, photographed for the season.",
    search: { category: "all", sort: "featured" } as const,
  },
  {
    title: "Best Sellers",
    subtitle: "Loved by our community",
    image: wig2,
    copy: "The pieces our clients return for, again and again.",
    search: { category: "wigs", sort: "featured" } as const,
  },
  {
    title: "Wigs",
    subtitle: "Hand-tied, undetectable",
    image: wig3,
    copy: "Raw hair, custom-coloured, hand-ventilated to perfection.",
    search: { category: "wigs", sort: "featured" } as const,
  },
  {
    title: "Hair Equipment",
    subtitle: "Atelier-grade tools",
    image: wig4,
    copy: "Engineered to make every blow-out feel like the salon.",
    search: { category: "equipment", sort: "featured" } as const,
  },
  {
    title: "Hair Treatments",
    subtitle: "The daily ritual",
    image: wig5,
    copy: "Serums, masks and oils that restore and protect.",
    search: { category: "treatment", sort: "featured" } as const,
  },
];

function Collections() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24">
      <div className="text-center mb-16">
        <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
          Curated
        </span>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Collections</h1>
        <div className="gold-line w-24 mx-auto mt-6" />
      </div>

      <div className="space-y-24 md:space-y-32">
        {items.map((c, i) => (
          <div
            key={c.title}
            className={`grid md:grid-cols-2 gap-10 lg:gap-16 items-center ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <Link to="/shop" search={c.search} className="block aspect-[4/5] overflow-hidden bg-cream hover-zoom">
              <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-cover" />
            </Link>
            <div>
              <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
                {c.subtitle}
              </span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">{c.title}</h2>
              <p className="mt-6 text-base text-foreground/70 leading-relaxed max-w-md">{c.copy}</p>
              <Link
                to="/shop"
                search={c.search}
                className="mt-8 inline-block text-xs uppercase tracking-[0.25em] border-b border-foreground pb-1"
              >
                Shop {c.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
