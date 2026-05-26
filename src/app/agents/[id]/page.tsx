import { notFound } from "next/navigation";
import Link from "next/link";
import BlastBadge from "@/components/BlastBadge";
import type { Agent } from "@/types/agent";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getAgent(id: string): Promise<Agent | null> {
  const controller = process.env.CONTROLLER_URL ?? "http://localhost:3001";
  try {
    const res = await fetch(`${controller}/agents?id=${encodeURIComponent(id)}`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return { title: params.id };
}

export default async function AgentPage({ params }: { params: { id: string } }) {
  const agent = await getAgent(params.id);
  if (!agent) notFound();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <Link href="/" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
          marginBottom: "1.25rem",
        }}>
          ← Agents
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{agent.id}</h1>
          <span style={{
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "2px 8px",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}>sandbox: {agent.sandbox}</span>
        </div>
        <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          {agent.capabilities.length} {agent.capabilities.length === 1 ? "capability" : "capabilities"} · <code style={{ fontSize: "0.8125rem" }}>{agent.endpoint}</code>
        </p>
      </div>

      <div>
        <h2 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          Capabilities
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {agent.capabilities.map((cap) => (
            <div key={cap.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.875rem 1rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "7px",
            }}>
              <code style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{cap.id}</code>
              <BlastBadge level={cap.blast} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
