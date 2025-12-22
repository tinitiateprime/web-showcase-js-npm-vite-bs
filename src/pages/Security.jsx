// File: src/pages/Security.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function Security() {
  const S = styles();

  // ---------- Defaults ----------
  const defaultSettings = {
    mfaEnabled: true,
    sessionTimeoutMin: 30,
    password: { min: 8, upper: true, number: true, symbol: false, expiryDays: 90 },
    ipLock: false,
    loginAlert: true,
  };

  const defaultRoles = [
    { id: "admin", name: "Admin", perms: ["users:read", "users:write", "keys:manage", "billing:read"] },
    { id: "editor", name: "Editor", perms: ["content:read", "content:write"] },
    { id: "viewer", name: "Viewer", perms: ["content:read"] },
  ];

  const defaultLogins = [
    { id: 1, when: new Date(Date.now() - 3600e3 * 2).toISOString(), ip: "103.24.6.12", device: "Chrome • Windows", ok: true },
    { id: 2, when: new Date(Date.now() - 3600e3 * 26).toISOString(), ip: "49.205.118.70", device: "Safari • iPhone", ok: true },
    { id: 3, when: new Date(Date.now() - 3600e3 * 54).toISOString(), ip: "185.44.102.3", device: "Edge • Mac", ok: true },
  ];

  // ---------- State (persisted) ----------
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sec.settings")) || defaultSettings; } catch { return defaultSettings; }
  });
  const [roles, setRoles] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sec.roles")) || defaultRoles; } catch { return defaultRoles; }
  });
  const [apiKeys, setApiKeys] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sec.keys")) || []; } catch { return []; }
  });

  // non-persisted
  const [recentLogins] = useState(defaultLogins);
  const [newKeyName, setNewKeyName] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => { try { localStorage.setItem("sec.settings", JSON.stringify(settings)); } catch {} }, [settings]);
  useEffect(() => { try { localStorage.setItem("sec.roles", JSON.stringify(roles)); } catch {} }, [roles]);
  useEffect(() => { try { localStorage.setItem("sec.keys", JSON.stringify(apiKeys)); } catch {} }, [apiKeys]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 1500);
    return () => clearTimeout(id);
  }, [toast]);

  // ---------- Helpers ----------
  const rand = (n) => {
    const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let s = "";
    for (let i = 0; i < n; i++) s += a[Math.floor(Math.random() * a.length)];
    return s;
  };
  const makeKey = () => {
    if (crypto?.getRandomValues) {
      const arr = new Uint8Array(32);
      crypto.getRandomValues(arr);
      return Array.from(arr, (b) => ("0" + b.toString(16)).slice(-2)).join("");
    }
    return rand(64);
  };

  const permsUniverse = useMemo(
    () => [
      "users:read","users:write","keys:manage","billing:read","content:read","content:write","content:publish",
    ],
    []
  );

  function toggleRole(roleId, perm) {
    setRoles((rs) =>
      rs.map((r) =>
        r.id !== roleId
          ? r
          : { ...r, perms: r.perms.includes(perm) ? r.perms.filter((p) => p !== perm) : [...r.perms, perm] }
      )
    );
  }

  function createKey() {
    const name = newKeyName.trim() || `Key ${apiKeys.length + 1}`;
    const key = makeKey();
    const k = { id: rand(10), name, key, createdAt: new Date().toISOString(), status: "active", lastUsed: null };
    setApiKeys((ks) => [k, ...ks]);
    setNewKeyName("");
    navigator.clipboard?.writeText(key);
    setToast("API key created & copied");
  }

  function revokeKey(id) {
    setApiKeys((ks) => ks.map((k) => (k.id === id ? { ...k, status: "revoked" } : k)));
  }

  function rotateKey(id) {
    setApiKeys((ks) =>
      ks.map((k) => (k.id === id ? { ...k, key: makeKey(), createdAt: new Date().toISOString() } : k))
    );
    setToast("API key rotated");
  }

  function copy(text) {
    navigator.clipboard?.writeText(text);
    setToast("Copied");
  }

  function downloadAudit() {
    const rows = [
      ["timestamp", "event", "ip", "device", "ok"],
      ...recentLogins.map((l) => [l.when, "login", l.ip, l.device, l.ok]),
      ...apiKeys.map((k) => [k.createdAt, "key_state", "-", k.name, k.status]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "audit-log.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const passLabel = [
    `${settings.password.min}+ chars`,
    settings.password.upper ? "A–Z" : null,
    settings.password.number ? "0–9" : null,
    settings.password.symbol ? "symbol" : null,
  ].filter(Boolean).join(", ");

  // ---------- UI ----------
  return (
    <div style={S.page}>
      {toast && <div style={S.toast}>{toast}</div>}

      <div style={S.container}>
        {/* Header */}
        <header style={S.header}>
          <div style={S.brand}>
            <div style={S.brandMark} />
            <div>
              <div style={S.title}>Security</div>
              <div style={S.sub}>MFA • Password policy • API keys • Roles & Permissions</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={S.btnGhost} onClick={downloadAudit}>Export audit CSV</button>
          </div>
        </header>

        {/* Layout */}
        <div style={S.grid}>
          {/* Settings */}
          <section style={S.card}>
            <div style={S.cardHead}>
              <strong>Account Protection</strong>
              <span style={S.badgeOk}>{settings.mfaEnabled ? "MFA ON" : "MFA OFF"}</span>
            </div>

            <div style={S.row}>
              <label style={S.label}>
                <input
                  type="checkbox"
                  checked={settings.mfaEnabled}
                  onChange={(e) => setSettings({ ...settings, mfaEnabled: e.target.checked })}
                />{" "}
                Enable Multi-Factor Authentication (recommended)
              </label>
            </div>

            <div style={S.row}>
              <div style={{ ...S.group, flex: 1 }}>
                <label style={S.small}>Session timeout (minutes)</label>
                <input
                  type="number"
                  min={5}
                  style={S.input}
                  value={settings.sessionTimeoutMin}
                  onChange={(e) => setSettings({ ...settings, sessionTimeoutMin: Number(e.target.value || 0) })}
                />
              </div>

              <div style={{ ...S.group, flex: 1 }}>
                <label style={S.small}>Password policy</label>
                <div style={S.stack}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={S.mutedSmall}>Min length</span>
                    <input
                      type="number"
                      min={6}
                      style={{ ...S.input, width: 90 }}
                      value={settings.password.min}
                      onChange={(e) =>
                        setSettings({ ...settings, password: { ...settings.password, min: Number(e.target.value || 0) } })
                      }
                    />
                    <label style={S.mutedSmall}>
                      <input
                        type="checkbox"
                        checked={settings.password.upper}
                        onChange={(e) =>
                          setSettings({ ...settings, password: { ...settings.password, upper: e.target.checked } })
                        }
                      /> A–Z
                    </label>
                    <label style={S.mutedSmall}>
                      <input
                        type="checkbox"
                        checked={settings.password.number}
                        onChange={(e) =>
                          setSettings({ ...settings, password: { ...settings.password, number: e.target.checked } })
                        }
                      /> 0–9
                    </label>
                    <label style={S.mutedSmall}>
                      <input
                        type="checkbox"
                        checked={settings.password.symbol}
                        onChange={(e) =>
                          setSettings({ ...settings, password: { ...settings.password, symbol: e.target.checked } })
                        }
                      /> Symbol
                    </label>
                  </div>
                  <div style={S.mutedSmall}>Policy: {passLabel}; Expiry: {settings.password.expiryDays} days</div>
                  <input
                    type="range"
                    min={30}
                    max={365}
                    value={settings.password.expiryDays}
                    onChange={(e) =>
                      setSettings({ ...settings, password: { ...settings.password, expiryDays: Number(e.target.value) } })
                    }
                  />
                </div>
              </div>
            </div>

            <div style={S.row}>
              <label style={S.label}>
                <input
                  type="checkbox"
                  checked={settings.ipLock}
                  onChange={(e) => setSettings({ ...settings, ipLock: e.target.checked })}
                />{" "}
                Lock sessions to originating IP (extra strict)
              </label>
            </div>
            <div style={S.row}>
              <label style={S.label}>
                <input
                  type="checkbox"
                  checked={settings.loginAlert}
                  onChange={(e) => setSettings({ ...settings, loginAlert: e.target.checked })}
                />{" "}
                Email me on new device login
              </label>
            </div>
          </section>

          {/* API Keys */}
          <section style={S.card}>
            <div style={S.cardHead}>
              <strong>API Keys</strong>
              <span style={S.mutedSmall}>{apiKeys.filter(k=>k.status==="active").length} active</span>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <input
                placeholder="Label (e.g., CI deploy)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                style={{ ...S.input, flex: 1, minWidth: 200 }}
              />
              <button style={S.btn} onClick={createKey}>Create key</button>
            </div>

            {apiKeys.length === 0 ? (
              <div style={S.empty}>No keys yet. Create a labeled key and store it securely.</div>
            ) : (
              <ul style={S.list}>
                {apiKeys.map((k) => (
                  <li key={k.id} style={S.item}>
                    <div style={{ display: "grid", gap: 4 }}>
                      <div style={{ fontWeight: 800 }}>{k.name} {k.status !== "active" && <span style={S.badgeWarn}>{k.status}</span>}</div>
                      <div style={S.mutedSmall}>Created: {new Date(k.createdAt).toLocaleString()}</div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <code style={S.code}>{k.key.slice(0, 8)}…{k.key.slice(-6)}</code>
                        <button style={S.ghost} onClick={() => copy(k.key)}>Copy</button>
                        <button style={S.ghost} onClick={() => rotateKey(k.id)}>Rotate</button>
                        <button style={S.danger} onClick={() => revokeKey(k.id)}>Revoke</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Roles & Permissions */}
          <section style={S.card}>
            <div style={S.cardHead}><strong>Roles & Permissions</strong></div>
            <div style={{ overflowX: "auto" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Role</th>
                    {permsUniverse.map((p) => <th key={p} style={S.th}>{p}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {roles.map((r) => (
                    <tr key={r.id}>
                      <td style={S.tdBold}>{r.name}</td>
                      {permsUniverse.map((p) => (
                        <td key={p} style={S.tdCenter}>
                          <input
                            type="checkbox"
                            checked={r.perms.includes(p)}
                            onChange={() => toggleRole(r.id, p)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent logins */}
          <section style={S.card}>
            <div style={S.cardHead}><strong>Recent Logins</strong></div>
            <ul style={S.list}>
              {recentLogins.map((l) => (
                <li key={l.id} style={S.item}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{new Date(l.when).toLocaleString()}</div>
                    <div style={S.muted}>{l.device}</div>
                  </div>
                  <div>
                    <div style={S.mutedSmall}>{l.ip}</div>
                    <div style={{ textAlign: "right" }}>{l.ok ? <span style={S.badgeOk}>OK</span> : <span style={S.badgeWarn}>Blocked</span>}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer style={S.footer}>
          <span>© {new Date().getFullYear()} TINITIATE • Security</span>
          <span style={S.mutedSmall}>Settings are saved locally to your browser for demo purposes.</span>
        </footer>
      </div>
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

    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 },

    card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 14, boxShadow: "0 12px 24px rgba(2,6,23,0.06)", display: "grid", gap: 10 },
    cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between" },

    row: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
    stack: { display: "grid", gap: 6 },
    group: { display: "grid", gap: 6 },
    input: { padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 12, outline: "none", background: "white", fontSize: 14 },

    list: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 },
    item: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, border: "1px solid #eef2f7", borderRadius: 12, padding: 10 },

    table: { width: "100%", borderCollapse: "separate", borderSpacing: 0 },
    th: { textAlign: "left", padding: "8px 10px", fontSize: 12, color: "#475569", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, background: "white" },
    tdBold: { padding: "10px", fontWeight: 800, borderTop: "1px solid #f1f5f9" },
    tdCenter: { padding: "10px", textAlign: "center", borderTop: "1px solid #f1f5f9" },

    code: { padding: "2px 6px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" },

    btn: { padding: "10px 14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, boxShadow: "0 10px 18px rgba(37,99,235,0.22)", cursor: "pointer" },
    btnGhost: { padding: "10px 14px", background: "white", color: "#0f172a", border: "1px solid #e2e8f0", borderRadius: 10, fontWeight: 700, cursor: "pointer" },
    danger: { padding: "6px 10px", background: "#fff1f2", color: "#991b1b", border: "1px solid #fecdd3", borderRadius: 10, cursor: "pointer", fontWeight: 700 },

    muted: { color: "#64748b", fontSize: 13 },
    mutedSmall: { color: "#64748b", fontSize: 12 },

    badgeOk: { display: "inline-block", padding: "2px 8px", borderRadius: 999, background: "#ecfdf5", color: "#166534", border: "1px solid #86efac", fontWeight: 800, fontSize: 12 },
    badgeWarn: { display: "inline-block", padding: "2px 8px", borderRadius: 999, background: "#fff7ed", color: "#7c2d12", border: "1px solid #fdba74", fontWeight: 800, fontSize: 12 },

    empty: { padding: 12, border: "1px dashed #e2e8f0", borderRadius: 12, background: "#f8fafc", color: "#475569" },

    footer: { marginTop: 16, paddingTop: 12, borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 13 },

    toast: { position: "fixed", bottom: 18, right: 18, background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "8px 10px", boxShadow: "0 18px 40px rgba(2,6,23,0.12)", fontWeight: 700, zIndex: 50 },
  };
}
