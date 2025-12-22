
import React, { useMemo, useState } from "react";
export default function ComparisonTable({
  items = [],
  specOrder = [],
  specMeta = {},
  currency = "₹",
}) {
  const [onlyDiff, setOnlyDiff] = useState(false);

  // ---------- helpers ----------
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

  function analyzeRow(key) {
    const meta = specMeta[key] || { higherIsBetter: null };
    const vals = items.map((p) => (key === "price" ? p.price : p.specs?.[key]));
    const allEqual = vals.every((v) => String(v) === String(vals[0]));
    let bestIdx = new Set();

    if (meta.higherIsBetter === null || items.length < 2) {
      return { allEqual, bestIdx };
    }
    const nums = vals.map(asNumber);
    if (!nums.every((n) => !Number.isNaN(n))) return { allEqual, bestIdx };

    const target = meta.higherIsBetter ? Math.max(...nums) : Math.min(...nums);
    nums.forEach((n, i) => {
      if (n === target) bestIdx.add(i);
    });
    return { allEqual, bestIdx };
  }

  async function copyTSV() {
    const headers = ["Feature", ...items.map((p) => p.name)];
    const rows = specOrder.map((k) => {
      const vals = items.map((p) => (k === "price" ? `${currency}${p.price}` : display(p.specs?.[k])));
      return [specMeta[k]?.label || k, ...vals].join("\t");
    });
    const tsv = [headers.join("\t"), ...rows].join("\n");
    try {
      await navigator.clipboard.writeText(tsv);
      alert("Copied! Paste into Sheets/Excel.");
    } catch {
      alert("Copy failed. Select the table and copy manually.");
    }
  }

  // ---------- styles ----------
  const S = {
    wrap: {
      marginTop: 12,
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      background: "white",
      overflowX: "auto",
      boxShadow: "0 10px 20px rgba(2,6,23,0.04)",
    },
    bar: {
      margin: "0 0 10px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
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
    },
    subtle: {
      padding: "10px 14px",
      background: "white",
      color: "#0f172a",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      fontWeight: 600,
      cursor: "pointer",
    },
    table: {
      width: "100%",
      minWidth: 720,
      borderCollapse: "separate",
      borderSpacing: 0,
      fontFamily:
        "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      color: "#0f172a",
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
    diff: { background: "#eff6ff" },
    best: { outline: "2px solid #2563eb", outlineOffset: "-2px", borderRadius: 8 },
    empty: {
      marginTop: 12,
      padding: 14,
      border: "1px solid #e2e8f0",
      borderRadius: 12,
      background: "white",
      color: "#475569",
    },
  };

  if (!items?.length || items.length < 2) {
    return <div style={S.empty}>Provide at least two items to compare.</div>;
  }

  // ---------- render ----------
  return (
    <div>
      {/* toolbar */}
      <div style={S.bar}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={onlyDiff}
            onChange={(e) => setOnlyDiff(e.target.checked)}
          />
          Show only differences
        </label>
        <button style={S.btn} onClick={copyTSV}>Copy table</button>
      </div>

      {/* table */}
      <div style={S.wrap}>
        <table style={S.table} aria-label="Comparison table">
          <thead>
            <tr>
              <th style={S.thFeature}>Feature</th>
              {items.map((p) => (
                <th key={p.id} style={S.th}>
                  {p.name}
                  {typeof p.price !== "undefined" && (
                    <div style={{ color: "#475569", fontWeight: 500 }}>
                      {currency}{p.price}/mo
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specOrder.map((key) => {
              const meta = specMeta[key] || { label: key, higherIsBetter: null };
              const { allEqual, bestIdx } = analyzeRow(key);
              if (onlyDiff && allEqual) return null;

              return (
                <tr key={key}>
                  <td style={S.tdFeature}>{meta.label}</td>
                  {items.map((p, i) => {
                    const v = key === "price" ? p.price : p.specs?.[key];
                    const cellStyle = {
                      ...S.td,
                      ...(allEqual ? null : S.diff),
                      ...(bestIdx.has(i) ? S.best : null),
                    };
                    return <td key={p.id + key} style={cellStyle}>{key === "price" ? `${currency}${v}` : display(v)}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========================= DEMO USAGE =========================
   Remove below from production; keep if you want a ready-to-run page.
*/
export function ComparisonTableDemo() {
  const items = useMemo(
    () => [
      { id: "starter", name: "Starter", price: 299, specs: { users: 3, storageGb: 10, projects: 5, sso: false, uptime: "99.5%" } },
      { id: "pro", name: "Pro", price: 799, specs: { users: 25, storageGb: 200, projects: "Unlimited", sso: true, uptime: "99.9%" } },
      { id: "business", name: "Business", price: 1499, specs: { users: 100, storageGb: 1024, projects: "Unlimited", sso: true, uptime: "99.99%" } },
    ],
    []
  );

  const specOrder = ["price", "users", "storageGb", "projects", "sso", "uptime"];
  const specMeta = {
    price: { label: "Price (₹/mo)", higherIsBetter: false },
    users: { label: "Users", higherIsBetter: true },
    storageGb: { label: "Storage (GB)", higherIsBetter: true },
    projects: { label: "Projects", higherIsBetter: true },
    sso: { label: "SSO", higherIsBetter: true },
    uptime: { label: "Uptime SLA", higherIsBetter: null },
  };

  const styles = {
    page: { minHeight: "100vh", background: "#f8fafc", padding: 20, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif", color: "#0f172a" },
    title: { fontSize: 22, fontWeight: 800, marginBottom: 10 },
  };

  return (
    <div style={styles.page}>
      <div style={styles.title}>Plan comparison</div>
      <ComparisonTable items={items} specOrder={specOrder} specMeta={specMeta} currency="₹" />
    </div>
  );
}
