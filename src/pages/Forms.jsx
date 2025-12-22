// File: src/FormPage.jsx
import React, { useMemo, useState } from "react";

export default function FormPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    projectType: "Web App",
    budget: "",
    startDate: "",
    heardFrom: "",
    message: "",
    terms: false,
    brief: null, // File
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const maxMsg = 400;

  const styles = useMemo(() => ({
    page: {
      minHeight: "100vh",
      background: "#f8fafc",
      color: "#0f172a",
      fontFamily:
        "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    container: { maxWidth: 980, margin: "0 auto", padding: "24px 20px" },

    // Header
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      flexWrap: "wrap",
      marginBottom: 14,
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

    // Card
    card: {
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      boxShadow: "0 18px 40px rgba(2,6,23,0.06)",
      padding: 20,
    },

    // Grid
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 14,
    },

    // Controls
    group: { display: "grid", gap: 6 },
    labelRow: { display: "flex", alignItems: "baseline", justifyContent: "space-between" },
    label: { fontSize: 13, fontWeight: 600 },
    req: { color: "#ef4444", marginLeft: 4 },
    hint: { fontSize: 12, color: "#64748b" },

    input: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: 14,
      background: "#fff",
    },
    invalid: { borderColor: "#ef4444", background: "#fff7f7" },

    select: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid #cbd5e1",
      background: "white",
      fontSize: 14,
      outline: "none",
    },

    textarea: {
      width: "100%",
      minHeight: 120,
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid #cbd5e1",
      outline: "none",
      fontSize: 14,
      resize: "vertical",
    },

    row: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },

    radioWrap: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      padding: 8,
      border: "1px solid #e2e8f0",
      borderRadius: 12,
      background: "#fafcff",
    },

    file: {
      padding: 12,
      border: "1px dashed #cbd5e1",
      borderRadius: 12,
      background: "#f8fafc",
      fontSize: 13,
      color: "#475569",
    },

    err: { color: "#b91c1c", fontSize: 12 },

    // Footer buttons
    actions: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 },
    btnPrimary: {
      padding: "12px 16px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: 12,
      fontWeight: 700,
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
    btnDisabled: { opacity: 0.7, cursor: "not-allowed" },

    // Success
    success: {
      marginTop: 12,
      padding: 12,
      borderRadius: 12,
      background: "#ecfdf5",
      color: "#065f46",
      border: "1px solid #a7f3d0",
      fontSize: 13,
    },

    // Count
    count: { fontSize: 12, color: "#64748b" },
  }), []);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }
  function onBlur(name) {
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function validate(values) {
    const next = {};
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());
    const phoneOk =
      !values.phone || /^[\d\s\-()+]{7,16}$/.test(values.phone.trim());
    if (!values.fullName.trim()) next.fullName = "Name is required.";
    if (!emailOk) next.email = "Enter a valid email.";
    if (!phoneOk) next.phone = "Enter a valid phone number.";
    if (!values.budget) next.budget = "Select a budget.";
    if (!values.message.trim()) next.message = "Message is required.";
    if (values.message.trim().length < 10)
      next.message = "Message should be at least 10 characters.";
    if (!values.terms) next.terms = "Please accept the terms.";
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setTouched(Object.fromEntries(Object.keys(form).map((k) => [k, true])));
    if (Object.keys(v).length) return;

    setLoading(true);
    // Simulate API
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // Reset (keep email/name if you want)
      // setForm({ ...initial })
    }, 900);
  }

  function resetForm() {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      role: "",
      projectType: "Web App",
      budget: "",
      startDate: "",
      heardFrom: "",
      message: "",
      terms: false,
      brief: null,
    });
    setErrors({});
    setTouched({});
    setSubmitted(false);
  }

  const msgCount = `${form.message.length}/${maxMsg}`;
  const msgTooLong = form.message.length > maxMsg;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.brandMark} />
            <span>Project enquiry</span>
          </div>
        </div>

        {/* Card / Form */}
        <form style={styles.card} noValidate onSubmit={handleSubmit}>
          <div className="grid" style={styles.grid}>
            {/* Full name */}
            <div style={styles.group}>
              <div style={styles.labelRow}>
                <label htmlFor="fullName" style={styles.label}>
                  Full name <span style={styles.req}>*</span>
                </label>
                <span style={styles.hint}>As on your ID or company records</span>
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Jane Doe"
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                onBlur={() => onBlur("fullName")}
                style={{
                  ...styles.input,
                  ...(touched.fullName && errors.fullName ? styles.invalid : null),
                }}
                aria-invalid={!!(touched.fullName && errors.fullName)}
                aria-describedby={errors.fullName ? "err-fullName" : undefined}
                autoComplete="name"
              />
              {touched.fullName && errors.fullName && (
                <div id="err-fullName" style={styles.err} role="alert">
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Email */}
            <div style={styles.group}>
              <div style={styles.labelRow}>
                <label htmlFor="email" style={styles.label}>
                  Email <span style={styles.req}>*</span>
                </label>
                <span style={styles.hint}>We’ll never share your email</span>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => onBlur("email")}
                style={{
                  ...styles.input,
                  ...(touched.email && errors.email ? styles.invalid : null),
                }}
                aria-invalid={!!(touched.email && errors.email)}
                aria-describedby={errors.email ? "err-email" : undefined}
                autoComplete="email"
              />
              {touched.email && errors.email && (
                <div id="err-email" style={styles.err} role="alert">
                  {errors.email}
                </div>
              )}
            </div>

            {/* Phone */}
            <div style={styles.group}>
              <div style={styles.labelRow}>
                <label htmlFor="phone" style={styles.label}>Phone</label>
                <span style={styles.hint}>Optional</span>
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98xxxxxx"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                onBlur={() => onBlur("phone")}
                style={{
                  ...styles.input,
                  ...(touched.phone && errors.phone ? styles.invalid : null),
                }}
                aria-invalid={!!(touched.phone && errors.phone)}
                aria-describedby={errors.phone ? "err-phone" : undefined}
                autoComplete="tel"
              />
              {touched.phone && errors.phone && (
                <div id="err-phone" style={styles.err} role="alert">
                  {errors.phone}
                </div>
              )}
            </div>

            {/* Company */}
            <div style={styles.group}>
              <div style={styles.labelRow}>
                <label htmlFor="company" style={styles.label}>Company</label>
                <span style={styles.hint}>Optional</span>
              </div>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="TINITIATE Technologies"
                value={form.company}
                onChange={(e) => setField("company", e.target.value)}
                onBlur={() => onBlur("company")}
                style={styles.input}
                autoComplete="organization"
              />
            </div>

            {/* Role */}
            <div style={styles.group}>
              <div style={styles.labelRow}>
                <label htmlFor="role" style={styles.label}>Your role</label>
                <span style={styles.hint}>Optional</span>
              </div>
              <input
                id="role"
                name="role"
                type="text"
                placeholder="Founder / Product Manager / Student"
                value={form.role}
                onChange={(e) => setField("role", e.target.value)}
                onBlur={() => onBlur("role")}
                style={styles.input}
              />
            </div>

            {/* Project type (radio group) */}
            <div style={styles.group}>
              <div style={styles.labelRow}>
                <span style={styles.label}>Project type</span>
              </div>
              <div style={styles.radioWrap}>
                {["Web App", "Mobile App", "Consulting", "Training"].map((t) => (
                  <label key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="radio"
                      name="projectType"
                      value={t}
                      checked={form.projectType === t}
                      onChange={(e) => setField("projectType", e.target.value)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div style={styles.group}>
              <div style={styles.labelRow}>
                <label htmlFor="budget" style={styles.label}>
                  Budget <span style={styles.req}>*</span>
                </label>
              </div>
              <select
                id="budget"
                name="budget"
                value={form.budget}
                onChange={(e) => setField("budget", e.target.value)}
                onBlur={() => onBlur("budget")}
                style={{
                  ...styles.select,
                  ...(touched.budget && errors.budget ? styles.invalid : null),
                }}
                aria-invalid={!!(touched.budget && errors.budget)}
                aria-describedby={errors.budget ? "err-budget" : undefined}
              >
                <option value="">Select budget</option>
                <option value="25k-100k">₹25k – ₹1L</option>
                <option value="1L-5L">₹1L – ₹5L</option>
                <option value="5L-15L">₹5L – ₹15L</option>
                <option value="15L+">₹15L+</option>
              </select>
              {touched.budget && errors.budget && (
                <div id="err-budget" style={styles.err} role="alert">
                  {errors.budget}
                </div>
              )}
            </div>

            {/* Start date */}
            <div style={styles.group}>
              <div style={styles.labelRow}>
                <label htmlFor="startDate" style={styles.label}>Target start date</label>
                <span style={styles.hint}>Optional</span>
              </div>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
                onBlur={() => onBlur("startDate")}
                style={styles.input}
              />
            </div>

            {/* Heard from */}
            <div style={styles.group}>
              <div style={styles.labelRow}>
                <label htmlFor="heardFrom" style={styles.label}>How did you hear about us?</label>
                <span style={styles.hint}>Optional</span>
              </div>
              <select
                id="heardFrom"
                name="heardFrom"
                value={form.heardFrom}
                onChange={(e) => setField("heardFrom", e.target.value)}
                onBlur={() => onBlur("heardFrom")}
                style={styles.select}
              >
                <option value="">Select…</option>
                <option value="Google">Google</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Campus">Campus event</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* File */}
            <div style={styles.group}>
              <div style={styles.labelRow}>
                <label htmlFor="brief" style={styles.label}>Attach brief (optional)</label>
                <span style={styles.hint}>PDF/DOC/TXT, ≤5MB</span>
              </div>
              <input
                id="brief"
                name="brief"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && f.size > 5 * 1024 * 1024) {
                    setErrors((er) => ({ ...er, brief: "File must be ≤ 5MB." }));
                  } else {
                    setErrors((er) => {
                      const { brief, ...rest } = er;
                      return rest;
                    });
                    setField("brief", f || null);
                  }
                }}
                style={styles.file}
              />
              {errors.brief && (
                <div style={styles.err} role="alert">{errors.brief}</div>
              )}
              {form.brief && (
                <div style={styles.hint}>Selected: {form.brief.name}</div>
              )}
            </div>

            {/* Message (full width) */}
            <div style={{ gridColumn: "1 / -1", ...styles.group }}>
              <div style={styles.labelRow}>
                <label htmlFor="message" style={styles.label}>
                  Project details <span style={styles.req}>*</span>
                </label>
                <span style={{ ...styles.count, color: msgTooLong ? "#b91c1c" : "#64748b" }}>
                  {msgCount}
                </span>
              </div>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us about your goals, timeline, and constraints…"
                value={form.message}
                onChange={(e) => setField("message", e.target.value.slice(0, maxMsg + 1))}
                onBlur={() => onBlur("message")}
                style={{
                  ...styles.textarea,
                  ...(touched.message && errors.message ? styles.invalid : null),
                }}
                aria-invalid={!!(touched.message && errors.message)}
                aria-describedby={errors.message ? "err-message" : undefined}
              />
              {touched.message && errors.message && (
                <div id="err-message" style={styles.err} role="alert">
                  {errors.message}
                </div>
              )}
            </div>

            {/* Terms (full width) */}
            <div style={{ gridColumn: "1 / -1", ...styles.group }}>
              <label style={styles.row}>
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) => setField("terms", e.target.checked)}
                  onBlur={() => onBlur("terms")}
                />
                I agree to the{" "}
                <a href="#terms" style={{ color: "#2563eb", textDecoration: "none" }}>
                  Terms
                </a>{" "}
                and{" "}
                <a href="#privacy" style={{ color: "#2563eb", textDecoration: "none" }}>
                  Privacy Policy
                </a>
                <span style={styles.req}>*</span>
              </label>
              {touched.terms && errors.terms && (
                <div style={styles.err} role="alert">{errors.terms}</div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="submit"
              style={{ ...styles.btnPrimary, ...(loading ? styles.btnDisabled : null) }}
              disabled={loading}
            >
              {loading ? "Submitting…" : "Submit request"}
            </button>
            <button type="button" style={styles.btnGhost} onClick={resetForm}>
              Reset
            </button>
          </div>

          {/* Success */}
          {submitted && (
            <div style={styles.success} aria-live="polite">
              Thanks! Your request has been received. We’ll get back to you shortly.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
