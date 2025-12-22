// File: src/LoginPage.jsx
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const styles = {
    page: {
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background:
        "radial-gradient(1000px 300px at 80% -10%, rgba(59,130,246,0.12), transparent 60%), #f8fafc",
      fontFamily:
        "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      color: "#0f172a",
    },
    card: {
      width: "100%",
      maxWidth: 420,
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      boxShadow: "0 18px 40px rgba(2,6,23,0.08)",
      padding: 24,
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
    },
    brandMark: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background:
        "linear-gradient(135deg, rgba(59,130,246,1) 0%, rgba(14,165,233,1) 100%)",
      boxShadow: "0 6px 16px rgba(59,130,246,0.35)",
    },
    brandText: { fontWeight: 800, fontSize: 18, letterSpacing: 0.2 },
    title: { margin: "6px 0 2px", fontSize: 22, letterSpacing: "-0.02em" },
    sub: { color: "#475569", fontSize: 14, marginBottom: 14 },

    form: { marginTop: 6, display: "grid", gap: 12 },

    labelRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    label: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
    inputWrap: { position: "relative" },
    input: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: 14,
      background: "#fff",
    },
    togglePwd: {
      position: "absolute",
      right: 8,
      top: "50%",
      transform: "translateY(-50%)",
      padding: "6px 10px",
      borderRadius: 8,
      border: "1px solid #e2e8f0",
      background: "#fff",
      fontSize: 12,
      cursor: "pointer",
    },
    err: { color: "#b91c1c", fontSize: 12, marginTop: 6 },
    row: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    checkRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 13 },
    link: { fontSize: 13, textDecoration: "none", color: "#2563eb" },

    btn: {
      width: "100%",
      padding: "12px 16px",
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 12,
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 10px 18px rgba(37,99,235,0.22)",
    },
    btnDisabled: { opacity: 0.85, cursor: "not-allowed" },
    hint: { marginTop: 10, fontSize: 12, color: "#64748b" },

    divider: {
      margin: "12px 0",
      height: 1,
      background: "#e2e8f0",
      border: "none",
    },

    success: {
      marginTop: 8,
      padding: "10px 12px",
      borderRadius: 12,
      background: "#ecfdf5",
      color: "#065f46",
      border: "1px solid #a7f3d0",
      fontSize: 13,
    },
  };

  function validate() {
    const next = {};
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) next.email = "Enter a valid email address.";
    if (!pwd) next.pwd = "Password is required.";
    return next;
  }

  function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    // Simulate async login
    setTimeout(() => {
      setLoading(false);
      setSignedIn(true);
      // TODO: replace with your navigation (e.g., navigate('/dashboard'))
    }, 900);
  }

  const emailErrId = errors.email ? "email-err" : undefined;
  const pwdErrId = errors.pwd ? "pwd-err" : undefined;

  return (
    <div style={styles.page}>
      <main style={styles.card} aria-label="Sign in form">
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.brandMark} />
          <div style={styles.brandText}>TINITIATE</div>
        </div>

        {/* Heading */}
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.sub}>Sign in to your account</p>

        {/* Form */}
        <form onSubmit={onSubmit} style={styles.form} noValidate>
          {/* Email */}
          <div>
            <div style={styles.labelRow}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
            </div>
            <div style={styles.inputWrap}>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  ...styles.input,
                  borderColor: errors.email ? "#ef4444" : "#cbd5e1",
                }}
                aria-invalid={!!errors.email}
                aria-describedby={emailErrId}
                autoComplete="username"
              />
            </div>
            {errors.email && (
              <div id={emailErrId} style={styles.err} role="alert">
                {errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <div style={styles.labelRow}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <a href="#forgot" style={styles.link}>
                Forgot password?
              </a>
            </div>
            <div style={styles.inputWrap}>
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                style={{
                  ...styles.input,
                  borderColor: errors.pwd ? "#ef4444" : "#cbd5e1",
                  paddingRight: 88,
                }}
                aria-invalid={!!errors.pwd}
                aria-describedby={pwdErrId}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                style={styles.togglePwd}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            {errors.pwd && (
              <div id={pwdErrId} style={styles.err} role="alert">
                {errors.pwd}
              </div>
            )}
          </div>

          {/* Remember + submit */}
          <div style={styles.row}>
            <label style={styles.checkRow}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : null) }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {signedIn && (
          <div style={styles.success} aria-live="polite">
            Signed in! Replace this with your redirect/navigation.
          </div>
        )}

        <hr style={styles.divider} />
        <p style={styles.hint}>
          By continuing you agree to our <a href="#terms" style={styles.link}>Terms</a>{" "}
          and <a href="#privacy" style={styles.link}>Privacy Policy</a>.
        </p>
      </main>
    </div>
  );
}
