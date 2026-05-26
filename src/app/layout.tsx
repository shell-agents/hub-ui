import type { Metadata } from "next";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "shell-agents hub", template: "%s · shell-agents" },
  description: "Browse and invoke your shell agents",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <header style={{
            borderBottom: "1px solid var(--border)",
            padding: "0 2rem",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "rgba(10,10,10,0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 10,
          }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "-0.02em" }}>shell-agents</span>
              <span style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "1px 6px",
                fontSize: "0.6875rem",
                color: "var(--text-muted)",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}>hub</span>
            </Link>
            <NavLinks />
          </header>
          <main style={{ flex: 1, maxWidth: "1024px", width: "100%", margin: "0 auto", padding: "2.5rem 2rem" }}>
            {children}
          </main>
          <footer style={{
            borderTop: "1px solid var(--border)",
            padding: "1.25rem 2rem",
            textAlign: "center",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
          }}>
            shell-agents · spec v0.1 · Apache-2.0
          </footer>
        </div>
      </body>
    </html>
  );
}
