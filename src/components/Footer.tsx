import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-cream border-t border-border/60 mt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-display text-3xl tracking-[0.25em]">JB HAIRMPIRE</h3>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              A modern luxury house for hair. Hand-crafted wigs, professional
              styling tools and elevated treatments — designed for women who
              expect more.
            </p>
            <form
              className="mt-8 flex max-w-md border border-border bg-background"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-transparent text-sm placeholder:text-muted-foreground outline-none"
              />
              <button className="px-5 text-xs uppercase tracking-[0.2em] bg-foreground text-background hover:bg-foreground/90 transition-colors">
                Join
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-5 font-sans font-medium">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-foreground">All products</Link></li>
              <li><Link to="/collections" className="hover:text-foreground">Collections</Link></li>
              <li><a href="/shop?category=wigs" className="hover:text-foreground">Wigs</a></li>
              <li><a href="/shop?category=equipment" className="hover:text-foreground">Equipment</a></li>
              <li><a href="/shop?category=treatment" className="hover:text-foreground">Treatments</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-5 font-sans font-medium">House</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link to="/tips" className="hover:text-foreground">Tips & Guides</Link></li>
              <li><Link to="/reviews" className="hover:text-foreground">Reviews</Link></li>
              <li><a href="#" className="hover:text-foreground">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground tracking-wide">
            © {new Date().getFullYear()} JB HAIRMPIRE — Crafted with intention.
          </p>
          <div className="flex items-center gap-5 text-muted-foreground">
            <a href="#" aria-label="Instagram" className="hover:text-foreground"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-foreground"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-foreground"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
