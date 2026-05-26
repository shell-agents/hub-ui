import { Suspense } from "react";
import AgentCard from "@/components/AgentCard";
import SkeletonCard from "@/components/SkeletonCard";
import type { Agent } from "@/types/agent";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Agents" };

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

function EmptyState() {
  return (
    <div style={{
      border: "1px dashed var(--border)",
      borderRadius: "10px",
      padding: "4rem 2rem",
      textAlign: "center",
      color: "var(--text-muted)",
    }}>
      <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--text-secondary)" }}>No agents registered</p>
      <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
        Register an agent via <code style={{ color: "var(--text-secondary)" }}>POST /agents</code> on the controller.
      </p>
    </div>
  );
}

async function AgentGrid() {
  const agents = await getAgents();
  if (agents.length === 0) return <EmptyState />;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
      {agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
    </div>
  );
}

function AgentGridSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
      {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <div>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Agents</h1>
        <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          All agents registered with the controller.
        </p>
      </div>
      <Suspense fallback={<AgentGridSkeleton />}>
        <AgentGrid />
      </Suspense>
    </div>
  );
}
