// File: src/pages/Signup.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const S = styles();
  const nav = useNavigate();

  // ---------------- State ----------------
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({ pass: false, confirm: false });
  const [toast, setToast] = useState("");

  // ---------------- Helpers ----------------
  const trim = (s) => (s || "").trim();
  const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || "");
  const scorePwd = (p) => {
    let s = 0;
    if ((p || "").length >= 8) s++;
    if (/[A-Z]/.test(p || "")) s++;
    if (/[a-z]/.test(p || "")) s++;
    if (/\d/.test(p || "")) s++;
    if (/[^A-Za-z0-9]/.test(p || "")) s++;
    return s; // 0..5
  };

  function validate(f) {
    const err = {};
    if (!trim(f.name)) err.name = "Please enter your full name.";
    if (!emailOk(f.email)) err.email = "Enter a valid email address.";
    const sc = scorePwd(f.password || "");
    if (sc < 3) err.password = "Password should be 8+ chars with a mix of letters & numbers.";
    if (trim(f.confirm) !== trim(f.password)) err.confirm = "Passwords do not match.";
    if (!f.agree) err.agree = "You must accept the Terms & Privacy.";
    return err;
  }

  function submit(evt) {
    evt.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    // Simulate user creation (localStorage)
    try {
      const users = JSON.parse(localStorage.getItem("demo.users") || "[]");
      if (users.some((u) => (u.email || "").toLowerCase() === (form.email || "").toLowerCase())) {
        setErrors({ email: "This email is already registered." });
        return;
      }
      users.push({
        name: trim(form.name),
        email: trim(form.email),
        phone: trim(form.phone),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("demo.users", JSON.stringify(users));
      setToast("Account created. Redirecting to login…");
      setTimeout(() => nav("/login"), 1200);
    } catch {
      setToast("Saved locally. Redirecting…");
      setTimeout(() => nav("/login"), 1200);
    }
  }

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  const pwdScore = scorePwd(form.password || "");
  const pwdLabel =
    pwdScore >= 5 ? "Very strong" :
    pwdScore === 4 ? "Strong" :
    pwdScore === 3 ? "OK" :
    pwdScore === 2 ? "Weak" : "Very weak";

  // ---------------- UI ----------------
  return (
    <div style={S.page}>
      {toast && <div style={S.toast}>{toast}</div>}

      <div style={S.container}>
        {/* Header / Brand */}
        <header style={S.header}>
          <div style={S.brand}>
            <div style={S.brandMark} />
            <div>
              <div style={S.brandTitle}>Create your account</div>
              <div style={S.brandSub}>It’s fast and free</div>
            </div>
          </div>
          <Link to="/login" style={S.btnGhost}>Log in</Link>
        </header>

        {/* Card */}
        <section style={S.card}>
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <div style={S.row}>
              <div style={{ ...S.group, flex: 1 }}>
                <label style={S.label}>Full name *</label>
                <input
                  style={{ ...S.input, ...(errors.name ? S.inputError : null) }}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <div style={S.err}>{errors.name}</div>}
              </div>

              <div style={{ ...S.group, flex: 1 }}>
                <label style={S.label}>Email *</label>
                <input
                  type="email"
                  style={{ ...S.input, ...(errors.email ? S.inputError : null) }}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <div style={S.err}>{errors.email}</div>}
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
                <label style={S.label}>Password *</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={show.pass ? "text" : "password"}
                    style={{ ...S.input, paddingRight: 84, ...(errors.password ? S.inputError : null) }}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => ({ ...s, pass: !s.pass }))}
                    style={S.peek}
                  >
                    {show.pass ? "Hide" : "Show"}
                  </button>
                </div>

                <div style={S.meterWrap} aria-hidden>
                  <div style={{ ...S.meter, width: `${(pwdScore / 5) * 100}%` }} />
                </div>
                <div style={S.mutedSmall}>Strength: {pwdLabel}</div>
                {errors.password && <div style={S.err}>{errors.password}</div>}
              </div>
            </div>

            <div style={S.group}>
              <label style={S.label}>Confirm password *</label>
              <div style={{ position: "relative" }}>
                <input
                  type={show.confirm ? "text" : "password"}
                  style={{ ...S.input, paddingRight: 84, ...(errors.confirm ? S.inputError : null) }}
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  aria-invalid={!!errors.confirm}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                  style={S.peek}
                >
                  {show.confirm ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirm && <div style={S.err}>{errors.confirm}</div>}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                />
                <span>
                  I agree to the{" "}
                  <a href="/terms" style={S.link}>Terms</a> and{" "}
                  <a href="/privacy" style={S.link}>Privacy</a>.
                </span>
              </label>
              {errors.agree && <div style={{ ...S.err, marginLeft: 8 }}>{errors.agree}</div>}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button type="submit" style={S.btnPrimary}>Create account</button>
              <div style={S.mutedSmall}>
                Already have an account? <Link to="/login" style={S.link}>Log in</Link>
              </div>
            </div>

            <div style={S.hr}><span style={S.hrText}>or continue with</span></div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" style={S.btnGhost}>Google</button>
              <button type="button" style={S.btnGhost}>GitHub</button>
              <button type="button" style={S.btnGhost}>Microsoft</button>
            </div>

            <ul style={S.tips}>
              <li>Use at least 8 characters.</li>
              <li>Add numbers and symbols to increase strength.</li>
              <li>Avoid reusing passwords from other sites.</li>
            </ul>
          </form>
        </section>

        <footer style={S.footer}>
          <span>© {new Date().getFullYear()} TINITIATE • Signup</span>
          <span style={S.muted}>Demo-only: accounts are saved to your browser (localStorage).</span>
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
        "radial-gradient(1200px 300px at 80% -10%, rgba(99,102,241,0.10), transparent 60%), #f8fafc",
      color: "#0f172a",
      fontFamily:
        "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    container: { width: "min(980px, 96vw)", margin: "0 auto", padding: "24px 20px" },

    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, flexWrap: "wrap", marginBottom: 12,
    },
    brand: { display: "flex", alignItems: "center", gap: 12 },
    brandMark: {
      width: 30, height: 30, borderRadius: 10,
      background: "linear-gradient(135deg, #6366f1, #22d3ee)",
      boxShadow: "0 8px 22px rgba(99,102,241,0.35)",
    },
    brandTitle: { fontWeight: 900, letterSpacing: "-0.01em" },
    brandSub: { fontSize: 12, color: "#64748b" },

    card: {
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
      boxShadow: "0 18px 40px rgba(2,6,23,0.06)", padding: 16,
    },

    row: { display: "flex", gap: 10, flexWrap: "wrap" },
    group: { display: "grid", gap: 6 },
    label: { fontSize: 12, fontWeight: 800 },
    input: {
      width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1",
      borderRadius: 12, outline: "none", background: "white", fontSize: 14,
    },
    inputError: { borderColor: "#fca5a5", boxShadow: "0 0 0 2px rgba(254,202,202,0.4)" },
    err: { color: "#b91c1c", fontSize: 12 },

    peek: {
      position: "absolute", right: 6, top: 6,
      padding: "6px 10px", borderRadius: 10, border: "1px solid #e2e8f0",
      background: "#fff", cursor: "pointer", fontWeight: 700,
    },

    meterWrap: {
      width: "100%", height: 8, borderRadius: 8, background: "#eef2ff", marginTop: 6, overflow: "hidden",
    },
    meter: {
      height: "100%", background: "linear-gradient(90deg, #22d3ee, #6366f1)",
      transition: "width .25s ease",
    },

    btnPrimary: {
      padding: "10px 14px", background: "linear-gradient(90deg, #6366f1, #22d3ee)",
      color: "#fff", border: "none", borderRadius: 10, fontWeight: 800,
      boxShadow: "0 10px 22px rgba(34,211,238,0.25)", cursor: "pointer",
    },
    btnGhost: {
      padding: "10px 14px", background: "#fff", color: "#0f172a",
      border: "1px solid #e2e8f0", borderRadius: 10, fontWeight: 700, cursor: "pointer",
    },
    link: { color: "#1d4ed8", textDecoration: "none" },

    tips: { margin: "6px 0 0 18px", color: "#334155" },
    muted: { color: "#64748b", fontSize: 13 },
    mutedSmall: { color: "#64748b", fontSize: 12 },

    footer: {
      marginTop: 16, paddingTop: 12, borderTop: "1px solid #e2e8f0",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 10, fontSize: 13,
    },

    toast: {
      position: "fixed", bottom: 18, right: 18, background: "white",
      border: "1px solid #e2e8f0", borderRadius: 12, padding: "8px 10px",
      boxShadow: "0 18px 40px rgba(2,6,23,0.12)", fontWeight: 700, zIndex: 50,
    },

    hr: {
      position: "relative",
      marginTop: 6,
      paddingTop: 10,
      borderTop: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "center",
    },
    hrText: {
      marginTop: -20,
      background: "#fff",
      padding: "0 10px",
      color: "#64748b",
      fontSize: 12,
      fontWeight: 800,
    },
  };
}
