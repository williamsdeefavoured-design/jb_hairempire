import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — JB HAIRMPIRE" },
      { name: "description", content: "Read what our clients are saying about JB HAIRMPIRE wigs, equipment and treatments." },
    ],
  }),
  component: Reviews,
});

const reviews = [
  { n: "Amara K.", p: "Noir Silk 26\"", t: "The most beautiful unit I've ever owned. Glueless and impossibly natural.", r: 5 },
  { n: "Imani O.", p: "Honey Wave 24\"", t: "Custom colour came out gorgeous. Compliments every single day.", r: 5 },
  { n: "Sade A.", p: "Atelier Curling Wand", t: "Quiet, fast, perfect curls. My salon is jealous.", r: 5 },
  { n: "Maya L.", p: "Gold Elixir Hair Oil", t: "A few drops and my ends look brand new. Holy grail.", r: 5 },
  { n: "Zara P.", p: "Cocoa Curl 22\"", t: "Bouncy, full and the curl pattern holds beautifully.", r: 4 },
  { n: "Naomi R.", p: "Velvet Repair Mask", t: "After one use my hair felt like silk. Worth every penny.", r: 5 },
];

function Reviews() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10 py-24 md:py-32">
      <div className="text-center mb-16">
        <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Word of mouth</span>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Reviews</h1>
        <div className="gold-line w-24 mx-auto mt-6" />
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-gold text-gold" />
            ))}
          </div>
          <span>4.9 from 1,248 reviews</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r.n} className="bg-cream p-8 flex flex-col">
            <div className="flex">
              {Array.from({ length: r.r }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-gold text-gold" />
              ))}
            </div>
            <p className="mt-5 text-sm text-foreground/80 leading-relaxed flex-1">"{r.t}"</p>
            <div className="mt-6 pt-6 border-t border-border/60">
              <p className="text-sm font-medium">{r.n}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.p}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
