// File: src/HelpPage.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function HelpPage() {
  const S = styles();

  // ---------------- Demo KB Data (replace with your real content) ----------------
  const categories = useMemo(
    () => [
      {
        id: "getting-started",
        title: "Getting Started",
        desc: "Install, project setup, first steps.",
        articles: [
          {
            id: "gs-setup",
            title: "Project setup & first run",
            tags: ["install", "vite", "nextjs"],
            body: [
              "Create a new project (Vite or Next.js).",
              "Install dependencies with npm or yarn.",
              "Start the dev server and verify the home page.",
            ],
          },
          {
            id: "gs-structure",
            title: "Recommended folder structure",
            tags: ["structure", "folders"],
            body: [
              "Keep components in /src/components.",
              "Use pages/routes for top-level views.",
              "Place assets under /public or a dedicated /assets folder.",
            ],
          },
          {
            id: "gs-env",
            title: "Environment variables (.env)",
            tags: ["env", "config"],
            body: [
              "Create .env.local for secrets in development.",
              "Prefix client-side vars as needed (e.g., VITE_ for Vite).",
              "Never commit secrets to git.",
            ],
          },
        ],
      },
      {
        id: "account-billing",
        title: "Account & Billing",
        desc: "Profile, subscriptions, invoices.",
        articles: [
          {
            id: "ab-update",
            title: "Update profile & password",
            tags: ["account", "security"],
            body: [
              "Open Profile → Security.",
              "Use a strong password (12+ chars).",
              "Enable 2FA where available.",
            ],
          },
          {
            id: "ab-invoices",
            title: "Download past invoices",
            tags: ["billing", "gst", "invoice"],
            body: [
              "Navigate to Billing → Invoices.",
              "Choose a month and click Download PDF.",
              "For GST info, ensure your GSTIN is saved in profile.",
            ],
          },
        ],
      },
      {
        id: "tech-support",
        title: "Technical Support",
        desc: "Errors, performance, compatibility.",
        articles: [
          {
            id: "ts-errors",
            title: "Fix common build errors",
            tags: ["npm", "deps", "build"],
            body: [
              "Delete node_modules and lockfile, reinstall.",
              "Check exact peer dependency ranges.",
              "Clear cache: npm cache clean --force, then reinstall.",
            ],
          },
          {
            id: "ts-performance",
            title: "Improve page load performance",
            tags: ["lighthouse", "images"],
            body: [
              "Serve optimized images (WebP/AVIF) with responsive sizes.",
              "Enable code splitting and lazy loading.",
              "Use HTTP caching and preconnect/preload where appropriate.",
            ],
          },
          {
            id: "ts-accessibility",
            title: "Accessibility checks",
            tags: ["a11y"],
            body: [
              "Provide alt text for images.",
              "Ensure keyboard focus states.",
              "Use semantic headings and landmarks.",
            ],
          },
        ],
      },
      {
        id: "training-docs",
        title: "Training & Docs",
        desc: "Guides, tutorials, best practices.",
        articles: [
          {
            id: "td-guides",
            title: "Authoring guides in Markdown",
            tags: ["docs", "md"],
            body: [
              "Use a simple, consistent heading hierarchy.",
              "Keep examples short; link to full repos.",
              "Add 'Expected Output' sections for code samples.",
            ],
          },
          {
            id: "td-style",
            title: "Documentation style guide",
            tags: ["style", "docs"],
            body: [
              "Prefer active voice, short sentences.",
              "Explain terms before you use them.",
              "Show steps as numbered lists for clarity.",
            ],
          },
        ],
      },
    ],
    []
  );

  const allArticles = useMemo(
    () => categories.flatMap((c) => c.articles.map((a) => ({ ...a, category: c.id }))),
    [categories]
  );

  const faqs = [
    { q: "How do I contact support?", a: "Use the Submit Ticket button or email support@example.com with logs and steps." },
    { q: "What is your SLA?", a: "We respond within one business day; critical incidents are prioritized." },
    { q: "Do you offer training?", a: "Yes—onsite and remote workshops. See Training & Docs for details." },
    { q: "Can I self-host?", a: "Yes. We provide deployment guides and Terraform examples upon request." },
  ];

  // ---------------- State ----------------
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const [expanded, setExpanded] = useState(() => new Set()); // expanded article ids
  const [openFaq, setOpenFaq] = useState(-1);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [votes, setVotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("kb.votes") || "{}");
    } catch {
      return {};
    }
  });

  // Ticket form
  const [ticket, setTicket] = useState({
    name: "",
    email: "",
    subject: "",
    category: categories[0].id,
    message: "",
  });

  useEffect(() => {
    try {
      localStorage.setItem("kb.votes", JSON.stringify(votes));
    } catch {}
  }, [votes]);

  // ---------------- Derived ----------------
  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCat) || categories[0],
    [categories, activeCat]
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allArticles
      .map((a) => ({
        ...a,
        score:
          (a.title.toLowerCase().includes(q) ? 3 : 0) +
          (a.tags?.some((t) => t.toLowerCase().includes(q)) ? 2 : 0) +
          (a.body?.some((b) => b.toLowerCase().includes(q)) ? 1 : 0),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [allArticles, query]);

  // ---------------- Handlers ----------------
  function toggleArticle(id) {
    setExpanded((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function vote(id, v) {
    setVotes((cur) => ({ ...cur, [id]: v })); // v: 'up' | 'down'
  }

  function copyLink(id) {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  function submitTicket(e) {
    e.preventDefault();
    const { name, email, subject, message } = ticket;
    if (!name || !email || !subject || !message) {
      alert("Please fill in all required fields.");
      return;
    }
    alert(
      [
        "Ticket submitted ✅",
        `Name: ${name}`,
        `Email: ${email}`,
        `Category: ${ticket.category}`,
        `Subject: ${subject}`,
        `Message: ${message.slice(0, 200)}${message.length > 200 ? "..." : ""}`,
      ].join("\n")
    );
    setTicketOpen(false);
    setTicket({ name: "", email: "", subject: "", category: activeCat, message: "" });
  }

  // ---------------- UI ----------------
  return (
    <div style={S.page}>
      {/* small toast */}
      {copied && <div style={S.toast}>Link copied</div>}

      <div style={S.container}>
        {/* Header */}
        <header style={S.header}>
          <div style={S.brand}>
            <div style={S.brandMark} />
            <div>
              <div style={S.brandTitle}>Help Center</div>
              <div style={S.brandSub}>Docs • Troubleshooting • Contact</div>
            </div>
          </div>
          <div style={S.headerRight}>
            <StatusPill />
            <button style={S.btn} onClick={() => setTicketOpen(true)}>Submit Ticket</button>
          </div>
        </header>

        {/* Search */}
        <div style={S.searchBar}>
          <input
            type="search"
            placeholder="Search articles (e.g., invoices, images, .env)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={S.search}
            aria-label="Search help articles"
          />
          {query && (
            <button style={S.ghost} onClick={() => setQuery("")}>
              Clear
            </button>
          )}
        </div>

        {/* Layout */}
        <div style={S.layout}>
          {/* Sidebar: categories */}
          <aside style={S.side}>
            <div style={S.sideHead}>Categories</div>
            <ul style={S.navList}>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    style={{
                      ...S.navItem,
                      ...(activeCat === c.id ? S.navItemActive : null),
                    }}
                    onClick={() => {
                      setActiveCat(c.id);
                      setQuery("");
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>{c.title}</div>
                    <div style={S.mutedSmall}>{c.desc}</div>
                  </button>
                </li>
              ))}
            </ul>

            <div style={S.card}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Quick links</div>
              <ul style={S.ul}>
                <li><a href="#ab-invoices" style={S.link}>Find invoices</a></li>
                <li><a href="#ts-performance" style={S.link}>Speed up pages</a></li>
                <li><a href="#gs-env" style={S.link}>Use .env safely</a></li>
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <main style={S.main}>
            {query ? (
              <section style={S.section}>
                <div style={S.sectionHead}>
                  <h2 style={S.h2}>Search results</h2>
                  <div style={S.muted}>{searchResults.length} match(es)</div>
                </div>
                {searchResults.length === 0 ? (
                  <div style={S.empty}>No results. Try another term.</div>
                ) : (
                  <div style={S.grid}>
                    {searchResults.map((a) => {
                      const isOpen = expanded.has(a.id);
                      return (
                        <article key={a.id} id={a.id} style={S.articleCard}>
                          <div style={S.articleHead}>
                            <div>
                              <div style={S.articleTitle}>{a.title}</div>
                              <div style={S.tagsRow}>
                                {a.tags?.map((t) => (
                                  <span key={t} style={S.tag}>{t}</span>
                                ))}
                              </div>
                            </div>
                            <div style={S.headBtns}>
                              <button style={S.ghost} onClick={() => copyLink(a.id)}>Copy link</button>
                              <button style={S.ghost} onClick={() => toggleArticle(a.id)}>
                                {isOpen ? "Hide" : "Read"}
                              </button>
                            </div>
                          </div>
                          {isOpen && (
                            <div style={S.articleBody}>
                              <ol style={S.ol}>
                                {a.body?.map((line, i) => <li key={i}>{line}</li>)}
                              </ol>
                              <div style={S.feedback}>
                                <span style={S.mutedSmall}>Was this helpful?</span>
                                <button
                                  style={{
                                    ...S.thumb,
                                    ...(votes[a.id] === "up" ? S.thumbActive : null),
                                  }}
                                  onClick={() => vote(a.id, "up")}
                                  aria-label="Helpful"
                                >
                                  👍
                                </button>
                                <button
                                  style={{
                                    ...S.thumb,
                                    ...(votes[a.id] === "down" ? S.thumbActiveBad : null),
                                  }}
                                  onClick={() => vote(a.id, "down")}
                                  aria-label="Not helpful"
                                >
                                  👎
                                </button>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            ) : (
              <>
                {/* Category overview */}
                <section style={S.section}>
                  <div style={S.sectionHead}>
                    <h2 style={S.h2}>{activeCategory.title}</h2>
                    <div style={S.muted}>{activeCategory.desc}</div>
                  </div>
                  <div style={S.grid}>
                    {activeCategory.articles.map((a) => {
                      const isOpen = expanded.has(a.id);
                      return (
                        <article key={a.id} id={a.id} style={S.articleCard}>
                          <div style={S.articleHead}>
                            <div>
                              <div style={S.articleTitle}>{a.title}</div>
                              <div style={S.tagsRow}>
                                {a.tags?.map((t) => (
                                  <span key={t} style={S.tag}>{t}</span>
                                ))}
                              </div>
                            </div>
                            <div style={S.headBtns}>
                              <button style={S.ghost} onClick={() => copyLink(a.id)}>Copy link</button>
                              <button style={S.ghost} onClick={() => toggleArticle(a.id)}>
                                {isOpen ? "Hide" : "Read"}
                              </button>
                            </div>
                          </div>
                          {isOpen && (
                            <div style={S.articleBody}>
                              <ol style={S.ol}>
                                {a.body?.map((line, i) => <li key={i}>{line}</li>)}
                              </ol>
                              <div style={S.feedback}>
                                <span style={S.mutedSmall}>Was this helpful?</span>
                                <button
                                  style={{
                                    ...S.thumb,
                                    ...(votes[a.id] === "up" ? S.thumbActive : null),
                                  }}
                                  onClick={() => vote(a.id, "up")}
                                >
                                  👍
                                </button>
                                <button
                                  style={{
                                    ...S.thumb,
                                    ...(votes[a.id] === "down" ? S.thumbActiveBad : null),
                                  }}
                                  onClick={() => vote(a.id, "down")}
                                >
                                  👎
                                </button>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>

                {/* FAQ */}
                <section style={S.section}>
                  <div style={S.sectionHead}>
                    <h2 style={S.h2}>FAQ</h2>
                    <div style={S.muted}>Common questions answered</div>
                  </div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {faqs.map((f, i) => {
                      const open = openFaq === i;
                      return (
                        <div key={f.q} style={S.accordion}>
                          <button
                            style={S.accBtn}
                            aria-expanded={open}
                            onClick={() => setOpenFaq(open ? -1 : i)}
                          >
                            {open ? "−" : "+"} {f.q}
                          </button>
                          <div style={{ ...S.accPanel, maxHeight: open ? 160 : 0 }} aria-hidden={!open}>
                            <p style={S.text}>{f.a}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </main>

          {/* Right panel: contact & status */}
          <aside style={S.right}>
            <div style={S.card}>
              <div style={{ fontWeight: 900 }}>Need more help?</div>
              <div style={S.muted}>Our team is here for you.</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <a href="mailto:support@example.com" style={S.btnLink}>Email support</a>
                <button style={S.ghost} onClick={() => setTicketOpen(true)}>Open ticket</button>
              </div>
            </div>

            <div style={S.card}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>System status</div>
              <StatusPill />
              <div style={S.mutedSmall}>&nbsp; All services operational.</div>
              <div style={S.mutedSmall}>Updated just now.</div>
            </div>

            <div style={S.card}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Shortcuts</div>
              <ul style={S.ul}>
                <li><a href="#ts-errors" style={S.link}>Resolve build errors</a></li>
                <li><a href="#ts-accessibility" style={S.link}>A11y quick checks</a></li>
                <li><a href="#td-style" style={S.link}>Docs style guide</a></li>
              </ul>
            </div>
          </aside>
        </div>

        <footer style={S.footer}>
          <span>© {new Date().getFullYear()} TINITIATE • Help Center</span>
          <span style={S.muted}>Docs & examples are for demo—customize to your project</span>
        </footer>
      </div>

      {/* Ticket Drawer */}
      {ticketOpen && (
        <div style={S.drawerWrap} role="dialog" aria-modal="true">
          <div style={S.drawer}>
            <div style={S.drawerHead}>
              <strong>Submit a Support Ticket</strong>
              <button style={S.ghost} onClick={() => setTicketOpen(false)}>Close</button>
            </div>
            <form onSubmit={submitTicket} style={{ display: "grid", gap: 10 }}>
              <div style={S.row}>
                <div style={{ ...S.group, flex: 1 }}>
                  <label style={S.label}>Name</label>
                  <input
                    style={S.input}
                    value={ticket.name}
                    onChange={(e) => setTicket((t) => ({ ...t, name: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ ...S.group, flex: 1 }}>
                  <label style={S.label}>Email</label>
                  <input
                    type="email"
                    style={S.input}
                    value={ticket.email}
                    onChange={(e) => setTicket((t) => ({ ...t, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div style={S.group}>
                <label style={S.label}>Category</label>
                <select
                  style={S.input}
                  value={ticket.category}
                  onChange={(e) => setTicket((t) => ({ ...t, category: e.target.value }))}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div style={S.group}>
                <label style={S.label}>Subject</label>
                <input
                  style={S.input}
                  value={ticket.subject}
                  onChange={(e) => setTicket((t) => ({ ...t, subject: e.target.value }))}
                  required
                />
              </div>
              <div style={S.group}>
                <label style={S.label}>Message</label>
                <textarea
                  rows={6}
                  style={S.textarea}
                  value={ticket.message}
                  onChange={(e) => setTicket((t) => ({ ...t, message: e.target.value }))}
                  placeholder="Describe the issue, steps to reproduce, expected vs actual, and any error messages."
                  required
                />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" style={S.ghost} onClick={() => setTicketOpen(false)}>Cancel</button>
                <button type="submit" style={S.btn}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Small components ---------- */
function StatusPill() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "4px 8px", borderRadius: 999, border: "1px solid #86efac",
      background: "#ecfdf5", color: "#166534", fontWeight: 700, fontSize: 12,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%", background: "#22c55e", marginRight: 6,
        boxShadow: "0 0 0 3px rgba(34,197,94,0.2)",
      }} />
      Operational
    </span>
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
      fontFamily:
        "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    container: { maxWidth: 1180, margin: "0 auto", padding: "24px 20px" },

    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, flexWrap: "wrap", marginBottom: 12,
    },
    brand: { display: "flex", alignItems: "center", gap: 12 },
    brandMark: {
      width: 28, height: 28, borderRadius: 8,
      background: "linear-gradient(135deg, rgba(59,130,246,1), rgba(14,165,233,1))",
      boxShadow: "0 6px 16px rgba(59,130,246,0.35)",
    },
    brandTitle: { fontWeight: 900, letterSpacing: "-0.01em" },
    brandSub: { fontSize: 13, color: "#475569" },
    headerRight: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },

    searchBar: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" },
    search: {
      flex: 1, minWidth: 280, padding: "10px 12px", borderRadius: 12,
      border: "1px solid #cbd5e1", outline: "none", background: "white", fontSize: 14,
    },

    layout: {
      display: "grid", gridTemplateColumns: "260px 1fr 300px", gap: 14,
    },

    /* Sidebar */
    side: { display: "grid", gap: 10, alignSelf: "start" },
    sideHead: { fontWeight: 900, fontSize: 13, color: "#475569" },
    navList: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 },
    navItem: {
      width: "100%", textAlign: "left", padding: 12, borderRadius: 12, border: "1px solid #e2e8f0",
      background: "white", cursor: "pointer", display: "grid", gap: 2,
    },
    navItemActive: { borderColor: "#bfdbfe", background: "#eff6ff" },

    /* Main */
    main: { display: "grid", gap: 16 },
    section: { display: "grid", gap: 10 },
    sectionHead: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 },
    h2: { fontSize: 18, margin: 0 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 },

    /* Article card */
    articleCard: {
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
      boxShadow: "0 12px 24px rgba(2,6,23,0.06)", padding: 12, display: "grid", gap: 8,
    },
    articleHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
    articleTitle: { fontWeight: 900 },
    headBtns: { display: "flex", gap: 8, flexWrap: "wrap" },
    articleBody: { borderTop: "1px solid #e2e8f0", paddingTop: 8, display: "grid", gap: 8 },

    tagsRow: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 },
    tag: {
      padding: "2px 8px", borderRadius: 999, border: "1px solid #e2e8f0",
      background: "#f8fafc", fontSize: 12, color: "#475569",
    },

    /* Right panel */
    right: { display: "grid", gap: 10, alignSelf: "start" },
    card: {
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
      padding: 12, boxShadow: "0 10px 20px rgba(2,6,23,0.04)",
    },

    /* Lists */
    ul: { margin: 0, paddingLeft: 18 },
    ol: { margin: "6px 0 0 18px" },

    text: { color: "#334155", lineHeight: 1.6 },
    muted: { color: "#64748b", fontSize: 13 },
    mutedSmall: { color: "#64748b", fontSize: 12 },
    link: { color: "#1d4ed8", textDecoration: "none" },

    /* Buttons */
    btn: {
      padding: "10px 14px", background: "#2563eb", color: "white", border: "none",
      borderRadius: 10, fontWeight: 700, cursor: "pointer",
      boxShadow: "0 10px 18px rgba(37,99,235,0.22)",
    },
    btnLink: {
      display: "inline-block", padding: "8px 12px", background: "#eff6ff",
      border: "1px solid #bfdbfe", color: "#1d4ed8", borderRadius: 10, fontWeight: 700,
      textDecoration: "none",
    },
    ghost: {
      padding: "8px 12px", background: "white", color: "#0f172a",
      border: "1px solid #e2e8f0", borderRadius: 10, fontWeight: 600, cursor: "pointer",
    },

    /* Feedback */
    feedback: { display: "flex", alignItems: "center", gap: 6 },
    thumb: {
      border: "1px solid #e2e8f0", background: "white", borderRadius: 8,
      padding: "4px 8px", cursor: "pointer",
    },
    thumbActive: { background: "#ecfdf5", borderColor: "#86efac" },
    thumbActiveBad: { background: "#fff7ed", borderColor: "#fecaca" },

    /* FAQ */
    accordion: {
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden",
    },
    accBtn: {
      width: "100%", textAlign: "left", padding: 12, border: "none", background: "#fff",
      fontWeight: 800, borderBottom: "1px solid #e2e8f0", cursor: "pointer",
    },
    accPanel: { overflow: "hidden", transition: "max-height .28s ease", padding: "0 12px" },

    /* Empty state */
    empty: {
      padding: 14, border: "1px dashed #e2e8f0", borderRadius: 12,
      background: "#f8fafc", color: "#475569",
    },

    /* Footer */
    footer: {
      marginTop: 18, paddingTop: 12, borderTop: "1px solid #e2e8f0",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 10, fontSize: 13,
    },

    /* Drawer */
    drawerWrap: {
      position: "fixed", inset: 0, background: "rgba(2,6,23,0.4)",
      display: "grid", placeItems: "end", zIndex: 50,
    },
    drawer: {
      width: "min(720px, 96vw)", background: "#fff", borderTopLeftRadius: 16,
      borderTopRightRadius: 16, padding: 14, boxShadow: "0 -20px 50px rgba(2,6,23,0.3)",
    },
    drawerHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
    row: { display: "flex", gap: 10, flexWrap: "wrap" },
    group: { display: "grid", gap: 6 },
    label: { fontSize: 12, fontWeight: 700 },
    input: {
      padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 12,
      outline: "none", background: "white", fontSize: 14, width: "100%",
    },
    textarea: {
      padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 12,
      outline: "none", background: "white", fontSize: 14, width: "100%", resize: "vertical",
    },

    /* Toast */
    toast: {
      position: "fixed", bottom: 18, right: 18, background: "white",
      border: "1px solid #e2e8f0", borderRadius: 12, padding: "8px 10px",
      boxShadow: "0 18px 40px rgba(2,6,23,0.12)", fontWeight: 700, zIndex: 60,
    },
  };
}

