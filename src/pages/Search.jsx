// File: src/SearchPage.jsx
import React, { useMemo, useState } from "react";

export default function SearchPage() {
  // ---------- Demo data (replace with your API later) ----------
  const items = useMemo(
    () => [
      { id: 1,  title: "AI-Powered Web App",          category: "Software",   price: 499, rating: 4.7, tags: ["ai","web"],       desc: "Build and deploy a scalable React + Node service." },
      { id: 2,  title: "Cloud Migration Workshop",    category: "Training",   price: 299, rating: 4.5, tags: ["cloud"],          desc: "Hands-on AWS migration strategies and guardrails." },
      { id: 3,  title: "UX/UI Design Sprint",         category: "Design",     price: 399, rating: 4.6, tags: ["uiux","web"],     desc: "Rapid prototyping and user testing for your MVP." },
      { id: 4,  title: "Data Engineering Bootcamp",   category: "Training",   price: 599, rating: 4.8, tags: ["data","etl","sql"], desc: "ETL pipelines, warehousing, and reporting." },
      { id: 5,  title: "Mobile App Modernization",    category: "Software",   price: 799, rating: 4.4, tags: ["mobile"],         desc: "Refactor legacy apps with offline-first patterns." },
      { id: 6,  title: "Security Assessment",         category: "Consulting", price: 699, rating: 4.7, tags: ["security"],       desc: "Threat modeling, SAST/DAST, and remediation plan." },
      { id: 7,  title: "DevOps Enablement Pack",      category: "Consulting", price: 749, rating: 4.6, tags: ["devops","cloud"], desc: "CI/CD, IaC, and release automation baseline." },
      { id: 8,  title: "Full-Stack Coaching",         category: "Training",   price: 349, rating: 4.5, tags: ["web"],            desc: "React, APIs, and databases with weekly projects." },
      { id: 9,  title: "Analytics Dashboard Build",   category: "Software",   price: 649, rating: 4.7, tags: ["data","web"],     desc: "KPIs, drilldowns, and exportable reports." },
      { id: 10, title: "SQL Performance Tuning",      category: "Consulting", price: 549, rating: 4.6, tags: ["sql","data"],     desc: "Indexing, plans analysis, and query rewrites." },
      { id: 11, title: "Brand Style Guide",           category: "Design",     price: 259, rating: 4.3, tags: ["uiux"],           desc: "Logos, color tokens, and component usage." },
      { id: 12, title: "Cloud Cost Optimization",     category: "Consulting", price: 579, rating: 4.5, tags: ["cloud"],          desc: "Right-sizing, auto-scaling, and savings plans." },
    ],
    []
  );

  // ---------- State ----------
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // ---------- Derived options ----------
  const allCategories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items]
  );
  const allTags = useMemo(
    () => Array.from(new Set(items.flatMap((i) => i.tags))).sort(),
    [items]
  );

  // ---------- Filtering / sorting ----------
  const filtered = useMemo(() => {
    const qlc = q.trim().toLowerCase();

    return items
      .filter((it) => {
        if (category !== "All" && it.category !== category) return false;

        const minOk = minPrice === "" || it.price >= Number(minPrice);
        const maxOk = maxPrice === "" || it.price <= Number(maxPrice);
        if (!minOk || !maxOk) return false;

        if (selectedTags.size > 0) {
          const hasAll = Array.from(selectedTags).every((t) => it.tags.includes(t));
          if (!hasAll) return false;
        }

        if (!qlc) return true;
        return (
          it.title.toLowerCase().includes(qlc) ||
          it.desc.toLowerCase().includes(qlc) ||
          it.tags.join(" ").toLowerCase().includes(qlc) ||
          it.category.toLowerCase().includes(qlc)
        );
      })
      .sort((a, b) => {
        if (sort === "priceAsc") return a.price - b.price;
        if (sort === "priceDesc") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        // relevance: simple boost if title includes query
        if (!q.trim()) return 0;
        const inA = a.title.toLowerCase().includes(q.toLowerCase()) ? 1 : 0;
        const inB = b.title.toLowerCase().includes(q.toLowerCase()) ? 1 : 0;
        return inB - inA;
      });
  }, [items, q, category, minPrice, maxPrice, selectedTags, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // reset page when filters change
  function onFiltersChanged(fn) {
    fn();
    setPage(1);
  }

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f8fafc",
      color: "#0f172a",
      fontFamily:
        "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    container: { maxWidth: 1120, margin: "0 auto", padding: "24px 20px" },

    // Header / Search bar
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
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
    searchWrap: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flex: "1 1 420px",
      minWidth: 320,
      background: "white",
      border: "1px solid #e2e8f0",
      padding: 8,
      borderRadius: 14,
    },
    input: {
      flex: 1,
      border: "1px solid #cbd5e1",
      borderRadius: 10,
      padding: "10px 12px",
      outline: "none",
      fontSize: 14,
      background: "white",
    },
    btn: {
      padding: "10px 14px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: 10,
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 10px 18px rgba(37,99,235,0.22)",
      whiteSpace: "nowrap",
    },

    // Filter row
    filterRow: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      alignItems: "center",
      margin: "12px 0 8px",
    },
    select: {
      border: "1px solid #cbd5e1",
      borderRadius: 10,
      padding: "10px 12px",
      background: "white",
      fontSize: 14,
    },
    num: {
      width: 120,
      border: "1px solid #cbd5e1",
      borderRadius: 10,
      padding: "10px 12px",
      background: "white",
      fontSize: 14,
    },
    tag: (active) => ({
      padding: "8px 12px",
      borderRadius: 999,
      border: `1px solid ${active ? "#2563eb" : "#e2e8f0"}`,
      background: active ? "#eff6ff" : "white",
      color: active ? "#1d4ed8" : "#0f172a",
      fontSize: 13,
      cursor: "pointer",
    }),
    smallLink: {
      fontSize: 13,
      color: "#2563eb",
      textDecoration: "none",
    },

    // Chips / stats
    chips: { display: "flex", gap: 8, flexWrap: "wrap", margin: "6px 0" },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #e2e8f0",
      background: "white",
      fontSize: 12,
    },
    chipBtn: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontSize: 14,
      lineHeight: 1,
      color: "#64748b",
    },
    stats: { fontSize: 13, color: "#475569", marginTop: 2 },

    // Results
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 16,
      marginTop: 12,
    },
    card: {
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      padding: 16,
      boxShadow: "0 10px 20px rgba(2,6,23,0.04)",
    },
    title: { fontWeight: 700, marginBottom: 6 },
    desc: { fontSize: 14, color: "#475569", margin: "6px 0 10px" },
    meta: { fontSize: 13, color: "#334155" },
    pill: {
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: 999,
      border: "1px solid #e2e8f0",
      background: "#f8fafc",
      marginRight: 6,
      fontSize: 12,
    },

    // Pagination
    pager: {
      marginTop: 16,
      display: "flex",
      gap: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    pagerBtn: {
      padding: "8px 12px",
      borderRadius: 10,
      border: "1px solid #e2e8f0",
      background: "white",
      cursor: "pointer",
      fontSize: 14,
    },
    pagerInfo: { fontSize: 13, color: "#475569" },

    // Empty
    empty: {
      marginTop: 18,
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      padding: 18,
      textAlign: "center",
      color: "#475569",
      fontSize: 14,
    },
  };

  function toggleTag(tag) {
    onFiltersChanged(() => {
      const next = new Set(selectedTags);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      setSelectedTags(next);
    });
  }

  function clearAll() {
    setQ("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSelectedTags(new Set());
    setSort("relevance");
    setPage(1);
  }

  function removeChip(type, value) {
    if (type === "category") setCategory("All");
    if (type === "min") setMinPrice("");
    if (type === "max") setMaxPrice("");
    if (type === "tag") {
      const next = new Set(selectedTags);
      next.delete(value);
      setSelectedTags(next);
    }
    if (type === "q") setQ("");
    setPage(1);
  }

  // highlight matched query (simple)
  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function highlight(text) {
    if (!q.trim()) return text;
    const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "ig"));
    return parts.map((p, i) =>
      p.toLowerCase() === q.toLowerCase() ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ---------- Header & Search ---------- */}
        <div style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.brandMark} />
            <span>TINITIATE</span>
          </div>

          <div style={styles.searchWrap} role="search">
            <input
              style={styles.input}
              type="search"
              placeholder="Search services, topics, tags…"
              value={q}
              onChange={(e) => onFiltersChanged(() => setQ(e.target.value))}
              aria-label="Search"
            />
            <button style={styles.btn} onClick={() => setPage(1)}>Search</button>
          </div>
        </div>

        {/* ---------- Filters ---------- */}
        <div style={styles.filterRow}>
          <select
            aria-label="Category"
            style={styles.select}
            value={category}
            onChange={(e) => onFiltersChanged(() => setCategory(e.target.value))}
          >
            {allCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            style={styles.num}
            type="number"
            min="0"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => onFiltersChanged(() => setMinPrice(e.target.value))}
          />
          <input
            style={styles.num}
            type="number"
            min="0"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => onFiltersChanged(() => setMaxPrice(e.target.value))}
          />

          <select
            aria-label="Sort"
            style={styles.select}
            value={sort}
            onChange={(e) => onFiltersChanged(() => setSort(e.target.value))}
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
            <option value="rating">Rating</option>
          </select>

          <a href="#clear" style={styles.smallLink} onClick={(e) => { e.preventDefault(); clearAll(); }}>
            Clear all
          </a>
        </div>

        {/* Tags */}
        <div style={styles.filterRow} aria-label="Tags">
          {allTags.map((t) => (
            <button
              key={t}
              style={styles.tag(selectedTags.has(t))}
              onClick={() => toggleTag(t)}
              type="button"
              aria-pressed={selectedTags.has(t)}
            >
              #{t}
            </button>
          ))}
        </div>

        {/* ---------- Applied filter chips & stats ---------- */}
        <div style={styles.chips}>
          {q.trim() && (
            <span style={styles.chip}>
              <strong>Query:</strong> {q}
              <button style={styles.chipBtn} onClick={() => removeChip("q")}>×</button>
            </span>
          )}
          {category !== "All" && (
            <span style={styles.chip}>
              <strong>Category:</strong> {category}
              <button style={styles.chipBtn} onClick={() => removeChip("category")}>×</button>
            </span>
          )}
          {minPrice !== "" && (
            <span style={styles.chip}>
              Min: ₹{minPrice}
              <button style={styles.chipBtn} onClick={() => removeChip("min")}>×</button>
            </span>
          )}
          {maxPrice !== "" && (
            <span style={styles.chip}>
              Max: ₹{maxPrice}
              <button style={styles.chipBtn} onClick={() => removeChip("max")}>×</button>
            </span>
          )}
          {Array.from(selectedTags).map((t) => (
            <span style={styles.chip} key={t}>
              #{t}
              <button style={styles.chipBtn} onClick={() => removeChip("tag", t)}>×</button>
            </span>
          ))}
        </div>
        <div style={styles.stats} role="status">
          {filtered.length} result(s){q.trim() ? ` for “${q}”` : ""}. Page {page} of {totalPages}.
        </div>

        {/* ---------- Results ---------- */}
        {pageItems.length > 0 ? (
          <div style={styles.grid}>
            {pageItems.map((it) => (
              <article key={it.id} style={styles.card}>
                <div style={styles.title}>{highlight(it.title)}</div>
                <div style={styles.desc}>{highlight(it.desc)}</div>
                <div style={styles.meta}>
                  <span style={styles.pill}>{it.category}</span>
                  <span style={styles.pill}>₹{it.price}</span>
                  <span style={styles.pill}>⭐ {it.rating}</span>
                  {it.tags.map((t) => (
                    <span style={styles.pill} key={t}>#{t}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={styles.empty}>
            No results. Try removing filters, widening price, or searching a simpler term.
          </div>
        )}

        {/* ---------- Pagination ---------- */}
        <div style={styles.pager}>
          <button
            style={styles.pagerBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <div style={styles.pagerInfo}>
            Page {page} of {totalPages}
          </div>
          <button
            style={styles.pagerBtn}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
