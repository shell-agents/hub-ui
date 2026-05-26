import type { Agent } from "@/types/agent";

const BLAST_COLORS: Record<string, string> = {
  none: "#22c55e",
  low: "#84cc16",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

export default function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "1.25rem",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{agent.id}</h2>
        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>sandbox: {agent.sandbox}</span>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {agent.capabilities.map((cap) => (
          <li key={cap.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
            <span style={{ fontFamily: "monospace" }}>{cap.id}</span>
            <span style={{
              background: BLAST_COLORS[cap.blast] + "22",
              color: BLAST_COLORS[cap.blast],
              border: `1px solid ${BLAST_COLORS[cap.blast]}`,
              borderRadius: "4px",
              padding: "0 0.4rem",
              fontSize: "0.75rem",
              fontWeight: 500,
            }}>{cap.blast}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
