import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send, Sparkles, Trash2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "jb-hairmpire-chat-v1";
const WELCOME: Msg = {
  role: "assistant",
  content:
    "Welcome to JB HAIRMPIRE. I'm your personal hair assistant — here to help you find the perfect wig, recommend treatments, or answer any questions about our luxury collection. How may I assist you today?",
};

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Hair Assitant — JB HAIRMPIRE" },
      {
        name: "description",
        content:
          "Chat with the JB HAIRMPIRE hair assistant for personalized wig recommendations, styling tips and product advice.",
      },
      { property: "og:title", content: "Hair Assistant — JB HAIRMPIRE" },
      {
        property: "og:description",
        content: "Personal AI-powered hair advisor for luxury wigs and treatments.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [messages, setMessages] = React.useState<Msg[]>([WELCOME]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  // Load from localStorage on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {
      /* ignore */
    }
    inputRef.current?.focus();
  }, []);

  // Persist
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // Auto-scroll
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as { content?: string; error?: string };
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setMessages([...next, { role: "assistant", content: data.content || "" }]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function clearChat() {
    setMessages([WELCOME]);
    setError(null);
    inputRef.current?.focus();
  }

  return (
    <div className="bg-cream/30 min-h-[calc(100vh-5rem)]">
      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <Sparkles className="h-3 w-3" /> AI assistant
          </div>
          <h1 className="font-display text-4xl md:text-5xl mt-4">Hair assistant</h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto">
            Ask for wig recommendations, styling advice, treatment guidance — your personal hair advisor, available anytime.
          </p>
        </div>

        {/* Chat panel */}
        <div className="bg-background border border-border/60 shadow-sm flex flex-col h-[70vh] min-h-130">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 md:px-8 py-6 space-y-5">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && (
              <div className="flex gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <span className="animate-pulse">Thinking</span>
                <span className="inline-flex gap-0.5">
                  <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: "120ms" }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: "240ms" }}>.</span>
                </span>
              </div>
            )}
            {error && (
              <div className="text-xs text-destructive border border-destructive/30 bg-destructive/5 px-3 py-2">
                {error}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border/60 p-4 md:p-5">
            <div className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Ask about wigs, treatments, styling…"
                className="flex-1 resize-none bg-cream/40 border border-border/60 px-4 py-3 text-sm focus:outline-none focus:border-foreground/40 max-h-40"
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="bg-foreground text-background h-11 w-11 grid place-items-center disabled:opacity-40 hover:bg-foreground/90 transition-colors shrink-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span>Press Enter to send · Shift+Enter for newline</span>
              <button
                onClick={clearChat}
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Trash2 className="h-3 w-3" /> Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  if (role === "assistant") {
    return (
      <div className="flex gap-3">
        <div className="h-8 w-8 shrink-0 rounded-full bg-foreground text-background grid place-items-center text-[10px] tracking-[0.2em] font-medium">
          JB
        </div>
        <div className="flex-1 text-sm leading-relaxed whitespace-pre-wrap pt-1">{content}</div>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] bg-foreground text-background px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}
