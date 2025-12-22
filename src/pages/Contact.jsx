// File: src/ContactPage.jsx
import React, { useEffect, useState } from "react";

export default function ContactPage() {
  const S = styles();

  // ------- Form state -------
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  // ------- Helpers -------
  const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || "");
  const trim = (s) => (s || "").trim();

  function validate(f) {
    const e = {};
    if (!trim(f.name)) e.name = "Please enter your name.";
    if (!emailOk(f.email)) e.email = "Enter a valid email.";
    if (!trim(f.subject)) e.subject = "Please enter a subject.";
    if (trim(f.message).length < 10) e.message = "Message should be at least 10 characters.";
    return e;
  }

  function submit(e) {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    // Simulate submit
    setSent(true);
    setTimeout(() => setSent(false), 2400);
    alert(
      [
        "Thanks! Your message was submitted.",
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        form.phone ? `Phone: ${form.phone}` : null,
        `Subject: ${form.subject}`,
        `Message: ${form.message.slice(0, 200)}${form.message.length > 200 ? "..." : ""}`,
      ]
        .filter(Boolean)
        .join("\n")
    );
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  function copy(text) {
    navigator.clipboard?.writeText(text).then(() => {
      setToast(`Copied: ${text}`);
    });
  }

  // Small toast
  const [toast, setToast] = useState("");
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 1400);
    return () => clearTimeout(id);
  }, [toast]);

  // Mini FAQ
  const [openFaq, setOpenFaq] = useState(-1);
  const faqs = [
    { q: "How soon do you reply?", a: "We respond within one business day. Critical issues are prioritized." },
    { q: "Do you offer a discovery call?", a: "Yes—15–30 minutes to discuss scope, timelines, and next steps." },
  ];

  return (
    <div style={S.page}>
      {toast && <div style={S.toast}>{toast}</div>}
      {sent && <div style={S.toast}>✅ Message sent</div>}

      <div style={S.container}>
        {/* Header */}
        <header style={S.header}>
          <div style={S.brand}>
            <div style={S.brandMark} />
            <div>
              <div style={S.brandTitle}>Contact Us</div>
              <div style={S.brandSub}>We’d love to hear from you</div>
            </div>
          </div>
          <a href="mailto:hello@example.com" style={S.btn}>Email</a>
        </header>

        {/* Intro */}
        <section style={S.hero}>
          <h1 style={S.h1}>Let’s talk about your project</h1>
          <p style={S.lead}>
            Tell us a bit about your goals. We’ll get back with a short plan, estimate, and the next steps.
          </p>
        </section>

        {/* Layout */}
        <div style={S.layout}>
          {/* -------- Left: Form -------- */}
          <section style={S.card}>
            <div style={{ display: "grid", gap: 10 }}>
              <h2 style={S.h2}>Send a message</h2>
              <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
                <div style={S.row}>
                  <div style={{ ...S.group, flex: 1 }}>
                    <label style={S.label}>Name *</label>
                    <input
                      style={{ ...S.input, ...(errors.name ? S.inputError : null) }}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "err-name" : undefined}
                      required
                    />
                    {errors.name && <div id="err-name" style={S.err}>{errors.name}</div>}
                  </div>
                  <div style={{ ...S.group, flex: 1 }}>
                    <label style={S.label}>Email *</label>
                    <input
                      type="email"
                      style={{ ...S.input, ...(errors.email ? S.inputError : null) }}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                      required
                    />
                    {errors.email && <div id="err-email" style={S.err}>{errors.email}</div>}
                  </div>
                </div>

                <div style={S.row}>
                  <div style={{ ...S.group, flex: 1 }}>
                    <label style={S.label}>Phone (optional)</label>
                    <input
                      style={S.input}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div style={{ ...S.group, flex: 1 }}>
                    <label style={S.label}>Subject *</label>
                    <input
                      style={{ ...S.input, ...(errors.subject ? S.inputError : null) }}
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? "err-subject" : undefined}
                      required
                    />
                    {errors.subject && <div id="err-subject" style={S.err}>{errors.subject}</div>}
                  </div>
                </div>

                <div style={S.group}>
                  <label style={S.label}>Message *</label>
                  <textarea
                    rows={6}
                    style={{ ...S.textarea, ...(errors.message ? S.inputError : null) }}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "err-msg" : undefined}
                    required
                  />
                  {errors.message && <div id="err-msg" style={S.err}>{errors.message}</div>}
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <button type="submit" style={S.btn}>Send message</button>
                  <a href="https://wa.me/0000000000" style={S.btnLink}>Prefer WhatsApp?</a>
                </div>
              </form>
            </div>
          </section>

          {/* -------- Right: Info -------- */}
          <aside style={{ display: "grid", gap: 12, alignSelf: "start" }}>
            <div style={S.card}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Contact</div>
              <div style={S.rowBetween}>
                <div>
                  <div style={S.mutedSmall}>Email</div>
                  <div style={{ fontWeight: 800 }}>hello@example.com</div>
                </div>
                <button style={S.ghost} onClick={() => copy("hello@example.com")}>Copy</button>
              </div>
              <div style={S.rowBetween}>
                <div>
                  <div style={S.mutedSmall}>Phone</div>
                  <div style={{ fontWeight: 800 }}>+91 90000 00000</div>
                </div>
                <button style={S.ghost} onClick={() => copy("+919000000000")}>Copy</button>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={S.mutedSmall}>Hours</div>
                <div style={S.chips}>
                  {["Mon–Fri 9:00–18:00 IST", "Sat 10:00–14:00"].map((c) => (
                    <span key={c} style={S.chip}>{c}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Address</div>
              <div style={S.muted}>TINITIATE Technologies Pvt. Ltd.</div>
              <div>Plot 123, Tech Park Road</div>
              <div>Hyderabad, Telangana 500081, India</div>
              <a
                style={{ ...S.btnLink, marginTop: 8, display: "inline-block" }}
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
              <div style={S.mapBox} aria-hidden />
            </div>

            <div style={S.card}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>FAQ</div>
              <div style={{ display: "grid", gap: 8 }}>
                {faqs.map((f, i) => {
                  const open = openFaq === i;
                  return (
                    <div key={f.q} style={S.accordion}>
                      <button
                        style={S.accBtn}
                        onClick={() => setOpenFaq(open ? -1 : i)}
                        aria-expanded={open}
                      >
                        {open ? "−" : "+"} {f.q}
                      </button>
                      <div style={{ ...S.accPanel, maxHeight: open ? 140 : 0 }} aria-hidden={!open}>
                        <p style={S.text}>{f.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        <footer style={S.footer}>
          <span>© {new Date().getFullYear()} TINITIATE • Contact</span>
          <span style={S.muted}>We usually reply within one business day.</span>
        </footer>
      </div>
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

    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, flexWrap: "wrap", marginBottom: 16,
    },
    brand: { display: "flex", alignItems: "center", gap: 12 },
    brandMark: {
      width: 28, height: 28, borderRadius: 8,
      background: "linear-gradient(135deg, rgba(59,130,246,1), rgba(14,165,233,1))",
      boxShadow: "0 6px 16px rgba(59,130,246,0.35)",
    },
    brandTitle: { fontWeight: 900, letterSpacing: "-0.01em" },
    brandSub: { fontSize: 13, color: "#475569" },

    btn: {
      padding: "10px 14px", background: "#2563eb", color: "#fff",
      border: "none", borderRadius: 10, fontWeight: 700,
      boxShadow: "0 10px 18px rgba(37,99,235,0.22)", textDecoration: "none",
    },
    btnLink: {
      padding: "8px 12px", background: "#eff6ff",
      border: "1px solid #bfdbfe", color: "#1d4ed8",
      borderRadius: 10, fontWeight: 700, textDecoration: "none",
    },
    ghost: {
      padding: "8px 12px", background: "white", color: "#0f172a",
      border: "1px solid #e2e8f0", borderRadius: 10, fontWeight: 600, cursor: "pointer",
    },

    hero: {
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
      boxShadow: "0 18px 40px rgba(2,6,23,0.06)", padding: 18, marginBottom: 14,
    },
    h1: { fontSize: 28, margin: "0 0 8px", letterSpacing: "-0.02em" },
    lead: { fontSize: 15, color: "#475569", maxWidth: 820 },

    layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: 14 },

    // Cards / inputs
    card: {
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
      boxShadow: "0 12px 24px rgba(2,6,23,0.06)", padding: 14,
    },
    h2: { fontSize: 20, margin: 0 },
    row: { display: "flex", gap: 10, flexWrap: "wrap" },
    rowBetween: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
    group: { display: "grid", gap: 6 },
    label: { fontSize: 12, fontWeight: 700 },
    input: {
      width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1",
      borderRadius: 12, outline: "none", background: "white", fontSize: 14,
    },
    textarea: {
      width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1",
      borderRadius: 12, outline: "none", background: "white", fontSize: 14, resize: "vertical",
      minHeight: 120,
    },
    inputError: { borderColor: "#fca5a5", boxShadow: "0 0 0 2px rgba(254,202,202,0.4)" },
    err: { color: "#b91c1c", fontSize: 12 },

    // Aside
    muted: { color: "#64748b", fontSize: 13 },
    mutedSmall: { color: "#64748b", fontSize: 12 },
    chips: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 },
    chip: {
      padding: "4px 8px", borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0",
      fontSize: 12, color: "#475569",
    },

    // Map placeholder
    mapBox: {
      marginTop: 10, height: 160, borderRadius: 12, border: "1px dashed #e2e8f0",
      background:
        "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(14,165,233,0.08))",
    },

    // FAQ accordion
    accordion: { border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" },
    accBtn: {
      width: "100%", textAlign: "left", padding: 10, border: "none", background: "#fff",
      fontWeight: 800, borderBottom: "1px solid #e2e8f0", cursor: "pointer",
    },
    accPanel: { overflow: "hidden", transition: "max-height .28s ease", padding: "0 10px" },
    text: { color: "#334155", lineHeight: 1.6 },

    // Footer
    footer: {
      marginTop: 18, paddingTop: 12, borderTop: "1px solid #e2e8f0",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 10, fontSize: 13,
    },

    // Toast
    toast: {
      position: "fixed", bottom: 18, right: 18, background: "white",
      border: "1px solid #e2e8f0", borderRadius: 12, padding: "8px 10px",
      boxShadow: "0 18px 40px rgba(2,6,23,0.12)", fontWeight: 700, zIndex: 50,
    },
  };
}


