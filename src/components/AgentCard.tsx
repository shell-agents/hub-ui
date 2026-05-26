import Link from "next/link";
import BlastBadge from "./BlastBadge";
import type { Agent } from "@/types/agent";

export default function AgentCard({ agent }: { agent: Agent }) {
  const maxBlast = agent.capabilities.reduce((worst, cap) => {
    const order = ["none", "low", "medium", "high", "critical"];
    return order.indexOf(cap.blast) > order.indexOf(worst) ? cap.blast : worst;
  }, "none" as string);

  return (
    <Link href={`/agents/${agent.id}`} style={{ display: "block", textDecoration: "none" }}>
      <div style={{
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "1.25rem",
        background: "var(--bg-surface)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "-0.01em" }}>{agent.id}</h2>
            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "2px", display: "block" }}>
              {agent.capabilities.length} {agent.capabilities.length === 1 ? "capability" : "capabilities"}
            </span>
          </div>
          <BlastBadge level={maxBlast} />
        </div>

        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {agent.capabilities.map((cap) => (
            <li key={cap.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.375rem 0.625rem",
              background: "var(--bg-raised)",
              borderRadius: "5px",
              fontSize: "0.8125rem",
            }}>
              <code style={{ color: "var(--text-secondary)" }}>{cap.id}</code>
              <BlastBadge level={cap.blast} />
            </li>
          ))}
        </ul>

        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          sandbox: <span style={{ color: "var(--text-secondary)" }}>{agent.sandbox}</span>
        </div>
      </div>
    </Link>
  );
}
