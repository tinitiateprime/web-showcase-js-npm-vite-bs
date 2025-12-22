// File: src/ComparisonPage.jsx
import React, { useMemo, useState } from "react";

export default function ComparisonPage() {
  // ---------- Demo catalog (replace with your API later) ----------
  // We'll compare "plans" with consistent spec keys for clean diffs
  const catalog = useMemo(
    () => [
      {
        id: "starter",
        name: "Starter",
        badge: "Popular for beginners",
        price: 299,
        specs: {
          users: 3,
          storageGb: 10,
          projects: 5,
          support: "Email (48h)",
          sso: false,
          auditLogs: false,
          uptime: "99.5%",
          onboarding: "Self-serve",
        },
      },
      {
        id: "pro",
        name: "Pro",
        badge: "Best value",
        price: 799,
        specs: {
          users: 25,
          storageGb: 200,
          projects: "Unlimited",
          support: "Email + Chat (8h)",
          sso: true,
          auditLogs: true,
          uptime: "99.9%",
          onboarding: "Guided session",
        },
      },
      {
        id: "business",
        name: "Business",
        badge: "For teams",
        price: 1499,
        specs: {
          users: 100,
          storageGb: 1024,
          projects: "Unlimited",
          support: "24/7 Priority (2h)",
          sso: true,
          auditLogs: true,
          uptime: "99.99%",
          onboarding: "Dedicated manager",
        },
      },
      {
        id: "enterprise",
        name: "Enterprise",
        badge: "Custom & secure",
        price: 3999,
        specs: {
          users: "Unlimited",
          storageGb: "Unlimited",
          projects: "Unlimited",
          support: "Dedicated TAM (1h)",
          sso: true,
          auditLogs: true,
          uptime: "99.99% + credits",
          onboarding: "Onsite/Custom",
        },
      },
    ],
    []
  );

  // ---------- Spec metadata (labels & scoring for "best" highlight) ----------
  // higherIsBetter: numbers only; for price, lower is better
  const specMeta = {
    price: { label: "Price (₹/mo)", higherIsBetter: false },
    users: { label: "Users", higherIsBetter: true },
    storageGb: { label: "Storage (GB)", higherIsBetter: true },
    projects: { label: "Projects", higherIsBetter: true },
    support: { label: "Support", higherIsBetter: null }, // non-numeric
    sso: { label: "SSO", higherIsBetter: true },
    auditLogs: { label: "Audit logs", higherIsBetter: true },
    uptime: { label: "Uptime SLA", higherIsBetter: null },
    onboarding: { label: "Onboarding", higherIsBetter: null },
  };

  // ---------- State ----------
  const [selected, setSelected] = useState(["pro", "business"]); // preselect 2
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [query, setQuery] = useState("");
  const maxCompare = 4;

  // ---------- Derived ----------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.badge.toLowerCase().includes(q) ||
        String(p.price).includes(q)
    );
  }, [catalog, query]);

  const selectedItems = selected
    .map((id) => catalog.find((p) => p.id === id))
    .filter(Boolean);

  // Build the full ordered list of spec keys to render
  const specOrder = [
    "price",
    "users",
    "storageGb",
    "projects",
    "support",
    "sso",
    "auditLogs",
    "uptime",
    "onboarding",
  ];

  // Helpers
  function asNumber(val) {
    if (val === "Unlimited") return Number.POSITIVE_INFINITY;
    if (typeof val === "number") return val;
    const m = String(val).match(/[\d.]+/g);
    return m ? Number(m.join("")) : NaN;
  }
  function display(val) {
    if (val === true) return "Yes";
    if (val === false) return "No";
    if (val === Number.POSITIVE_INFINITY) return "Unlimited";
    return String(val);
  }

  // For each spec row, compute if all equal & which item(s) are "best"
  function analyzeRow(key) {
    const meta = specMeta[key] || { higherIsBetter: null };
    const vals = selectedItems.map((p) =>
      key === "price" ? p.price : p.specs[key]
    );
    const allEqual = vals.every((v) => String(v) === String(vals[0]));
    let bestIdx = new Set();

    if (meta.higherIsBetter === null || selectedItems.length < 2) {
      return { allEqual, bestIdx };
    }

    const nums = vals.map(asNumber);
    const comparable = nums.every((n) => !Number.isNaN(n));
    if (!comparable) return { allEqual, bestIdx };

    const target = meta.higherIsBetter
      ? Math.max(...nums)
      : Math.min(...nums);

    nums.forEach((n, i) => {
      if (n === target) bestIdx.add(i);
    });
    return { allEqual, bestIdx };
  }

  // ---------- Actions ----------
  function toggleSelect(id) {
    setSelected((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= maxCompare) return cur; // cap
      return [...cur, id];
    });
  }
  function resetSelection() {
    setSelected([]);
  }
  async function copyComparison() {
    const headers = ["Feature", ...selectedItems.map((p) => p.name)];
    const rows = specOrder.map((k) => {
      const vals = selectedItems.map((p) =>
        k === "price" ? p.price : p.specs[k]
      );
      return [specMeta[k].label, ...vals.map(display)].join("\t");
    });
    const text = [headers.join("\t"), ...rows].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("Comparison copied to clipboard (TSV). Paste into Sheets/Excel.");
    } catch {
      alert("Copy failed. Select the table and copy manually.");
    }
  }

  // ---------- Styles ----------
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f8fafc",
      color: "#0f172a",
      fontFamily:
        "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    container: { maxWidth: 1120, margin: "0 auto", padding: "24px 20px" },

    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      flexWrap: "wrap",
      marginBottom: 12,
    },
    brand: { display: "flex", alignItems: "center", gap: 10, fontWeight: 800 },
    brandMark: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background:
        "linear-gradient(135deg, rgba(59,130,246,1) 0%, rgba(14,165,233,1) 100%)",
      boxShadow: "0 6px 16px rgba(59,130,246,0.35)",
    },

    searchWrap: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flex: "1 1 420px",
      minWidth: 300,
      background: "white",
      border: "1px solid #e2e8f0",
      padding: 8,
      borderRadius: 14,
    },
    input: {
      flex: 1,
      border: "1px solid #cbd5e1",
      borderRadius: 10,
      padding: "10px 12px",
      outline: "none",
      fontSize: 14,
      background: "white",
    },
    btn: {
      padding: "10px 14px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: 10,
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 10px 18px rgba(37,99,235,0.22)",
      whiteSpace: "nowrap",
    },
    subtleBtn: {
      padding: "10px 14px",
      background: "white",
      color: "#0f172a",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      fontWeight: 600,
      cursor: "pointer",
      whiteSpace: "nowrap",
    },

    // Catalog grid
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: 14,
      marginTop: 12,
    },
    card: {
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 10px 20px rgba(2,6,23,0.04)",
      display: "grid",
      gap: 8,
    },
    badge: {
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: 999,
      border: "1px solid #e2e8f0",
      background: "#f8fafc",
      fontSize: 12,
      color: "#475569",
      width: "fit-content",
    },
    price: { fontSize: 20, fontWeight: 800 },
    selectRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      marginTop: 4,
    },

    // Compare toolbar
    toolbar: {
      marginTop: 14,
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #e2e8f0",
      background: "white",
      fontSize: 12,
    },
    chipBtn: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontSize: 14,
      lineHeight: 1,
      color: "#64748b",
    },
    switchRow: { display: "flex", alignItems: "center", gap: 8 },

    // Table
    tableWrap: {
      marginTop: 16,
      overflowX: "auto",
      borderRadius: 14,
      border: "1px solid #e2e8f0",
      background: "white",
      boxShadow: "0 10px 20px rgba(2,6,23,0.04)",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      minWidth: 720,
    },
    thFeature: {
      position: "sticky",
      left: 0,
      zIndex: 2,
      background: "white",
      textAlign: "left",
      padding: "12px 14px",
      borderBottom: "1px solid #e2e8f0",
      borderRight: "1px solid #e2e8f0",
      minWidth: 200,
      fontWeight: 800,
    },
    th: {
      textAlign: "left",
      padding: "12px 14px",
      borderBottom: "1px solid #e2e8f0",
      minWidth: 180,
      fontWeight: 800,
    },
    tdFeature: {
      position: "sticky",
      left: 0,
      zIndex: 1,
      background: "white",
      padding: "12px 14px",
      borderTop: "1px solid #f1f5f9",
      borderRight: "1px solid #f1f5f9",
      fontWeight: 600,
    },
    td: {
      padding: "12px 14px",
      borderTop: "1px solid #f1f5f9",
      verticalAlign: "top",
    },
    diff: { background: "#eff6ff" }, // highlight differences
    best: {
      outline: "2px solid #2563eb",
      outlineOffset: "-2px",
      borderRadius: 8,
    },
    empty: {
      marginTop: 14,
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      padding: 18,
      textAlign: "center",
      color: "#475569",
      fontSize: 14,
    },
  };

  // ---------- Render ----------
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.brandMark} />
            <span>Compare Plans</span>
          </div>
          <div style={styles.searchWrap}>
            <input
              type="search"
              placeholder="Search plans…"
              style={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search plans"
            />
            <button style={styles.subtleBtn} onClick={() => setQuery("")}>
              Clear
            </button>
          </div>
        </div>

        {/* Catalog */}
        <div style={styles.grid}>
          {filtered.map((p) => {
            const isSel = selected.includes(p.id);
            const disabled = !isSel && selected.length >= maxCompare;
            return (
              <article key={p.id} style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <strong>{p.name}</strong>
                  <span style={styles.badge}>{p.badge}</span>
                </div>
                <div style={styles.price}>₹{p.price}/mo</div>
                <ul style={{ margin: 0, paddingLeft: 18, color: "#475569", fontSize: 14 }}>
                  <li>{display(p.specs.users)} users</li>
                  <li>{display(p.specs.projects)} projects</li>
                  <li>{display(p.specs.storageGb)} GB storage</li>
                  <li>{p.specs.support}</li>
                </ul>
                <div style={styles.selectRow}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={isSel}
                      disabled={disabled}
                      onChange={() => toggleSelect(p.id)}
                    />
                    {isSel ? "Selected" : disabled ? "Limit reached" : "Compare"}
                  </label>
                  <button
                    style={styles.subtleBtn}
                    onClick={() => {
                      if (!isSel) toggleSelect(p.id);
                      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                    }}
                  >
                    View specs ↓
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Toolbar */}
        <div style={styles.toolbar} aria-live="polite">
          {selectedItems.map((p) => (
            <span key={p.id} style={styles.chip}>
              {p.name}
              <button
                style={styles.chipBtn}
                onClick={() => toggleSelect(p.id)}
                aria-label={`Remove ${p.name}`}
              >
                ×
              </button>
            </span>
          ))}

          <div style={styles.switchRow}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={onlyDiff}
                onChange={(e) => setOnlyDiff(e.target.checked)}
              />
              Show only differences
            </label>
          </div>

          <button style={styles.subtleBtn} onClick={resetSelection}>Reset</button>
          <button
            style={{ ...styles.btn, opacity: selectedItems.length >= 2 ? 1 : 0.6 }}
            disabled={selectedItems.length < 2}
            onClick={copyComparison}
            title="Copy a TSV comparison to paste into Sheets/Excel"
          >
            Copy table
          </button>
        </div>

        {/* Comparison table */}
        {selectedItems.length >= 2 ? (
          <div style={styles.tableWrap}>
            <table style={styles.table} aria-label="Comparison table">
              <thead>
                <tr>
                  <th style={styles.thFeature}>Feature</th>
                  {selectedItems.map((p) => (
                    <th style={styles.th} key={p.id}>
                      {p.name}
                      <div style={{ color: "#475569", fontWeight: 500 }}>₹{p.price}/mo</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specOrder.map((key) => {
                  const meta = specMeta[key];
                  const { allEqual, bestIdx } = analyzeRow(key);
                  if (onlyDiff && allEqual) return null;

                  return (
                    <tr key={key}>
                      <td style={styles.tdFeature}>{meta.label}</td>
                      {selectedItems.map((p, i) => {
                        const val = key === "price" ? p.price : p.specs[key];
                        const show = display(val);
                        const cellStyle = {
                          ...styles.td,
                          ...(allEqual ? null : styles.diff),
                          ...(bestIdx.has(i) ? styles.best : null),
                        };
                        return <td key={p.id + key} style={cellStyle}>{show}</td>;
                      })}
                </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.empty}>
            Select at least two items to see a side-by-side comparison.
          </div>
        )}
      </div>
    </div>
  );
}
