
import React, { useMemo, useState } from "react";

export default function InfographicsPage() {

  const datasets = {
    "7d": {
      kpis: [
        { id: "rev",   label: "Revenue",      value: 120000, change: +8.2,  unit: "₹" },
        { id: "orders",label: "Orders",       value: 1450,   change: +3.1,  unit: ""  },
        { id: "conv",  label: "Conversion",   value: 3.7,    change: +0.4,  unit: "%" },
        { id: "aov",   label: "Avg. Order",   value: 829,    change: -1.3,  unit: "₹" },
      ],
      sparkline: [34,42,38,45,41,49,53],
      completion: 0.68,
      bars: [
        { label: "Web",     value: 58 },
        { label: "Mobile",  value: 42 },
        { label: "API",     value: 25 },
        { label: "Retail",  value: 18 },
      ],
      compare: { current: 120000, previous: 110800 },
      timeline: [
        { t: "Mon",  desc: "Launched promo",            type: "event" },
        { t: "Tue",  desc: "A/B test started",          type: "test"  },
        { t: "Wed",  desc: "Traffic spike (blog)",      type: "event" },
        { t: "Thu",  desc: "Checkout bug fixed",        type: "fix"   },
        { t: "Fri",  desc: "Email campaign #2 blasted", type: "event" },
      ],
    },
    "30d": {
      kpis: [
        { id: "rev",   label: "Revenue",      value: 505000, change: +12.4, unit: "₹" },
        { id: "orders",label: "Orders",       value: 5500,   change: +4.6,  unit: ""  },
        { id: "conv",  label: "Conversion",   value: 3.9,    change: +0.2,  unit: "%" },
        { id: "aov",   label: "Avg. Order",   value: 919,    change: +3.7,  unit: "₹" },
      ],
      sparkline: [23,26,32,29,34,38,36,40,44,42,47,51,48,54,58,60,59,62,66,64,68,71,73,76,78,81,85,82,88,92],
      completion: 0.74,
      bars: [
        { label: "Web",     value: 60 },
        { label: "Mobile",  value: 48 },
        { label: "API",     value: 31 },
        { label: "Retail",  value: 22 },
      ],
      compare: { current: 505000, previous: 449000 },
      timeline: [
        { t: "W1", desc: "Price update rollout",   type: "event" },
        { t: "W2", desc: "SEO content published",  type: "event" },
        { t: "W3", desc: "Infra scale up",         type: "fix"   },
        { t: "W4", desc: "Referral program live",  type: "event" },
      ],
    },
    "90d": {
      kpis: [
        { id: "rev",   label: "Revenue",      value: 1525000, change: +19.1, unit: "₹" },
        { id: "orders",label: "Orders",       value: 16750,   change: +7.8,  unit: ""  },
        { id: "conv",  label: "Conversion",   value: 4.1,     change: +0.3,  unit: "%" },
        { id: "aov",   label: "Avg. Order",   value: 910,     change: +2.1,  unit: "₹" },
      ],
      sparkline: Array.from({ length: 90 }, (_, i) => 35 + Math.round(10 * Math.sin(i/6) + i/6)),
      completion: 0.61,
      bars: [
        { label: "Web",     value: 65 },
        { label: "Mobile",  value: 54 },
        { label: "API",     value: 36 },
        { label: "Retail",  value: 28 },
      ],
      compare: { current: 1525000, previous: 1280000 },
      timeline: [
        { t: "M1", desc: "Product revamp shipped", type: "event" },
        { t: "M2", desc: "SLA improvement",        type: "fix"   },
        { t: "M3", desc: "Partnership signed",     type: "event" },
      ],
    },
  };

  const [range, setRange] = useState("7d");
  const data = datasets[range];

  // ---- Helpers ----
  const S = styles();
  const maxBar = useMemo(() => Math.max(...data.bars.map(b => b.value), 1), [data.bars]);
  const abbreviate = (n) => {
    if (n == null) return "-";
    const abs = Math.abs(n);
    if (abs >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${(n/1_000).toFixed(1)}K`;
    return String(n);
  };

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Header */}
        <header style={S.header}>
          <div style={S.brand}>
            <div style={S.brandMark} />
            <div>
              <div style={S.brandTitle}>Business Infographics</div>
              <div style={S.brandSub}>Snapshot overview — clean, fast, no libraries</div>
            </div>
          </div>
          <div style={S.segment}>
            {["7d","30d","90d"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{ ...S.segmentBtn, ...(range === r ? S.segmentBtnActive : null) }}
              >
                {r}
              </button>
            ))}
          </div>
        </header>

        {/* KPI Cards */}
        <section style={S.grid}>
          {data.kpis.map((k) => (
            <KpiCard
              key={k.id}
              label={k.label}
              value={k.unit === "%" ? `${k.value.toFixed(1)}%` :
                    k.unit === "₹" ? `₹${k.value.toLocaleString()}` :
                    abbreviate(k.value)}
              change={k.change}
            />
          ))}

          {/* Sparkline card */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <div style={S.cardTitle}>Trend (traffic)</div>
              <div style={S.muted}>Last {range}</div>
            </div>
            <Sparkline data={data.sparkline} />
          </div>

          {/* Donut card */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <div style={S.cardTitle}>Goal completion</div>
              <div style={S.muted}>Target: 100%</div>
            </div>
            <Donut percent={Math.round(data.completion * 100)} />
          </div>

          {/* Horizontal bar chart */}
          <div style={{ ...S.card, gridColumn: "1 / -1" }}>
            <div style={S.cardHead}>
              <div style={S.cardTitle}>Channel mix</div>
              <div style={S.muted}>Share of orders</div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {data.bars.map((b) => (
                <div key={b.label} style={{ display: "grid", gap: 8 }}>
                  <div style={S.rowBetween}>
                    <strong>{b.label}</strong>
                    <span style={S.muted}>{b.value}</span>
                  </div>
                  <div style={S.barTrack}>
                    <div
                      style={{
                        ...S.barFill,
                        width: `${(b.value / maxBar) * 100}%`,
                      }}
                      aria-label={`${b.label} ${b.value}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compare block */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <div style={S.cardTitle}>Revenue vs previous</div>
              <div style={S.muted}>Same period</div>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={S.rowBetween}>
                <span>Current</span>
                <strong>₹{data.compare.current.toLocaleString()}</strong>
              </div>
              <div style={S.rowBetween}>
                <span>Previous</span>
                <strong>₹{data.compare.previous.toLocaleString()}</strong>
              </div>
              <div style={S.deltaPill(data.compare.current - data.compare.previous)}>
                {data.compare.current - data.compare.previous >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(((data.compare.current - data.compare.previous) / Math.max(1, data.compare.previous)) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <div style={S.cardTitle}>Timeline</div>
              <div style={S.muted}>Key highlights</div>
            </div>
            <ul style={S.timeline}>
              {data.timeline.map((x, i) => (
                <li key={i} style={S.timelineItem}>
                  <span style={S.bullet(x.type)} />
                  <div style={{ display: "grid" }}>
                    <strong>{x.t}</strong>
                    <span style={S.muted}>{x.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer style={S.footer}>
          <span>© {new Date().getFullYear()} TINITIATE • Demo infographics</span>
          <span style={S.muted}>Replace demo data with your API</span>
        </footer>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function KpiCard({ label, value, change }) {
  const S = styles();
  const up = change >= 0;
  return (
    <div style={S.card}>
      <div style={S.cardHead}>
        <div style={S.cardTitle}>{label}</div>
        <div style={S.pill(up)}>{up ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%</div>
      </div>
      <div style={S.kpiValue}>{value}</div>
    </div>
  );
}

function Sparkline({ data = [], width = 280, height = 60, stroke = "#2563eb" }) {
  const padding = 6;
  const w = width, h = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);
  const points = data.map((d, i) => {
    const x = padding + (i * (w - padding * 2)) / Math.max(1, data.length - 1);
    const y = h - padding - ((d - min) / range) * (h - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const last = data[data.length - 1];
  const first = data[0];
  const delta = last - first;

  const S = styles();
  return (
    <div>
      <svg width={w} height={h} role="img" aria-label="Sparkline trend">
        <polyline
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          points={points}
        />
      </svg>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={S.muted}>Change</span>
        <span style={S.pill(delta >= 0)}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}</span>
      </div>
    </div>
  );
}

function Donut({ percent = 72, size = 140 }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const angle = (clamped / 100) * 360;
  const S = styles();
  return (
    <div style={{ display: "grid", placeItems: "center", padding: 6 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `conic-gradient(#2563eb ${angle}deg, #e2e8f0 0)`,
          display: "grid",
          placeItems: "center",
        }}
        aria-label={`Completion ${clamped}%`}
      >
        <div style={{
          width: size - 32,
          height: size - 32,
          borderRadius: "50%",
          background: "white",
          display: "grid",
          placeItems: "center",
          border: "1px solid #e2e8f0",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{clamped}%</div>
            <div style={{ fontSize: 12, color: "#475569" }}>completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Styles (inline) ---------- */
function styles() {
  return {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(1200px 300px at 80% -10%, rgba(59,130,246,0.12), transparent 60%), #f8fafc",
      color: "#0f172a",
      fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    container: { maxWidth: 1120, margin: "0 auto", padding: "24px 20px" },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      flexWrap: "wrap",
      marginBottom: 16,
    },
    brand: { display: "flex", alignItems: "center", gap: 12 },
    brandMark: {
      width: 28, height: 28, borderRadius: 8,
      background: "linear-gradient(135deg, rgba(59,130,246,1), rgba(14,165,233,1))",
      boxShadow: "0 6px 16px rgba(59,130,246,0.35)",
    },
    brandTitle: { fontWeight: 900, letterSpacing: "-0.01em" },
    brandSub: { fontSize: 13, color: "#475569" },

    segment: {
      display: "inline-flex",
      gap: 6,
      background: "white",
      border: "1px solid #e2e8f0",
      padding: 4,
      borderRadius: 999,
    },
    segmentBtn: {
      border: "none",
      background: "transparent",
      padding: "8px 12px",
      borderRadius: 999,
      cursor: "pointer",
      fontWeight: 700,
      color: "#0f172a",
    },
    segmentBtnActive: {
      background: "#eff6ff",
      color: "#1d4ed8",
      border: "1px solid #bfdbfe",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: 14,
    },

    card: {
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      boxShadow: "0 12px 28px rgba(2,6,23,0.06)",
      padding: 16,
      display: "grid",
      gap: 10,
    },
    cardHead: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    cardTitle: { fontWeight: 800 },

    kpiValue: { fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em" },
    muted: { color: "#64748b", fontSize: 13 },
    rowBetween: { display: "flex", alignItems: "center", justifyContent: "space-between" },

    pill: (up) => ({
      padding: "4px 8px",
      borderRadius: 999,
      border: `1px solid ${up ? "#86efac" : "#fecaca"}`,
      background: up ? "#ecfdf5" : "#fff7ed",
      color: up ? "#166534" : "#9a3412",
      fontSize: 12,
      fontWeight: 700,
    }),

    barTrack: {
      width: "100%",
      height: 10,
      borderRadius: 999,
      background: "#f1f5f9",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
    },
    barFill: {
      height: "100%",
      background: "linear-gradient(90deg, #60a5fa, #2563eb)",
    },

    deltaPill: (delta) => ({
      marginTop: 6,
      padding: "6px 10px",
      borderRadius: 10,
      width: "fit-content",
      border: `1px solid ${delta >= 0 ? "#86efac" : "#fecaca"}`,
      background: delta >= 0 ? "#ecfdf5" : "#fff7ed",
      color: delta >= 0 ? "#166534" : "#9a3412",
      fontWeight: 700,
      fontSize: 12,
    }),

    timeline: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 },
    timelineItem: { display: "grid", gridTemplateColumns: "18px 1fr", gap: 10, alignItems: "start" },
    bullet: (type) => ({
      width: 10, height: 10, borderRadius: "50%", marginTop: 6,
      background: type === "fix" ? "#10b981" : type === "test" ? "#f59e0b" : "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.15)",
    }),

    footer: {
      marginTop: 18,
      paddingTop: 14,
      borderTop: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 10,
      fontSize: 13,
    },
  };
}
