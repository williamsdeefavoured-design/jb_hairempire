import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — JB HAIRMPIRE" },
      { name: "description", content: "Reach the JB HAIRMPIRE concierge. We're here to help with sizing, styling and orders." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10 py-24 md:py-32">
      <div className="text-center mb-16">
        <span className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Concierge</span>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Contact</h1>
        <div className="gold-line w-24 mx-auto mt-6" />
        <p className="mt-6 text-foreground/70 max-w-md mx-auto">
          A member of our team will reply within 24 hours.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {[
            { l: "Name", t: "text" },
            { l: "Email", t: "email" },
            { l: "Subject", t: "text" },
          ].map((f) => (
            <div key={f.l}>
              <label className="block text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                {f.l}
              </label>
              <input
                type={f.t}
                className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-foreground transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Message
            </label>
            <textarea
              rows={5}
              className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-foreground transition-colors resize-none"
            />
          </div>
          <button className="bg-foreground text-background px-10 py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors">
            Send message
          </button>
        </form>

        <div className="space-y-8 md:border-l md:border-border md:pl-12">
          {[
            { I: Mail, l: "Email", v: "concierge@hairmpire.com" },
            { I: Phone, l: "Phone", v: "+234 704 489 1890" },
            { I: MapPin, l: "Atelier", v: "Ado, Ekiti, Nigeria" },
            { I: MessageCircle, l: "Live chat", v: "Mon — Fri, 9am – 7pm EST" },
          ].map((c) => (
            <div key={c.l} className="flex items-start gap-5">
              <div className="h-10 w-10 grid place-items-center bg-cream">
                <c.I className="h-4 w-4 text-gold" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{c.l}</p>
                <p className="mt-1 text-sm">{c.v}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
