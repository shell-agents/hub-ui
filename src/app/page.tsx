import AgentCard from "@/components/AgentCard";
import type { Agent } from "@/types/agent";

async function getAgents(): Promise<Agent[]> {
  const controller = process.env.CONTROLLER_URL ?? "http://localhost:3001";
  try {
    const res = await fetch(`${controller}/agents`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const agents = await getAgents();

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>Agents</h1>
        <p style={{ margin: "0.25rem 0 0", color: "#6b7280", fontSize: "0.9rem" }}>
          {agents.length} agent{agents.length !== 1 ? "s" : ""} registered
        </p>
      </div>

      {agents.length === 0 ? (
        <div style={{ border: "1px dashed #d1d5db", borderRadius: "8px", padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
          <p style={{ margin: 0 }}>No agents registered yet.</p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem" }}>
            Register an agent via <code>POST /agents</code> on the controller.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}
