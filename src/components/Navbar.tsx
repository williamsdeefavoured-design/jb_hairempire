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

  // Close drawer on Escape key
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMobileOpen(false); setSearchOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Use relative + flex so the brand name can be absolutely centered */}
        <div className="relative flex items-center justify-between h-20">

          {/* left: hamburger (mobile) or desktop nav */}
          <div className="flex items-center">
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span
                style={{
                  display: "inline-block",
                  transition: "transform 0.25s ease",
                  transform: mobileOpen ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </span>
            </button>
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
          </div>

          {/* center: absolutely centered brand name — never competes for space */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 pointer-events-auto"
          >
            <span className="font-display text-[16px] sm:text-2xl md:text-[28px] tracking-[0.15em] sm:tracking-[0.18em] font-semibold whitespace-nowrap">
              JB HAIRMPIRE
            </span>
          </Link>

          {/* right: icons */}
          <div className="flex items-center gap-3 sm:gap-5 text-foreground/80">
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

    </header>

      {/* ── Mobile Drawer — rendered OUTSIDE <header> so its z-index is not capped ── */}
      <div
        className="fixed inset-0 z-[9999] lg:hidden"
        style={{ pointerEvents: mobileOpen ? "auto" : "none" }}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-foreground/35 backdrop-blur-sm"
          style={{ transition: "opacity 0.3s ease", opacity: mobileOpen ? 1 : 0 }}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-background shadow-2xl flex flex-col"
          style={{
            transition: "transform 0.35s cubic-bezier(.2,.7,.2,1)",
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-7 py-6 border-b border-border/50">
            <span className="font-display tracking-[0.25em] text-base font-semibold">MENU</span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav links with staggered entrance */}
          <nav className="flex flex-col px-7 py-6 gap-1 flex-1 overflow-y-auto">
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="nav-mobile-link"
                activeProps={{ className: "nav-mobile-link nav-mobile-link--active" }}
                style={{
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? "translateX(0)" : "translateX(-14px)",
                  transition: `opacity 0.35s ease ${60 + i * 40}ms, transform 0.35s ease ${60 + i * 40}ms`,
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-7 py-6 border-t border-border/50 flex flex-col gap-4">
            <Link
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-foreground/75 hover:text-foreground transition-colors"
            >
              <Heart className="h-4.5 w-4.5" />
              <span>Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}</span>
            </Link>
            <button
              onClick={() => { setMobileOpen(false); openAuthModal("login"); }}
              className="flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-foreground/75 hover:text-foreground transition-colors w-full text-left"
            >
              <div className="relative flex items-center justify-center">
                <UserCircle2 className="h-4.5 w-4.5" />
                {user && <span className="navbar-user-dot" />}
              </div>
              <span>{user ? "My Account" : "Sign In / Register"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-md">
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
    </>
  );
}
