// File: src/pages/Analytics.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function Analytics() {
  const S = styles();

  // ---------- Demo dataset ----------
  const base = useMemo(() => {
    const today = new Date();
    const days = 90;
    const arr = [];
    let visits = 800, signups = 40;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const w = (Math.sin((i / 8) * Math.PI) + 1) / 2; // wave
      visits = Math.max(200, Math.round(visits + (Math.random() - 0.5) * 80 + w * 40));
      signups = Math.max(5, Math.round(signups + (Math.random() - 0.5) * 6 + w * 3));
      const conv = +(signups / visits * 100).toFixed(2);
      arr.push({ date: d.toISOString().slice(0, 10), visits, signups, conv });
    }
    return arr;
  }, []);

  const [range, setRange] = useState(() => localStorage.getItem("an.range") || "30");
  const [q, setQ] = useState("");
  useEffect(() => { try { localStorage.setItem("an.range", range); } catch {} }, [range]);

  const data = useMemo(() => {
    const n = Number(range);
    return base.slice(-n);
  }, [base, range]);

  // KPIs
  const kpi = useMemo(() => {
    const v = data.reduce((s, r) => (s + r.visits), 0);
    const s = data.reduce((a, r) => (a + r.signups), 0);
    const c = +(s / v * 100).toFixed(2);
    const last = data[data.length - 1] || { visits: 0, signups: 0, conv: 0 };
    return { visits: v, signups: s, conv: c, last };
  }, [data]);

  // Top pages (demo)
  const pages = useMemo(() => [
      { path: "/", views: 12230, bounce: 38 },
      { path: "/training", views: 9820, bounce: 41 },
      { path: "/services", views: 7632, bounce: 35 },
      { path: "/work-experience-program", views: 6122, bounce: 29 },
      { path: "/contact", views: 3101, bounce: 22 },
    ], []);
  const [sort, setSort] = useState({ by: "views", dir: "desc" });
  const sortedPages = useMemo(() => {
    const arr = pages.slice().sort((a, b) => {
      const m = sort.dir === "asc" ? 1 : -1;
      if (a[sort.by] < b[sort.by]) return 1 * m;
      if (a[sort.by] > b[sort.by]) return -1 * m;
      return 0;
    });
    const ql = q.trim().toLowerCase();
    return ql ? arr.filter((p) => p.path.toLowerCase().includes(ql)) : arr;
  }, [pages, sort, q]);

  function exportCSV() {
    const head = ["date", "visits", "signups", "conversion_%"];
    const rows = data.map((r) => [r.date, r.visits, r.signups, r.conv]);
    const csv = [head, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `analytics_last_${range}d.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Chart helpers (SVG) ----------
  function linePath(values, w, h, pad = 8) {
    if (!values.length) return "";
    const xs = values.map((_, i) => i);
    const minY = Math.min(...values), maxY = Math.max(...values);
    const x = (i) => pad + (i * (w - pad * 2)) / (values.length - 1 || 1);
    const y = (v) => pad + (h - pad * 2) * (1 - (v - minY) / (maxY - minY || 1));
    return xs.map((i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(2)} ${y(values[i]).toFixed(2)}`).join(" ");
  }

  // ---------- UI ----------
  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Header */}
        <header style={S.header}>
          <div style={S.brand}>
            <div style={S.brandMark} />
            <div>
              <div style={S.title}>Analytics</div>
              <div style={S.sub}>Traffic • Signups • Conversion</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select value={range} onChange={(e) => setRange(e.target.value)} style={S.input}>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button style={S.btnGhost} onClick={exportCSV}>Export CSV</button>
          </div>
        </header>

        {/* KPIs */}
        <section style={S.kpiRow}>
          <div style={S.kpiCard}>
            <div style={S.kpiValue}>{kpi.visits.toLocaleString()}</div>
            <div style={S.kpiLabel}>Visits</div>
          </div>
          <div style={S.kpiCard}>
            <div style={S.kpiValue}>{kpi.signups.toLocaleString()}</div>
            <div style={S.kpiLabel}>Signups</div>
          </div>
          <div style={S.kpiCard}>
            <div style={S.kpiValue}>{kpi.conv}%</div>
            <div style={S.kpiLabel}>Conversion</div>
          </div>
          <div style={S.kpiCard}>
            <div style={S.kpiValue}>{kpi.last.visits.toLocaleString()}</div>
            <div style={S.kpiLabel}>Today’s visits (sim)</div>
          </div>
        </section>

        {/* Charts */}
        <section style={S.grid}>
          {/* Line chart: visits */}
          <article style={S.card}>
            <div style={S.cardHead}><strong>Visits</strong><span style={S.mutedSmall}>Last {range} days</span></div>
            <svg viewBox="0 0 640 220" style={S.svg}>
              <path d={linePath(data.map((d) => d.visits), 640, 220)} fill="none" stroke="#2563eb" strokeWidth="2.5" />
            </svg>
          </article>

          {/* Line chart: signups */}
          <article style={S.card}>
            <div style={S.cardHead}><strong>Signups</strong><span style={S.mutedSmall}>Last {range} days</span></div>
            <svg viewBox="0 0 640 220" style={S.svg}>
              <path d={linePath(data.map((d) => d.signups), 640, 220)} fill="none" stroke="#10b981" strokeWidth="2.5" />
            </svg>
          </article>

          {/* Conversion donut */}
          <article style={S.card}>
            <div style={S.cardHead}><strong>Conversion Snapshot</strong><span style={S.mutedSmall}>Last {range} days</span></div>
            <div style={{ display: "grid", placeItems: "center", padding: 10 }}>
              <Donut value={kpi.conv} size={180} />
              <div style={S.muted}>Average conversion</div>
            </div>
          </article>

          {/* Top pages */}
          <article style={S.card}>
            <div style={S.cardHead}>
              <strong>Top Pages</strong>
              <input placeholder="Filter by path" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...S.input, width: 180 }} />
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.thLeft}>Path</th>
                    <th style={S.th} onClick={() => setSort({ by: "views", dir: sort.dir === "asc" ? "desc" : "asc" })} role="button">Views</th>
                    <th style={S.th} onClick={() => setSort({ by: "bounce", dir: sort.dir === "asc" ? "desc" : "asc" })} role="button">Bounce %</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPages.map((p) => (
                    <tr key={p.path}>
                      <td style={S.tdLeft}>{p.path}</td>
                      <td style={S.td}>{p.views.toLocaleString()}</td>
                      <td style={S.td}>{p.bounce}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <footer style={S.footer}>
          <span>© {new Date().getFullYear()} TINITIATE • Analytics</span>
          <span style={S.mutedSmall}>Demo data generated in browser (no server).</span>
        </footer>
      </div>
    </div>
  );
}

