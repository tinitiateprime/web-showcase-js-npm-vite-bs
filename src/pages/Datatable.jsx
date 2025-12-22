// File: src/DataTable.jsx
import React, { useMemo, useState } from "react";

/**
 * <DataTable />
 * Props:
 *  - rows: array of objects (each should have a stable `id`; if not, we fall back to row index)
 *  - columns: [{ key, label, sortable?: true, format?: (value, row)=>string }]
 *  - pageSizeOptions?: number[] (default [5, 10, 20])
 *  - initialSort?: { key, dir: 'asc' | 'desc' }
 *  - rowKey?: (row, index) => string | number
 *  - selectable?: boolean (default true)
 */
export function DataTable({
  rows = [],
  columns = [],
  pageSizeOptions = [5, 10, 20],
  initialSort,
  rowKey,
  selectable = true,
}) {
  // ---------- State ----------
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] || 10);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(initialSort?.key || null);
  const [sortDir, setSortDir] = useState(initialSort?.dir || "asc");
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [openCols, setOpenCols] = useState(false);
  const [visibleCols, setVisibleCols] = useState(() =>
    new Set(columns.map((c) => c.key))
  );

  // ---------- Helpers ----------
  const getKey = (row, i) => (rowKey ? rowKey(row, i) : row?.id ?? i);

  const shownColumns = useMemo(
    () => columns.filter((c) => visibleCols.has(c.key)),
    [columns, visibleCols]
  );

  function cellDisplay(col, row) {
    const v = col.key === "__index" ? "" : row[col.key];
    if (col.format) return col.format(v, row);
    if (v === true) return "Yes";
    if (v === false) return "No";
    if (v === null || typeof v === "undefined") return "";
    return String(v);
  }

  function compareValues(a, b) {
    const na = Number(a), nb = Number(b);
    const aNum = !Number.isNaN(na), bNum = !Number.isNaN(nb);
    if (aNum && bNum) return na - nb;
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
  }

  // ---------- Filter + sort ----------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? rows.filter((r) =>
          shownColumns.some((c) =>
            cellDisplay(c, r).toLowerCase().includes(q)
          )
        )
      : rows.slice();

    if (!sortKey) return base;

    const col = columns.find((c) => c.key === sortKey);
    return base.sort((r1, r2) => {
      const v1 = col ? r1[col.key] : r1[sortKey];
      const v2 = col ? r2[col.key] : r2[sortKey];
      const cmp = compareValues(v1, v2);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, shownColumns, query, sortKey, sortDir, columns]);

  // ---------- Pagination ----------
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  function onHeaderClick(key, sortable) {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleCol(key) {
    setVisibleCols((s) => {
      const n = new Set(s);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
    setPage(1);
  }

  // ---------- Selection ----------
  const pageIds = new Set(pageRows.map((r, i) => getKey(r, i + (page - 1) * pageSize)));
  const allPageSelected = pageRows.length > 0 && pageRows.every((r, i) => selectedIds.has(getKey(r, i + (page - 1) * pageSize)));
  const somePageSelected = pageRows.some((r, i) => selectedIds.has(getKey(r, i + (page - 1) * pageSize)));

  function toggleSelectAllPage() {
    setSelectedIds((cur) => {
      const next = new Set(cur);
      if (allPageSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  function toggleRow(id) {
    setSelectedIds((cur) => {
      const next = new Set(cur);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  // ---------- Export CSV ----------
  function toCSV(data, cols) {
    const esc = (s) => {
      const str = s == null ? "" : String(s);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };
    const head = cols.map((c) => esc(c.label)).join(",");
    const body = data
      .map((r) => cols.map((c) => esc(cellDisplay(c, r))).join(","))
      .join("\n");
    return [head, body].join("\n");
  }

  function downloadCSV({ onlySelected = false } = {}) {
    const data = onlySelected
      ? filtered.filter((r, i) => selectedIds.has(getKey(r, i)))
      : filtered;
    const csv = toCSV(data, shownColumns);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: "table.csv",
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ---------- Styles ----------
  const S = {
    page: {
      background: "#f8fafc",
      color: "#0f172a",
      fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    container: { maxWidth: 1120, margin: "0 auto", padding: "16px 20px" },
    bar: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      marginBottom: 10,
    },
    left: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
    right: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
    search: {
      minWidth: 260,
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid #cbd5e1",
      outline: "none",
      background: "white",
      fontSize: 14,
    },
    select: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid #cbd5e1",
      background: "white",
      fontSize: 14,
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
    },
    ghost: {
      padding: "10px 14px",
      background: "white",
      color: "#0f172a",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      fontWeight: 600,
      cursor: "pointer",
    },
    meta: { fontSize: 13, color: "#475569" },

    colPanel: {
      position: "absolute",
      zIndex: 10,
      marginTop: 8,
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: 12,
      boxShadow: "0 12px 24px rgba(2,6,23,0.08)",
      padding: 10,
      display: "grid",
      gap: 6,
      minWidth: 220,
    },

    wrap: {
      marginTop: 10,
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      background: "white",
      overflowX: "auto",
      boxShadow: "0 10px 20px rgba(2,6,23,0.04)",
    },
    table: {
      width: "100%",
      minWidth: 760,
      borderCollapse: "separate",
      borderSpacing: 0,
      fontSize: 14,
    },
    th: {
      position: "sticky",
      top: 0,
      background: "white",
      textAlign: "left",
      padding: "12px 14px",
      borderBottom: "1px solid #e2e8f0",
      fontWeight: 800,
      cursor: "default",
      userSelect: "none",
    },
    thSortable: { cursor: "pointer" },
    td: {
      padding: "12px 14px",
      borderTop: "1px solid #f1f5f9",
      color: "#0f172a",
      verticalAlign: "top",
    },
    striped: { background: "#fcfcfd" },
    checkbox: { width: 18, height: 18 },
    pager: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
    },
    pagerBtn: {
      padding: "8px 12px",
      borderRadius: 10,
      border: "1px solid #e2e8f0",
      background: "white",
      cursor: "pointer",
      fontSize: 14,
    },
    badge: {
      padding: "2px 8px",
      borderRadius: 999,
      border: "1px solid #e2e8f0",
      background: "#f8fafc",
      fontSize: 12,
      color: "#475569",
      marginLeft: 6,
    },
  };

  // ---------- Render ----------
  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Top bar */}
        <div style={S.bar}>
          <div style={S.left}>
            <input
              style={S.search}
              type="search"
              placeholder="Search…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              aria-label="Search rows"
            />
            <div style={{ position: "relative" }}>
              <button
                type="button"
                style={S.ghost}
                onClick={() => setOpenCols((o) => !o)}
              >
                Columns
                <span style={S.badge}>{shownColumns.length}/{columns.length}</span>
              </button>
              {openCols && (
                <div style={S.colPanel} role="menu">
                  {columns.map((c) => (
                    <label key={c.key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={visibleCols.has(c.key)}
                        onChange={() => toggleCol(c.key)}
                      />
                      {c.label}
                    </label>
                  ))}
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button
                      type="button"
                      style={S.ghost}
                      onClick={() => setVisibleCols(new Set(columns.map((c) => c.key)))}
                    >
                      Show all
                    </button>
                    <button
                      type="button"
                      style={S.ghost}
                      onClick={() => setVisibleCols(new Set())}
                    >
                      Hide all
                    </button>
                  </div>
                </div>
              )}
            </div>
            <select
              style={S.select}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>{n} / page</option>
              ))}
            </select>
          </div>

          <div style={S.right}>
            <span style={S.meta}>
              {filtered.length} result(s){query ? ` for “${query}”` : ""}.
            </span>
            <button style={S.ghost} onClick={() => downloadCSV({ onlySelected: false })}>
              Export CSV (all)
            </button>
            <button
              style={{ ...S.ghost, opacity: selectedIds.size ? 1 : 0.6 }}
              onClick={() => downloadCSV({ onlySelected: true })}
              disabled={!selectedIds.size}
            >
              Export CSV (selected)
            </button>
            {selectable && selectedIds.size > 0 && (
              <button style={S.ghost} onClick={clearSelection}>
                Clear selection
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={S.wrap}>
          <table style={S.table} aria-label="Data table">
            <thead>
              <tr>
                {selectable && (
                  <th style={S.th}>
                    <input
                      type="checkbox"
                      style={S.checkbox}
                      checked={allPageSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = !allPageSelected && somePageSelected;
                      }}
                      onChange={toggleSelectAllPage}
                      aria-label="Select all rows on this page"
                    />
                  </th>
                )}
                {shownColumns.map((c) => {
                  const sortable = c.sortable !== false; // default sortable
                  const active = sortKey === c.key;
                  return (
                    <th
                      key={c.key}
                      style={{ ...S.th, ...(sortable ? S.thSortable : null) }}
                      onClick={() => onHeaderClick(c.key, sortable)}
                    >
                      {c.label}
                      {active ? (
                        <span style={{ marginLeft: 6, color: "#475569" }}>
                          {sortDir === "asc" ? "▲" : "▼"}
                        </span>
                      ) : null}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, i) => {
                const id = getKey(row, i + (page - 1) * pageSize);
                const checked = selectedIds.has(id);
                const zebra = i % 2 === 1;
                return (
                  <tr key={id} style={zebra ? S.striped : null}>
                    {selectable && (
                      <td style={S.td}>
                        <input
                          type="checkbox"
                          style={S.checkbox}
                          checked={checked}
                          onChange={() => toggleRow(id)}
                          aria-label={`Select row ${i + 1}`}
                        />
                      </td>
                    )}
                    {shownColumns.map((c) => (
                      <td key={c.key} style={S.td}>
                        {cellDisplay(c, row)}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {pageRows.length === 0 && (
                <tr>
                  <td style={S.td} colSpan={(selectable ? 1 : 0) + shownColumns.length}>
                    No rows match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={S.pager}>
          <button
            style={S.pagerBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span style={S.meta}>
            Page {page} of {totalPages}
          </span>
          <button
            style={S.pagerBtn}
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

/* ========================= DEMO PAGE =========================
   Remove this in production; keep for a ready-to-run example.
*/
export default function DataTableDemo() {
  const columns = [
    { key: "name",   label: "Name" },
    { key: "role",   label: "Role" },
    { key: "team",   label: "Team" },
    { key: "salary", label: "Salary (₹)", format: (v) => (v ? `₹${v.toLocaleString()}` : "") },
    { key: "rating", label: "Rating",     format: (v) => v?.toFixed ? v.toFixed(1) : v },
    { key: "active", label: "Active" },
  ];

  const rows = [
    { id: 1, name: "Aarav",  role: "Engineer", team: "Web",     salary: 850000, rating: 4.6, active: true },
    { id: 2, name: "Isha",   role: "Designer", team: "Design",  salary: 680000, rating: 4.2, active: true },
    { id: 3, name: "Kabir",  role: "Analyst",  team: "Data",    salary: 720000, rating: 4.4, active: false },
    { id: 4, name: "Neha",   role: "PM",       team: "Platform",salary: 1200000, rating: 4.8, active: true },
    { id: 5, name: "Rohan",  role: "DevOps",   team: "Infra",   salary: 950000, rating: 4.5, active: true },
    { id: 6, name: "Diya",   role: "QA",       team: "Quality", salary: 640000, rating: 4.1, active: true },
    { id: 7, name: "Arjun",  role: "Engineer", team: "Web",     salary: 880000, rating: 4.7, active: true },
    { id: 8, name: "Meera",  role: "Engineer", team: "Mobile",  salary: 910000, rating: 4.3, active: false },
    { id: 9, name: "Vikram", role: "Designer", team: "Design",  salary: 705000, rating: 4.0, active: true },
    { id: 10,name: "Riya",   role: "Analyst",  team: "Data",    salary: 770000, rating: 4.6, active: true },
    { id: 11,name: "Kunal",  role: "PM",       team: "Platform",salary: 1250000, rating: 4.9, active: true },
    { id: 12,name: "Sara",   role: "QA",       team: "Quality", salary: 660000, rating: 4.2, active: true },
  ];

  return (
    <DataTable
      rows={rows}
      columns={columns}
      pageSizeOptions={[5, 10, 20]}
      initialSort={{ key: "name", dir: "asc" }}
      selectable
    />
  );
}
