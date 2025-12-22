// File: src/HomePage.jsx
import React, { useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const styles = {
    page: {
      fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      color: "#0f172a",           // slate-900
      background: "#f8fafc",      // slate-50
    },
    container: {
      maxWidth: 1120,
      margin: "0 auto",
      padding: "24px 20px",
    },
    nav: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 0",
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontWeight: 700,
      fontSize: 20,
    },
    brandMark: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background:
        "linear-gradient(135deg, rgba(59,130,246,1) 0%, rgba(14,165,233,1) 100%)",
      boxShadow: "0 6px 16px rgba(59,130,246,0.35)",
    },
    navLinks: {
      display: "flex",
      flexWrap: "wrap",
      gap: 16,
      fontSize: 14,
      opacity: 0.9,
    },
    link: { textDecoration: "none", color: "#0f172a" },
    pill: {
      padding: "6px 12px",
      background: "#0ea5e9",
      color: "white",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
    },

    // Hero
    hero: {
      display: "flex",
      flexWrap: "wrap",
      gap: 24,
      alignItems: "center",
      justifyContent: "space-between",
      padding: "28px 0 16px",
    },
    heroText: {
      flex: "1 1 420px",
      maxWidth: 560,
    },
    eyebrow: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: "white",
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #e2e8f0",
      fontSize: 12,
      marginBottom: 12,
    },
    h1: {
      fontSize: 36,
      lineHeight: 1.15,
      margin: "8px 0 12px",
      letterSpacing: "-0.02em",
    },
    sub: {
      fontSize: 16,
      color: "#334155",
      marginBottom: 18,
    },
    ctaRow: { display: "flex", gap: 12, flexWrap: "wrap" },
    btnPrimary: {
      padding: "12px 16px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: 12,
      fontWeight: 600,
      cursor: "pointer",
      boxShadow: "0 10px 18px rgba(37,99,235,0.22)",
    },
    btnGhost: {
      padding: "12px 16px",
      background: "white",
      color: "#0f172a",
      border: "1px solid #e2e8f0",
      borderRadius: 12,
      fontWeight: 600,
      cursor: "pointer",
    },
    heroArt: {
      flex: "1 1 380px",
      minHeight: 260,
      borderRadius: 16,
      background:
        "radial-gradient(1200px 300px at 80% -10%, rgba(59,130,246,0.25), transparent 60%)," +
        "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
      border: "1px solid #e2e8f0",
      boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
    },

    // Feature cards
    section: { padding: "12px 0 28px" },
    kpis: {
      display: "flex",
      flexWrap: "wrap",
      gap: 16,
      marginTop: 8,
    },
    kpi: {
      flex: "1 1 160px",
      minWidth: 160,
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      padding: 14,
      textAlign: "center",
    },
    kpiNum: { fontSize: 24, fontWeight: 800 },
    kpiLbl: { fontSize: 12, color: "#475569" },

    cardGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: 16,
      marginTop: 12,
    },
    card: {
      flex: "1 1 calc(33.333% - 12px)",
      minWidth: 260,
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 10px 20px rgba(2,6,23,0.04)",
    },
    cardTitle: { fontWeight: 700, marginBottom: 6 },
    cardText: { fontSize: 14, color: "#475569" },

    // Newsletter
    newsletter: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      alignItems: "center",
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      padding: 16,
      marginTop: 16,
    },
    input: {
      flex: "1 1 260px",
      minWidth: 240,
      padding: "12px 14px",
      border: "1px solid #cbd5e1",
      borderRadius: 12,
      outline: "none",
    },

    // Footer
    footer: {
      marginTop: 28,
      padding: "18px 0 24px",
      borderTop: "1px solid #e2e8f0",
      color: "#475569",
      fontSize: 13,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
    },
    footLinks: { display: "flex", gap: 16, flexWrap: "wrap" },
  };

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* ---------------- NAV ---------------- */}
        <nav style={styles.nav}>
          <div style={styles.brand}>
            <div style={styles.brandMark} />
            <span>TINITIATE</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#features" style={styles.link}>Features</a>
            <a href="#pricing" style={styles.link}>Pricing</a>
            <a href="#about" style={styles.link}>About</a>
            <a href="#contact" style={styles.link}>Contact</a>
            <span style={styles.pill}>New</span>
          </div>
        </nav>

        {/* ---------------- HERO ---------------- */}
        <header style={styles.hero}>
          <div style={styles.heroText}>
            <div style={styles.eyebrow}>
              <span>✨</span>
              <span>Launch faster with a clean React starter</span>
            </div>
            <h1 style={styles.h1}>
              A simple, professional homepage for your React app
            </h1>
            <p style={styles.sub}>
              Modern layout, subtle shadows, and accessible typography—ready to
              drop into your Vite or CRA project with zero dependencies.
            </p>
            <div style={styles.ctaRow}>
              <button style={styles.btnPrimary}>Get Started</button>
              <button style={styles.btnGhost}>View Docs</button>
            </div>
          </div>
          <div style={styles.heroArt} />
        </header>

        {/* ---------------- KPIs ---------------- */}
        <section style={styles.section} id="features">
          <div style={styles.kpis}>
            <div style={styles.kpi}>
              <div style={styles.kpiNum}>5 min</div>
              <div style={styles.kpiLbl}>Setup time</div>
            </div>
            <div style={styles.kpi}>
              <div style={styles.kpiNum}>0 deps</div>
              <div style={styles.kpiLbl}>No extra libs</div>
            </div>
            <div style={styles.kpi}>
              <div style={styles.kpiNum}>100%</div>
              <div style={styles.kpiLbl}>Responsive</div>
            </div>
            <div style={styles.kpi}>
              <div style={styles.kpiNum}>A11y</div>
              <div style={styles.kpiLbl}>Good contrast</div>
            </div>
          </div>

          {/* ---------------- CARDS ---------------- */}
          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Clean Structure</div>
              <div style={styles.cardText}>
                Minimal sections—hero, features, CTA, footer—so users focus on
                what matters.
              </div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Inline Styles</div>
              <div style={styles.cardText}>
                Everything styled inline to keep this demo drop-in simple and
                portable.
              </div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Flexible Layout</div>
              <div style={styles.cardText}>
                Uses flex + wrap and min-width to look good on phones, tablets,
                and desktops.
              </div>
            </div>
          </div>

          {/* ---------------- NEWSLETTER ---------------- */}
          <form style={styles.newsletter} onSubmit={handleSubscribe}>
            <strong>Stay in the loop</strong>
            <input
              type="email"
              placeholder="you@example.com"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button style={styles.btnPrimary} type="submit">
              Subscribe
            </button>
            {subscribed && (
              <span role="status" style={{ color: "#16a34a", fontWeight: 600 }}>
                Thanks! You’re subscribed.
              </span>
            )}
          </form>
        </section>

        {/* ---------------- FOOTER ---------------- */}
        <footer style={styles.footer}>
          <span>© {new Date().getFullYear()} TINITIATE Technologies</span>
          <div style={styles.footLinks}>
            <a href="#privacy" style={styles.link}>Privacy</a>
            <a href="#terms" style={styles.link}>Terms</a>
            <a href="#contact" style={styles.link}>Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
