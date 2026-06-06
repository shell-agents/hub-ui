import type { Agent } from "@/types/agent";

const CONTROLLER = process.env.CONTROLLER_URL ?? "http://localhost:3001";

export async function getAgent(id: string): Promise<Agent> {
  const res = await fetch(`${CONTROLLER}/agents?id=${encodeURIComponent(id)}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Agent not found: ${id}`);
  return res.json();
}

export async function invokeCapability(
  agentId: string,
  capability: string,
  args: Record<string, unknown>,
  accessToken: string
): Promise<unknown> {
  const res = await fetch(`${CONTROLLER}/invoke`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method: "agent.invoke",
      params: { agent: agentId, capability, args },
      auth: { token: accessToken },
    }),
  });
  return res.json();
}
