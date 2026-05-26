import type { Metadata } from "next";
import BlastBadge from "@/components/BlastBadge";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Audit Log" };

interface AuditEvent {
  ts: string;
  agent: string;
  capability: string;
  blast: string;
  requestId: string | number;
  outcome: "allowed" | "denied" | "pending_confirm";
  prev: string;
}

const OUTCOME_COLOR: Record<string, string> = {
  allowed: "var(--blast-none)",
  denied: "var(--blast-critical)",
  pending_confirm: "var(--blast-medium)",
};

async function getAuditLog(): Promise<AuditEvent[]> {
  const controller = process.env.CONTROLLER_URL ?? "http://localhost:3001";
  try {
    const res = await fetch(`${controller}/audit`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.log ?? [];
  } catch {
    return [];
  }
}

export default async function AuditPage() {
  const log = await getAuditLog();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <div>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Audit Log</h1>
        <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Hash-chained record of every invocation through the controller.
        </p>
      </div>

      {log.length === 0 ? (
        <div style={{
          border: "1px dashed var(--border)",
          borderRadius: "10px",
          padding: "4rem 2rem",
          textAlign: "center",
          color: "var(--text-muted)",
        }}>
          <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--text-secondary)" }}>No events yet</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>Invocations will appear here as agents are called.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {[...log].reverse().map((event, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr 1fr auto auto",
              alignItems: "center",
              gap: "1rem",
              padding: "0.75rem 1rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "7px",
              fontSize: "0.8125rem",
            }}>
              <span style={{ color: "var(--text-muted)", fontFamily: "monospace", fontSize: "0.75rem" }}>
                {new Date(event.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
              <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{event.agent}</span>
              <code style={{ color: "var(--text-primary)" }}>{event.capability}</code>
              <BlastBadge level={event.blast} />
              <span style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: OUTCOME_COLOR[event.outcome] ?? "var(--text-muted)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}>
                {event.outcome.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
