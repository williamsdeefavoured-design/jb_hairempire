import { createFileRoute } from "@tanstack/react-router";
import collectionTreatment from "@/assets/collection-treatment.jpg";

export const Route = createFileRoute("/tips")({
  head: () => ({
    meta: [
      { title: "Tips & Guides — JB HAIRMPIRE" },
      { name: "description", content: "Expert tips and guides for caring for your wigs, styling at home and protecting your hair." },
    ],
  }),
  component: Tips,
});

const guides = [
  { t: "How to care for a raw hair wig", c: "A simple weekly ritual to keep your unit silky for years." },
  { t: "The blow-out, mastered", c: "Three steps for a smooth, voluminous finish at home." },
  { t: "Heat protection 101", c: "Why temperature, technique and product order matter." },
  { t: "Choosing your density", c: "How to select the right density for your face shape." },
];

function Tips() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10 py-24 md:py-32">
      <div className="text-center mb-16">
        <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">The Journal</span>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Tips & Guides</h1>
        <div className="gold-line w-24 mx-auto mt-6" />
      </div>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-16">
        {guides.map((g, i) => (
          <article key={g.t} className="group cursor-pointer">
            <div className="aspect-[4/3] bg-cream overflow-hidden hover-zoom">
              <img src={collectionTreatment} alt="" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <p className="mt-5 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Guide · 0{i + 1}
            </p>
            <h2 className="mt-3 font-display text-2xl group-hover:underline underline-offset-4">{g.t}</h2>
            <p className="mt-3 text-sm text-foreground/70 leading-relaxed">{g.c}</p>
            <span className="mt-5 inline-block text-xs uppercase tracking-[0.25em] border-b border-foreground pb-1">Read more</span>
          </article>
        ))}
      </div>
    </div>
  );
}
