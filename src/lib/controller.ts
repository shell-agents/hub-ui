import type { Agent } from "@/types/agent";

const CONTROLLER = process.env.CONTROLLER_URL ?? "http://localhost:3001";

export async function getAgent(id: string): Promise<Agent> {
  const res = await fetch(`${CONTROLLER}/agents?id=${encodeURIComponent(id)}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Agent not found: ${id}`);
  return res.json();
}
