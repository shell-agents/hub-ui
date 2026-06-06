"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface HistoryEntry {
  role: string;
  content: string;
  tool_calls?: unknown[];
  tool_call_id?: string;
  name?: string;
}

interface InvokeResult {
  jsonrpc: string;
  result?: { reply: string; history: HistoryEntry[] };
  error?: { message: string };
}

export default function ChatPage() {
  const { status } = useSession();
  const params = useParams();
  const agentId = params.id as string;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (status !== "authenticated") {
      setError("Sign in with Google to use this agent.");
      return;
    }

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, message: text, history }),
      });
      const data: InvokeResult = await res.json();

      if (data.error) {
        setError(data.error.message);
      } else if (data.result) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.result!.reply }]);
        setHistory(data.result.history);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, status, agentId, history]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (status === "loading") return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "1rem 1.5rem",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-surface)",
        flexShrink: 0,
      }}>
        <Link href={`/agents/${agentId}`} style={{ color: "var(--text-muted)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          ←
        </Link>
        <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />
        <code style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{agentId}</code>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "auto" }}>
          {messages.length > 0 ? `${Math.ceil(messages.length / 2)} turn${messages.length > 2 ? "s" : ""}` : "New conversation"}
        </span>
        {messages.length > 0 && (
          <button
            onClick={() => { setMessages([]); setHistory([]); setError(null); }}
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "5px",
              padding: "3px 8px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}>
        {messages.length === 0 && (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            color: "var(--text-muted)",
            textAlign: "center",
            paddingTop: "4rem",
          }}>
            <div style={{ fontSize: "2rem" }}>✦</div>
            <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--text-secondary)" }}>
              Chat with {agentId}
            </p>
            <p style={{ fontSize: "0.8125rem", maxWidth: "320px" }}>
              Ask in natural language — "Show my last 10 emails", "Any unread messages from today?",
              "List my recent Drive files"
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div style={{
              maxWidth: "75%",
              padding: "0.75rem 1rem",
              borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
              background: msg.role === "user" ? "var(--accent)" : "var(--bg-raised)",
              border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
              fontSize: "0.9rem",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "0.75rem 1rem",
              borderRadius: "12px 12px 12px 3px",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              display: "flex",
              gap: "5px",
              alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--text-muted)",
                  display: "inline-block",
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5",
            fontSize: "0.875rem",
          }}>
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop: "1px solid var(--border)",
        padding: "1rem 1.5rem",
        background: "var(--bg-surface)",
        flexShrink: 0,
      }}>
        {status === "unauthenticated" && (
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.75rem", textAlign: "center" }}>
            <Link href="/api/auth/signin" style={{ color: "var(--accent)" }}>Sign in with Google</Link> to start chatting
          </p>
        )}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={status === "authenticated" ? "Message the agent… (Enter to send, Shift+Enter for newline)" : "Sign in to chat"}
            disabled={status !== "authenticated" || loading}
            rows={1}
            style={{
              flex: 1,
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "0.625rem 0.875rem",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              lineHeight: "1.5",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              maxHeight: "120px",
              overflowY: "auto",
              opacity: status !== "authenticated" || loading ? 0.5 : 1,
            }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || status !== "authenticated" || loading}
            style={{
              background: input.trim() && status === "authenticated" && !loading ? "var(--accent)" : "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: input.trim() && status === "authenticated" && !loading ? "#fff" : "var(--text-muted)",
              padding: "0.625rem 1.125rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: input.trim() && status === "authenticated" && !loading ? "pointer" : "not-allowed",
              transition: "background 0.15s, color 0.15s",
              whiteSpace: "nowrap",
              height: "38px",
            }}
          >
            {loading ? "…" : "Send"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
