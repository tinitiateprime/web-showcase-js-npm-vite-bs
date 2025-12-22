// File: src/AboutPageAlt.jsx
import React, { useMemo } from "react";

export default function AboutPageAlt() {
  const S = styles();

  const stats = useMemo(
    () => [
      { k: "Clients", v: "120+" },
      { k: "Projects", v: "250+" },
      { k: "Uptime", v: "99.95%" },
      { k: "NPS", v: "72" },
    ],
    []
  );

  const values = [
    { t: "Impact over Hype", d: "We pick tech that serves the goal, not the trend." },
    { t: "Craft & Care", d: "Readable code, accessible UI, reliable infra." },
    { t: "Open by Default", d: "Clear comms, transparent decisions, shared context." },
    { t: "Own the Outcome", d: "We stay until it works in production—then iterate." },
  ];

  const timeline = [
    { y: "2016", h: "Launch", d: "Started with web apps and product MVPs." },
    { y: "2018", h: "Cloud-first", d: "DevOps & data platforms added to the stack." },
    { y: "2021", h: "Global scale", d: "24×7 delivery, multi-region deployments." },
    { y: "2024", h: "AI systems", d: "LLM-assisted workflows and automation." },
  ];

  const team = [
    { i: "NK", n: "Nikhil", r: "Founder & CTO" },
    { i: "RS", n: "Rishi",  r: "Head of Engineering" },
    { i: "AP", n: "Ananya", r: "Design Lead" },
    { i: "VK", n: "Vikram", r: "Data Platform Lead" },
  ];

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Header */}
        <header style={S.header}>
          <div style={S.brand}>
            <div style={S.logoGlow} />
            <div style={S.brandText}>
              <div style={S.brandTitle}>About</div>
              <div style={S.brandSub}>People, craft, and principles</div>
            </div>
          </div>
          <a href="#contact" style={S.btnGhost}>Contact</a>
        </header>

        {/* Hero (dark) */}
        <section style={S.hero}>
          <div style={S.heroLeft}>
            <h1 style={S.h1}>We design, build, and operate dependable software.</h1>
            <p style={S.lead}>
              Pragmatic engineering, clean UX, measurable business value. From MVPs to
              planet-scale services—delivered with care.
            </p>
            <div style={S.pills}>
              <span style={S.pill}>Full-stack delivery</span>
              <span style={S.pill}>Cloud & data</span>
              <span style={S.pill}>AI automation</span>
            </div>
          </div>
          <div style={S.heroRight}>
            <div style={S.heroCard}>
              <div style={S.cardTitle}>What to expect</div>
              <ul style={S.ul}>
                <li>Hands-on senior engineers</li>
                <li>Transparent estimates & milestones</li>
                <li>Observability & SRE practices</li>
                <li>Security & cost discipline</li>
              </ul>
            </div>
          </div>
          <div style={S.heroBackdropA} />
          <div style={S.heroBackdropB} />
        </section>

        {/* Split section */}
        <section style={S.split}>
          <article style={S.splitCard}>
            <h2 style={S.h2}>Who we are</h2>
            <p style={S.text}>
              A compact team of engineers, designers, and data folks who like shipping
              real products. We pair fast iteration with long-term maintainability.
            </p>
          </article>
          <article style={{ ...S.splitCard, ...S.splitCardAccent }}>
            <h2 style={S.h2}>What makes us different</h2>
            <p style={S.text}>
              We write docs, automate toil, measure outcomes, and design for operability.
              Decisions are reversible by default; architecture remains simple on purpose.
            </p>
          </article>
        </section>

        {/* Stats */}
        <section style={S.statsWrap}>
          {stats.map((s) => (
            <div key={s.k} style={S.statCard}>
              <div style={S.statValue}>{s.v}</div>
              <div style={S.statKey}>{s.k}</div>
            </div>
          ))}
        </section>

        {/* Values */}
        <section style={S.section}>
          <h2 style={S.h2}>Values</h2>
          <div style={S.gridCards}>
            {values.map((v) => (
              <article key={v.t} style={S.valueCard}>
                <div style={S.valueAccent} />
                <div style={S.valueHead}>{v.t}</div>
                <p style={S.text}>{v.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section style={S.section}>
          <h2 style={S.h2}>Milestones</h2>
          <ol style={S.timeline}>
            {timeline.map((t, idx) => (
              <li key={idx} style={S.timelineItem}>
                <div style={S.badge}>{t.y}</div>
                <div style={{ display: "grid", gap: 4 }}>
                  <div style={S.tHeadline}>{t.h}</div>
                  <div style={S.muted}>{t.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Team */}
        <section style={S.section}>
          <h2 style={S.h2}>Leadership</h2>
          <div style={S.teamGrid}>
            {team.map((m) => (
              <article key={m.n} style={S.teamCard}>
                <div style={S.avatarRing}>
                  <div style={S.avatar}>{m.i}</div>
                </div>
                <div style={S.memberName}>{m.n}</div>
                <div style={S.muted}>{m.r}</div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="contact" style={S.cta}>
          <div>
            <div style={S.ctaTitle}>Let’s collaborate</div>
            <div style={S.muted}>Share your goals—get a plan and timeline.</div>
          </div>
          <a href="mailto:hello@example.com" style={S.btnPrimary}>Email us</a>
        </section>

        <footer style={S.footer}>
          <span>© {new Date().getFullYear()} TINITIATE • About (Alt)</span>
          <span style={S.muted}>React • Inline styles • No libraries</span>
        </footer>
      </div>
    </div>
  );
}

/* ---------------- Styles (inline) ---------------- */
function styles() {
  const radius = 18;
  return {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(1200px 300px at 80% -10%, rgba(99,102,241,0.12), transparent 60%), #f7f9fc",
      color: "#0f172a",
      fontFamily:
        "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    container: { maxWidth: 1120, margin: "0 auto", padding: "24px 20px" },

    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, marginBottom: 16, flexWrap: "wrap",
    },
    brand: { display: "flex", alignItems: "center", gap: 12 },
    logoGlow: {
      width: 34, height: 34, borderRadius: 10,
      background: "linear-gradient(135deg, #6366f1, #22d3ee)",
      boxShadow: "0 10px 30px rgba(99,102,241,0.35)",
    },
    brandText: {},
    brandTitle: { fontWeight: 900, letterSpacing: "-0.01em" },
    brandSub: { fontSize: 12, color: "#64748b" },

    btnGhost: {
      padding: "10px 14px", background: "white", color: "#0f172a",
      border: "1px solid #e2e8f0", borderRadius: 10, fontWeight: 700,
    },

    /* Hero */
    hero: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: "1.2fr 0.8fr",
      gap: 12,
      background: "linear-gradient(180deg, #0b1220, #0e1526 60%, #101827)",
      color: "white",
      borderRadius: radius,
      padding: 18,
      boxShadow: "0 22px 50px rgba(2,6,23,0.35)",
      overflow: "hidden",
      marginBottom: 16,
    },
    heroLeft: { display: "grid", gap: 10 },
    h1: { fontSize: 28, margin: 0, lineHeight: 1.25, letterSpacing: "-0.02em" },
    lead: { color: "rgba(255,255,255,0.8)", maxWidth: 780 },
    pills: { display: "flex", gap: 8, flexWrap: "wrap" },
    pill: {
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(255,255,255,0.06)",
      fontSize: 12,
    },
    heroRight: { display: "grid", alignContent: "start" },
    heroCard: {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: radius,
      padding: 14,
      backdropFilter: "blur(6px)",
    },
    cardTitle: { fontWeight: 800, marginBottom: 6 },
    ul: { margin: 0, paddingLeft: 18 },

    heroBackdropA: {
      position: "absolute", width: 360, height: 360, right: -90, top: -90,
      background: "radial-gradient(50% 50% at 50% 50%, rgba(99,102,241,.35), transparent 70%)",
      filter: "blur(10px)",
    },
    heroBackdropB: {
      position: "absolute", width: 320, height: 320, left: -80, bottom: -80,
      background: "radial-gradient(50% 50% at 50% 50%, rgba(34,211,238,.25), transparent 70%)",
      filter: "blur(10px)",
    },

    /* Split */
    split: {
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 12,
    },
    splitCard: {
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: radius,
      boxShadow: "0 12px 24px rgba(2,6,23,0.06)", padding: 14,
    },
    splitCardAccent: {
      borderImage: "linear-gradient(90deg, #22d3ee, #6366f1) 1",
      borderWidth: 1, borderStyle: "solid",
    },

    /* Stats */
    statsWrap: {
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 12, marginTop: 14,
    },
    statCard: {
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: radius,
      padding: 16, textAlign: "center", boxShadow: "0 10px 20px rgba(2,6,23,0.05)",
    },
    statValue: { fontSize: 24, fontWeight: 900 },
    statKey: { color: "#64748b", fontSize: 13 },

    /* Section */
    section: { marginTop: 18 },
    h2: { fontSize: 20, margin: 0 },
    text: { color: "#334155", lineHeight: 1.6 },

    /* Values */
    gridCards: {
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 12, marginTop: 10,
    },
    valueCard: {
      position: "relative",
      background: "#fff", borderRadius: radius, padding: 14,
      border: "1px solid #e2e8f0",
      boxShadow: "0 10px 20px rgba(2,6,23,0.05)",
      overflow: "hidden",
    },
    valueAccent: {
      position: "absolute", inset: 0, pointerEvents: "none",
      background: "linear-gradient(120deg, rgba(34,211,238,0.14), rgba(99,102,241,0.14))",
      maskImage: "radial-gradient(160px 40px at 20% 0%, black, transparent)",
    },
    valueHead: { fontWeight: 800, marginBottom: 6 },

    /* Timeline */
    timeline: {
      listStyle: "none", margin: "10px 0 0", padding: 0,
      display: "grid", gap: 12, position: "relative",
    },
    timelineItem: {
      display: "grid", gridTemplateColumns: "80px 1fr", gap: 12, alignItems: "start",
      padding: 10, background: "#fff", border: "1px solid #e2e8f0", borderRadius: radius,
      boxShadow: "0 10px 20px rgba(2,6,23,0.05)",
    },
    badge: {
      display: "inline-block", padding: "6px 10px", borderRadius: 999,
      background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8",
      fontWeight: 800, textAlign: "center",
    },
    tHeadline: { fontWeight: 800 },
    muted: { color: "#64748b", fontSize: 13 },

    /* Team */
    teamGrid: {
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 12, marginTop: 10,
    },
    teamCard: {
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: radius,
      padding: 14, textAlign: "center", display: "grid", gap: 8,
      boxShadow: "0 10px 20px rgba(2,6,23,0.05)",
    },
    avatarRing: {
      padding: 4, borderRadius: "50%",
      background: "conic-gradient(from 120deg, #22d3ee, #6366f1, #22d3ee)",
    },
    avatar: {
      width: 70, height: 70, borderRadius: "50%", display: "grid", placeItems: "center",
      fontWeight: 900, color: "#1d4ed8", background: "#fff", border: "1px solid #bfdbfe",
    },
    memberName: { fontWeight: 800 },

    /* CTA */
    cta: {
      marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, flexWrap: "wrap", background: "#fff", border: "1px solid #e2e8f0",
      borderRadius: radius, boxShadow: "0 12px 24px rgba(2,6,23,0.06)", padding: 14,
    },
    btnPrimary: {
      padding: "10px 14px", background: "linear-gradient(90deg, #6366f1, #22d3ee)", color: "#fff",
      border: "none", borderRadius: 10, fontWeight: 800,
      boxShadow: "0 10px 22px rgba(34,211,238,0.25)",
    },

    footer: {
      marginTop: 18, paddingTop: 12, borderTop: "1px solid #e2e8f0",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 10, fontSize: 13,
    },
  };
}

/* ============== How to use (Vite) ==============
1) Save as: src/AboutPageAlt.jsx
2) In src/App.jsx:
   import AboutPageAlt from "./AboutPageAlt";
   export default function App(){ return <AboutPageAlt/>; }
3) npm run dev
*/
