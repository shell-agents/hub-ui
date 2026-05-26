export interface Capability {
  id: string;
  blast: "none" | "low" | "medium" | "high" | "critical";
}

export interface Agent {
  id: string;
  endpoint: string;
  capabilities: Capability[];
  sandbox: "required" | "recommended" | "optional";
}
