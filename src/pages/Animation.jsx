// File: src/AnimationsPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function AnimationsPage() {
  const S = styles();

  // -------- Hero counters (count-up) --------
  const counters = [
    { id: "users", label: "Active Users", value: 12840 },
    { id: "orders", label: "Monthly Orders", value: 3560 },
    { id: "uptime", label: "Uptime", value: 99.98, suffix: "%" },
  ];
  const [counts, setCounts] = useState(counters.map(() => 0));

  useEffect(() => {
    const duration = 900; // ms
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic
    let raf = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const e = ease(p);
      setCounts(
        counters.map((c) =>
          c.id === "uptime" ? +(c.value * e).toFixed(2) : Math.round(c.value * e)
        )
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []); // run once

  // -------- Accordion --------
  const [open, setOpen] = useState(false);

  // -------- Progress (auto) --------
  const [progress, setProgress] = useState(18);
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 12 : p + 6));
    }, 800);
    return () => clearInterval(id);
  }, []);

  // -------- Toast --------
  const [toast, setToast] = useState(false);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(false), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  // -------- Demo cards data --------
  const cards = useMemo(
    () => [
      { title: "Performance", text: "Optimized assets, prefetch hints, and caching." },
      { title: "Security", text: "Best practices for auth, secrets, and headers." },
      { title: "Reliability", text: "Observability, retries, and graceful fallbacks." },
      { title: "DX", text: "Fast local dev, clean code, typed APIs." },
    ],
    []
  );

  return (
    <div style={S.page}>
      {/* Keyframes + classes (for animations) */}
      <style>{cssKeyframes}</style>

      <div style={S.container}>
        {/* -------- Hero (spinning gradient + floating orbs) -------- */}
        <header style={S.hero}>
          <div style={S.heroDecor}>
            <div className="spin-disc" style={S.spinDisc} />
            <span className="orb orb-a" style={S.orb} />
            <span className="orb orb-b" style={S.orb} />
          </div>

          <div style={S.heroInner}>
            <div style={S.eyebrow}>✨ Subtle, fast, production-ready animations</div>
            <h1 style={S.h1}>Animation Showcase</h1>
            <p style={S.sub}>
              Pure CSS + a pinch of React state. No libraries, no bloat—just smooth,
              accessible micro-interactions you can drop into any app.
            </p>
            <div style={S.ctaRow}>
              <button style={S.btnPrimary} onClick={() => setToast(true)}>Show toast</button>
              <button style={S.btnGhost} onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>
                Explore ↓
              </button>
            </div>

            {/* KPI counters */}
            <div style={S.kpis}>
              {counters.map((c, i) => (
                <div style={S.kpi} key={c.id}>
                  <div style={S.kpiNum}>
                    {c.id === "uptime" ? counts[i].toFixed(2) : counts[i].toLocaleString()}
                    {c.suffix || ""}
                  </div>
                  <div style={S.kpiLbl}>{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* -------- Staggered cards (fade-up) -------- */}
        <section style={S.section}>
          <div style={S.secHead}>
            <h2 style={S.h2}>Staggered fade-up cards</h2>
            <p style={S.muted}>Each card has a small delay via CSS variables.</p>
          </div>
          <div style={S.cardGrid}>
            {cards.map((c, i) => (
              <article
                key={c.title}
                className="fade-up"
                style={{ ...S.card, "--d": `${i * 80}ms` }}
              >
                <div style={S.cardTitle}>{c.title}</div>
                <div style={S.cardText}>{c.text}</div>
                <button style={S.cardBtn}>Learn more</button>
              </article>
            ))}
          </div>
        </section>

        {/* -------- Hover-lift & glow -------- */}
        <section style={S.section}>
          <div style={S.secHead}>
            <h2 style={S.h2}>Hover lift + glow</h2>
            <p style={S.muted}>Simple transform and shadow transitions on hover/focus.</p>
          </div>
          <div style={S.rowCards}>
            <div style={S.liftCard} tabIndex={0}>
              <div style={S.cardTitle}>Lift on hover</div>
              <div style={S.cardText}>Moves up slightly with a soft shadow.</div>
            </div>
            <div style={{ ...S.liftCard, ...S.glowCard }} tabIndex={0}>
              <div style={S.cardTitle}>Glow on hover</div>
              <div style={S.cardText}>Adds a colored glow ring using box-shadow.</div>
            </div>
            <div style={{ ...S.liftCard, ...S.scaleCard }} tabIndex={0}>
              <div style={S.cardTitle}>Press scale</div>
              <div style={S.cardText}>Subtle scale on active (click/press).</div>
            </div>
          </div>
        </section>

        {/* -------- Accordion (smooth height) -------- */}
        <section style={S.section}>
          <div style={S.secHead}>
            <h2 style={S.h2}>Smooth accordion</h2>
            <p style={S.muted}>Animates max-height with overflow hidden.</p>
          </div>
          <div style={S.accordion}>
            <button
              style={S.accBtn}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
            >
              {open ? "−" : "+"} What is this page?
            </button>
            <div
              style={{
                ...S.accPanel,
                maxHeight: open ? 160 : 0,
              }}
              aria-hidden={!open}
            >
              <p style={S.cardText}>
                A compact gallery of animation patterns you can reuse:
                counters, staggered fades, hover effects, skeletons,
                progress, toasts, and more.
              </p>
            </div>
          </div>
        </section>

        {/* -------- Progress + Skeleton -------- */}
        <section style={S.section}>
          <div style={S.secHead}>
            <h2 style={S.h2}>Progress & skeleton</h2>
            <p style={S.muted}>Shimmer placeholders and a smooth progress fill.</p>
          </div>

          <div style={S.gridTwo}>
            {/* Progress */}
            <div style={S.card}>
              <div style={S.cardTitle}>Auto progress</div>
              <div style={S.track}>
                <div
                  style={{
                    ...S.fill,
                    width: `${Math.min(100, progress)}%`,
                  }}
                  aria-label={`Progress ${Math.min(100, progress)}%`}
                />
              </div>
              <div style={S.muted}>{Math.min(100, progress)}%</div>
            </div>

            {/* Skeleton */}
            <div style={S.card}>
              <div style={S.cardTitle}>Loading skeleton</div>
              <div style={S.skeletonLine} />
              <div style={{ ...S.skeletonLine, width: "80%" }} />
              <div style={{ ...S.skeletonLine, width: "60%" }} />
            </div>
          </div>
        </section>

        <footer style={S.footer}>
          <span>© {new Date().getFullYear()} TINITIATE • Animations demo</span>
          <span style={S.muted}>No libraries. Copy & adapt freely.</span>
        </footer>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-in" style={S.toast} role="status">
          ✅ Saved! Your changes are live.
        </div>
      )}
    </div>
  );
}

