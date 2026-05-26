"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Agents" },
  { href: "/audit", label: "Audit Log" },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem" }}>
      {LINKS.map(({ href, label }) => (
        <Link key={href} href={href} style={{
          color: pathname === href ? "var(--text-primary)" : "var(--text-secondary)",
          transition: "color 0.15s",
          fontWeight: pathname === href ? 500 : 400,
        }}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
