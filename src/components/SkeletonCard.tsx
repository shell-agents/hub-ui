export default function SkeletonCard() {
  return (
    <div style={{
      border: "1px solid var(--border)",
      borderRadius: "8px",
      padding: "1.25rem",
      background: "var(--bg-surface)",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ width: "120px", height: "15px", background: "var(--bg-raised)", borderRadius: "4px" }} />
          <div style={{ width: "80px", height: "12px", background: "var(--bg-raised)", borderRadius: "4px" }} />
        </div>
        <div style={{ width: "52px", height: "20px", background: "var(--bg-raised)", borderRadius: "4px" }} />
      </div>
      {[1, 2].map((i) => (
        <div key={i} style={{ height: "32px", background: "var(--bg-raised)", borderRadius: "5px" }} />
      ))}
    </div>
  );
}
