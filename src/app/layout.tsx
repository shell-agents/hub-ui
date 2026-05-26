import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "shell-agents hub",
  description: "Browse and invoke your shell agents",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f9fafb", color: "#111827" }}>
        <header style={{ borderBottom: "1px solid #e5e7eb", padding: "1rem 2rem", background: "#fff", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.01em" }}>shell-agents</span>
          <span style={{ color: "#9ca3af", fontSize: "0.875rem" }}>hub</span>
        </header>
        <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
