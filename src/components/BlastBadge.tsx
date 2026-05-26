const BLAST_COLOR: Record<string, string> = {
  none: "var(--blast-none)",
  low: "var(--blast-low)",
  medium: "var(--blast-medium)",
  high: "var(--blast-high)",
  critical: "var(--blast-critical)",
};

export default function BlastBadge({ level }: { level: string }) {
  const color = BLAST_COLOR[level] ?? "var(--text-muted)";
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.3rem",
      background: `${color}18`,
      color,
      border: `1px solid ${color}40`,
      borderRadius: "4px",
      padding: "2px 7px",
      fontSize: "0.6875rem",
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      fontFamily: "monospace",
    }}>
      {level}
    </span>
  );
}
