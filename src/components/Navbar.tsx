import * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Search, Heart, Menu, X, UserCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/lib/wishlist";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/tips", label: "Tips & Guides" },
  { to: "/reviews", label: "Reviews" },
  { to: "/about", label: "About" },
  // { to: "/chat", label: "Concierge" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { count, setOpen } = useCart();
  const { user, openAuthModal } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    navigate({
      to: "/shop",
      search: { category: "all", sort: "featured", search: searchQuery.trim() },
    });
    setSearchQuery("");
  };

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-3 items-center h-20">
          {/* left: nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] uppercase tracking-[0.18em] text-foreground/80">
            {links.slice(0, 4).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* mobile menu button */}
          <button
            className="lg:hidden justify-self-start p-2 -ml-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* center logo */}
          <Link to="/" className="justify-self-center flex items-center gap-3">
            <img src="/jb-logo.svg" alt="JB" className="h-10 w-10" />
            <span className="font-display text-2xl md:text-[28px] tracking-[0.18em] font-semibold">
              JB HAIRMPIRE
            </span>
          </Link>

          {/* right */}
          <div className="flex items-center justify-end gap-5 text-foreground/80">
            <nav className="hidden lg:flex items-center gap-8 mr-2 text-[13px] uppercase tracking-[0.18em]">
              {links.slice(4).map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="hover:text-foreground transition-colors"
                  activeProps={{ className: "text-foreground" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative hover:text-foreground transition-colors hidden sm:block"
            >
              <Heart className="h-4.5 w-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => openAuthModal("login")}
              aria-label={user ? "My account" : "Sign in"}
              className="navbar-user-btn hover:text-foreground"
            >
              <UserCircle2 className="h-4.5 w-4.5" />
              {user && <span className="navbar-user-dot" />}
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Cart"
              className="relative hover:text-foreground transition-colors"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-sm bg-background p-8 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <span className="font-display tracking-[0.3em] text-lg">JB HAIRMPIRE</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-5 text-lg uppercase tracking-[0.2em]">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-foreground/80 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-6 border-t border-border/60">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal("login");
                }}
                className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition-colors cursor-pointer w-full text-left"
              >
                <div className="relative flex items-center justify-center">
                  <UserCircle2 className="h-5 w-5" />
                  {user && <span className="navbar-user-dot" />}
                </div>
                <span>{user ? "My Account" : "Sign In / Register"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md transition-all duration-300">
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-6 right-6 p-2 text-foreground/75 hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="w-full max-w-2xl px-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, wigs, collections..."
                autoFocus
                className="w-full bg-transparent border-b-2 border-border/80 focus:border-foreground py-4 text-2xl font-display outline-none transition-colors pr-10"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:scale-110 transition-transform cursor-pointer"
                aria-label="Submit search"
              >
                <Search className="h-6 w-6" />
              </button>
            </form>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground text-center animate-pulse">
              Press Enter to search
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
