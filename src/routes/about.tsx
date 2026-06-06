import { createFileRoute } from "@tanstack/react-router";
import collection from "@/assets/collection-wigs.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — JB HAIRMPIRE" },
      { name: "description", content: "JB HAIRMPIRE is a modern luxury hair house — hand-crafted wigs, atelier-grade tools and elevated treatments." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-6 lg:px-10 py-24 md:py-32 text-center">
        <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">The House</span>
        <h1 className="mt-4 font-display text-5xl md:text-6xl leading-[1.05] text-balance">
          A modern luxury hair house.
        </h1>
        <div className="gold-line w-24 mx-auto mt-8" />
        <p className="mt-10 text-lg text-foreground/70 leading-relaxed">
          JB HAIRMPIRE was founded on a simple belief: hair should feel like
          couture. From the raw bundles we source, to the artisans who hand-tie
          every cap, to the tools that finish the look — every detail is
          considered, refined and made to last.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 pb-24">
        <div className="aspect-[16/9] overflow-hidden bg-cream">
          <img src={collection} alt="JB HAIRMPIRE atelier" className="w-full h-full object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 lg:px-10 pb-32 grid md:grid-cols-3 gap-12">
        {[
          { t: "Hand-crafted", c: "Each wig is ventilated by a single artisan over 40+ hours." },
          { t: "Ethically sourced", c: "Raw hair from trusted donors, traceable from origin to atelier." },
          { t: "Made to last", c: "With care, your JB HAIRMPIRE pieces stay couture for years." },
        ].map((b) => (
          <div key={b.t}>
            <h3 className="font-display text-2xl">{b.t}</h3>
            <div className="gold-line w-12 mt-4" />
            <p className="mt-5 text-sm text-foreground/70 leading-relaxed">{b.c}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
