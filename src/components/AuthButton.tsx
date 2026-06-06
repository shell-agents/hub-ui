"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div style={{
        width: "80px",
        height: "28px",
        background: "var(--bg-raised)",
        borderRadius: "5px",
        border: "1px solid var(--border)",
      }} />
    );
  }

  if (session) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
          {session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          style={{
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "5px",
            padding: "4px 12px",
            fontSize: "0.8125rem",
            color: "var(--text-secondary)",
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      style={{
        background: "var(--accent)",
        border: "none",
        borderRadius: "5px",
        padding: "5px 14px",
        fontSize: "0.8125rem",
        color: "#fff",
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      Sign in with Google
    </button>
  );
}