/* ---------- Small components ---------- */
function Donut({ value = 0, size = 160, stroke = 14 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;
  const S = {
    wrap: { width: size, height: size },
    text: { position: "absolute", inset: 0, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 18 },
  };
  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={S.wrap}>
        <circle cx={size/2} cy={size/2} r={r} stroke="#e2e8f0" strokeWidth={stroke} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r} stroke="#f59e0b" strokeWidth={stroke} fill="none"
          strokeDasharray={`${dash} ${c - dash}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
      </svg>
      <div style={S.text}>{pct}%</div>
    </div>
  );
}

/* ---------- Styles ---------- */
function styles() {
  return {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(1200px 300px at 80% -10%, rgba(59,130,246,0.12), transparent 60%), #f8fafc",
      color: "#0f172a",
      fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    container: { maxWidth: 1180, margin: "0 auto", padding: "24px 20px" },

    header: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 },
    brand: { display: "flex", alignItems: "center", gap: 12 },
    brandMark: { width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #2563eb, #06b6d4)", boxShadow: "0 6px 16px rgba(37,99,235,0.35)" },
    title: { fontWeight: 900, letterSpacing: "-0.01em" },
    sub: { fontSize: 13, color: "#475569" },

    input: { padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 12, outline: "none", background: "white", fontSize: 14 },
    btnGhost: { padding: "10px 14px", background: "white", color: "#0f172a", border: "1px solid #e2e8f0", borderRadius: 10, fontWeight: 700, cursor: "pointer" },

    kpiRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 12 },
    kpiCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 14, boxShadow: "0 12px 24px rgba(2,6,23,0.06)", textAlign: "center" },
    kpiValue: { fontSize: 24, fontWeight: 900 },
    kpiLabel: { color: "#64748b", fontSize: 13 },

    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 },
    card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 14, boxShadow: "0 12px 24px rgba(2,6,23,0.06)", display: "grid", gap: 8 },
    cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
    muted: { color: "#64748b", fontSize: 13 },
    mutedSmall: { color: "#64748b", fontSize: 12 },

    svg: { width: "100%", height: "220px" },

    table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 420 },
    thLeft: { textAlign: "left", padding: "8px 10px", fontSize: 12, color: "#475569", borderBottom: "1px solid #e2e8f0" },
    th: { textAlign: "right", padding: "8px 10px", fontSize: 12, color: "#475569", borderBottom: "1px solid #e2e8f0", cursor: "pointer" },
    tdLeft: { textAlign: "left", padding: "10px", borderTop: "1px solid #f1f5f9" },
    td: { textAlign: "right", padding: "10px", borderTop: "1px solid #f1f5f9" },

    footer: { marginTop: 16, paddingTop: 12, borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 13 },
  };
}
