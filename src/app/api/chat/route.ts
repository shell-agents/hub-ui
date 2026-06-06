import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const CONTROLLER = process.env.CONTROLLER_URL ?? "http://localhost:3001";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { agentId, message, history } = await req.json() as {
    agentId: string;
    message: string;
    history: unknown[];
  };

  const res = await fetch(`${CONTROLLER}/invoke`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method: "agent.invoke",
      params: { agent: agentId, capability: "chat", args: { message, history } },
      auth: { token: session.accessToken },
    }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.ok ? 200 : res.status });
}