/* ---------------- Styles ---------------- */
function styles() {
  return {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(1200px 300px at 80% -10%, rgba(59,130,246,0.12), transparent 60%), #f8fafc",
      color: "#0f172a",
      fontFamily:
        "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    container: { maxWidth: 1120, margin: "0 auto", padding: "24px 20px" },

    /* Hero */
    hero: {
      position: "relative",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
      borderRadius: 18,
      padding: 24,
      background: "white",
      boxShadow: "0 18px 40px rgba(2,6,23,0.06)",
      marginBottom: 16,
    },
    heroDecor: { position: "absolute", inset: 0, pointerEvents: "none" },
    spinDisc: {
      position: "absolute",
      top: -120,
      right: -120,
      width: 360,
      height: 360,
      borderRadius: "50%",
      background:
        "conic-gradient(from 0deg, #60a5fa, #22d3ee, #eab308, #60a5fa)",
      opacity: 0.25,
      filter: "blur(1px)",
      animation: "spin 18s linear infinite",
    },
    orb: {
      position: "absolute",
      width: 16,
      height: 16,
      borderRadius: "50%",
      background:
        "radial-gradient(circle at 30% 30%, #93c5fd, #2563eb 60%, #1e3a8a 80%)",
      opacity: 0.7,
      animation: "float 8s ease-in-out infinite",
    },
    heroInner: { position: "relative" },
    eyebrow: {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #e2e8f0",
      background: "white",
      fontSize: 12,
      marginBottom: 10,
    },
    h1: { fontSize: 32, margin: "6px 0 8px", letterSpacing: "-0.02em" },
    sub: { fontSize: 15, color: "#475569", maxWidth: 820, marginBottom: 12 },
    ctaRow: { display: "flex", gap: 10, flexWrap: "wrap" },

    btnPrimary: {
      padding: "12px 16px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: 12,
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 10px 18px rgba(37,99,235,0.22)",
      transition: "transform .15s ease, box-shadow .2s ease",
    },
    btnGhost: {
      padding: "12px 16px",
      background: "white",
      color: "#0f172a",
      border: "1px solid #e2e8f0",
      borderRadius: 12,
      fontWeight: 600,
      cursor: "pointer",
      transition: "transform .15s ease, box-shadow .2s ease",
    },

    /* KPIs */
    kpis: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 12,
    },
    kpi: {
      flex: "1 1 160px",
      minWidth: 160,
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      padding: 12,
      textAlign: "center",
    },
    kpiNum: { fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em" },
    kpiLbl: { fontSize: 12, color: "#64748b" },

    /* Sections */
    section: { padding: "10px 0 16px" },
    secHead: { marginBottom: 8 },
    h2: { fontSize: 20, margin: 0 },
    muted: { color: "#64748b", fontSize: 13 },

    /* Cards */
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 12,
    },
    card: {
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      padding: 14,
      boxShadow: "0 10px 20px rgba(2,6,23,0.04)",
      opacity: 0,
      transform: "translateY(8px)",
      animation: "fadeUp .6s ease forwards",
      animationDelay: "var(--d, 0ms)",
    },
    cardTitle: { fontWeight: 800, marginBottom: 4 },
    cardText: { fontSize: 14, color: "#475569" },
    cardBtn: {
      marginTop: 8,
      padding: "10px 12px",
      borderRadius: 10,
      background: "#eff6ff",
      border: "1px solid #bfdbfe",
      color: "#1d4ed8",
      fontWeight: 700,
      cursor: "pointer",
      transition: "transform .15s ease",
    },

    rowCards: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 12,
    },
    liftCard: {
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      padding: 14,
      boxShadow: "0 6px 10px rgba(2,6,23,0.04)",
      transition: "transform .18s ease, box-shadow .18s ease",
      outline: "none",
    },
    glowCard: {
      boxShadow:
        "0 6px 14px rgba(2,6,23,0.08), 0 0 0 0 rgba(37,99,235,0.25)",
    },
    scaleCard: { transition: "transform .12s ease, box-shadow .18s ease" },

    /* Accordion */
    accordion: {
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      overflow: "hidden",
      background: "white",
    },
    accBtn: {
      width: "100%",
      textAlign: "left",
      padding: 12,
      border: "none",
      background: "white",
      cursor: "pointer",
      fontWeight: 800,
      borderBottom: "1px solid #e2e8f0",
    },
    accPanel: {
      overflow: "hidden",
      transition: "max-height .28s ease",
      padding: "0 12px",
    },

    /* Progress */
    gridTwo: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 12,
    },
    track: {
      marginTop: 8,
      width: "100%",
      height: 12,
      borderRadius: 999,
      background: "#f1f5f9",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      background: "linear-gradient(90deg, #60a5fa, #2563eb)",
      transition: "width .5s cubic-bezier(.2,.8,.2,1)",
    },

    /* Skeleton */
    skeletonLine: {
      height: 12,
      borderRadius: 8,
      background:
        "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%)",
      backgroundSize: "400% 100%",
      animation: "shimmer 1.2s ease-in-out infinite",
      marginTop: 10,
    },

    /* Footer */
    footer: {
      marginTop: 18,
      paddingTop: 12,
      borderTop: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 10,
      fontSize: 13,
    },

    /* Toast */
    toast: {
      position: "fixed",
      bottom: 18,
      right: 18,
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: 12,
      boxShadow: "0 18px 40px rgba(2,6,23,0.12)",
      padding: "10px 12px",
      fontWeight: 700,
      zIndex: 50,
    },
  };
}

const cssKeyframes = `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes float {
  0%,100% { transform: translateY(-6px); }
  50% { transform: translateY(6px); }
}
@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* position two orbs */
.orb.orb-a { left: 12%; top: 22%; animation-duration: 9s; }
.orb.orb-b { right: 14%; bottom: 18%; animation-duration: 7.5s; }

/* button/card interactive states */
button:hover { transform: translateY(-1px); }
button:active { transform: translateY(0); }
.fade-up { will-change: transform, opacity; }
div[tabindex="0"]:hover { transform: translateY(-4px); box-shadow: 0 14px 28px rgba(2,6,23,0.10); }
div[tabindex="0"]:focus { outline: 2px solid #2563eb; outline-offset: 2px; }
div[tabindex="0"].glow:hover { box-shadow: 0 0 0 6px rgba(37,99,235,0.15); }

/* toast slide */
.toast-in { animation: toastIn .24s ease forwards; }
@keyframes toastIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;


