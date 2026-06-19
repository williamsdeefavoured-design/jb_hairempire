import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { formatNGN } from "@/lib/products";

const PAYSTACK_PUBLIC_KEY = "pk_live_3a5912096e3e68022aab31756690a2f67378145e";
// Paystack expects amounts in the smallest unit of the currency.
// For NGN that's kobo (1 NGN = 100 kobo).
const CURRENCY = "NGN";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref?: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("SSR"));
    if (window.PaystackPop) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.paystack.co/v1/inline.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("load error")));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Paystack"));
    document.head.appendChild(s);
  });
}

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Your Bag · JB HAIRMPIRE" },
      {
        name: "description",
        content:
          "Review your wig selections and securely complete checkout with Paystack.",
      },
    ],
  }),
});

function CartPage() {
  const { items, update, remove, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState(user?.email || "");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const shipping = subtotal > 0 ? 7500 : 0;
  const total = subtotal + shipping;
  // NGN → kobo
  const amountMinor = Math.round(total * 100);

  async function handlePay() {
    setError(null);
    if (items.length === 0) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email for your receipt.");
      return;
    }
    setLoading(true);
    try {
      await loadPaystackScript();
      if (!window.PaystackPop) throw new Error("Paystack failed to load");

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: amountMinor,
        currency: CURRENCY,
        metadata: {
          cart: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            qty: i.quantity,
          })),
        },
        callback: (response) => {
          // Verify on our server before fulfilling
          fetch("/api/paystack-verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reference: response.reference,
              expectedAmount: amountMinor,
              expectedCurrency: CURRENCY,
            }),
          })
            .then((r) => r.json())
            .then((data: { ok: boolean; error?: string }) => {
              if (data.ok) {
                setSuccess(response.reference);
                clear();
              } else {
                setError(data.error ?? "Verification failed.");
              }
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setLoading(false));
        },
        onClose: () => {
          setLoading(false);
        },
      });
      handler.openIframe();
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <CheckCircle2 className="h-12 w-12 mx-auto text-foreground" strokeWidth={1} />
        <h1 className="mt-6 text-3xl font-serif">Thank you for your order</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Payment confirmed. Reference:{" "}
          <span className="font-mono text-foreground">{success}</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          A confirmation has been sent to {email}.
        </p>
        <button
          onClick={() => navigate({ to: "/shop" })}
          className="mt-8 px-8 py-3 bg-foreground text-background text-xs uppercase tracking-[0.25em]"
        >
          Continue shopping
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-serif mb-10">Your Bag</h1>

      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-muted-foreground mb-6">Your bag is empty.</p>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[0.25em] border-b border-foreground pb-1"
          >
            Discover the collection
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            {items.map((i) => (
              <div
                key={i.product.id}
                className="flex gap-5 pb-6 border-b border-border/60"
              >
                <div className="w-28 h-36 bg-cream overflow-hidden shrink-0">
                  <img
                    src={i.product.image}
                    alt={i.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between gap-2">
                    <Link
                      to="/product/$id"
                      params={{ id: i.product.id }}
                      className="text-sm font-medium hover:underline"
                    >
                      {i.product.name}
                    </Link>
                    <span className="text-sm">
                      {formatNGN(i.product.price * i.quantity)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize mt-1">
                    {i.product.category}
                  </span>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="inline-flex items-center border border-border">
                      <button
                        onClick={() => update(i.product.id, i.quantity - 1)}
                        className="px-2 py-1.5 hover:bg-cream"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-xs">{i.quantity}</span>
                      <button
                        onClick={() => update(i.product.id, i.quantity + 1)}
                        className="px-2 py-1.5 hover:bg-cream"
                        aria-label="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(i.product.id)}
                      className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="md:col-span-1">
            <div className="bg-cream/40 p-6 space-y-5">
              <h2 className="text-xs uppercase tracking-[0.25em]">Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatNGN(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatNGN(shipping)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border/60 font-medium">
                  <span>Total</span>
                  <span>{formatNGN(total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Email for receipt
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
                />
              </div>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors disabled:opacity-60"
              >
                {loading ? "Processing…" : "Pay with Paystack"}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">
                Secure payment powered by Paystack.
              </p>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
