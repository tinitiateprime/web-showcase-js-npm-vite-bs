// File: src/CalendarPage.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function CalendarPage() {
  const S = styles();

  // ---------- Utilities ----------
  const today = new Date();
  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
  const sameDay = (a, b) =>
    a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const dateKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  const parseKey = (k) => {
    const [y, m, d] = k.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const inRange = (d, a, b) => {
    if (!a || !b) return false;
    const x = parseInt(dateKey(d).replaceAll("-", ""), 10);
    const s = parseInt(dateKey(a).replaceAll("-", ""), 10);
    const e = parseInt(dateKey(b).replaceAll("-", ""), 10);
    return x >= Math.min(s, e) && x <= Math.max(s, e);
  };

  // ---------- State ----------
  const [viewDate, setViewDate] = useState(startOfMonth(today)); // month being shown
  const [mode, setMode] = useState("single"); // 'single' | 'range'
  const [selected, setSelected] = useState(null); // Date (single)
  const [range, setRange] = useState({ start: null, end: null }); // Dates

  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem("calendar.events");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Event form
  const [form, setForm] = useState({
    date: dateKey(today),
    title: "",
    time: "",
    note: "",
    multiAdd: false, // add across selected range
  });

  // ---------- Persist ----------
  useEffect(() => {
    try { localStorage.setItem("calendar.events", JSON.stringify(events)); } catch {}
  }, [events]);

  // Keep form date in sync with selection
  useEffect(() => {
    if (mode === "single" && selected) {
      setForm((f) => ({ ...f, date: dateKey(selected) }));
    } else if (mode === "range" && range.start) {
      setForm((f) => ({ ...f, date: dateKey(range.start) }));
    }
  }, [mode, selected, range.start]);

  // ---------- Calendar grid (6 weeks, Sun–Sat) ----------
  const days = useMemo(() => {
    const first = startOfMonth(viewDate);
    const start = new Date(first);
    // back to the previous Sunday
    start.setDate(1 - first.getDay());
    const out = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      out.push(d);
    }
    return out;
  }, [viewDate]);

  // ---------- Derivatives ----------
  const monthLabel = viewDate.toLocaleString("default", { month: "long", year: "numeric" });
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const eventsByDate = useMemo(() => {
    const map = new Map();
    for (const e of events) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date).push(e);
    }
    return map;
  }, [events]);

  const visibleMonth = viewDate.getMonth();

  // ---------- Actions ----------
  function prevMonth() { setViewDate((d) => addMonths(d, -1)); }
  function nextMonth() { setViewDate((d) => addMonths(d, +1)); }
  function goToday()   { const m = startOfMonth(today); setViewDate(m); setSelected(today); }

  function onDayClick(d) {
    if (mode === "single") {
      setSelected(d);
      setRange({ start: null, end: null });
      setForm((f) => ({ ...f, date: dateKey(d) }));
    } else {
      if (!range.start || (range.start && range.end)) {
        setRange({ start: d, end: null });
      } else {
        // only start set
        if (sameDay(d, range.start)) {
          setRange({ start: d, end: d }); // single-day range
        } else {
          setRange((r) => ({ ...r, end: d }));
        }
      }
    }
  }

  function addEvent(e) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) return;

    const base = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      title, time: form.time.trim(), note: form.note.trim(),
    };

    // Add single or across range
    if (form.multiAdd && range.start && range.end) {
      const start = parseKey(dateKey(range.start));
      const end   = parseKey(dateKey(range.end));
      const s = start <= end ? start : end;
      const e2 = start <= end ? end   : start;

      const toAdd = [];
      const cur = new Date(s);
      while (cur <= e2) {
        toAdd.push({ ...base, id: (crypto.randomUUID?.() || Math.random())+"", date: dateKey(cur) });
        cur.setDate(cur.getDate() + 1);
      }
      setEvents((list) => [...list, ...toAdd]);
    } else {
      setEvents((list) => [...list, { ...base, date: form.date }]);
    }

    // reset light
    setForm((f) => ({ ...f, title: "", time: "", note: "" }));
  }

  function deleteEvent(id) {
    setEvents((list) => list.filter((e) => e.id !== id));
  }

  // Events to show in the right panel
  const rightPanelTitle =
    mode === "single" && selected
      ? `Events on ${selected.toDateString()}`
      : mode === "range" && range.start && range.end
      ? `Events in selected range`
      : `Events in ${monthLabel}`;

  const rightPanelEvents = useMemo(() => {
    if (mode === "single" && selected) {
      return events.filter((e) => e.date === dateKey(selected));
    }
    if (mode === "range" && range.start && range.end) {
      const s = parseInt(dateKey(range.start).replaceAll("-", ""), 10);
      const e = parseInt(dateKey(range.end).replaceAll("-", ""), 10);
      const min = Math.min(s, e), max = Math.max(s, e);
      return events.filter((ev) => {
        const x = parseInt(ev.date.replaceAll("-", ""), 10);
        return x >= min && x <= max;
      });
    }
    // show events of the visible month
    return events.filter((ev) => parseKey(ev.date).getMonth() === visibleMonth &&
                                 parseKey(ev.date).getFullYear() === viewDate.getFullYear());
  }, [events, mode, selected, range, visibleMonth, viewDate]);

  // ---------- Render ----------
  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Header */}
        <header style={S.header}>
          <div style={S.brand}>
            <div style={S.brandMark} />
            <div>
              <div style={S.brandTitle}>Calendar</div>
              <div style={S.brandSub}>Month view • Events • Range select</div>
            </div>
          </div>

          <div style={S.controls}>
            <div style={S.segment}>
              {["single", "range"].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); if (m === "single") setRange({start:null,end:null}); }}
                  style={{ ...S.segmentBtn, ...(mode === m ? S.segmentBtnActive : null) }}
                >
                  {m === "single" ? "Single" : "Range"}
                </button>
              ))}
            </div>
            <div style={S.nav}>
              <button style={S.ghost} onClick={prevMonth}>←</button>
              <div style={S.monthLabel}>{monthLabel}</div>
              <button style={S.ghost} onClick={nextMonth}>→</button>
              <button style={S.btn} onClick={goToday}>Today</button>
            </div>
          </div>
        </header>

        {/* Layout */}
        <div style={S.layout}>
          {/* --- Calendar grid --- */}
          <section style={S.calCard}>
            {/* Weekdays */}
            <div style={S.weekRow}>
              {daysOfWeek.map((d) => (
                <div key={d} style={S.weekCell}>{d}</div>
              ))}
            </div>

            {/* Days */}
            <div style={S.grid}>
              {days.map((d) => {
                const isCurrentMonth = d.getMonth() === visibleMonth && d.getFullYear() === viewDate.getFullYear();
                const isToday = sameDay(d, today);
                const isSelected = mode === "single" ? sameDay(d, selected) : false;
                const isInRange = mode === "range" && range.start && range.end ? inRange(d, range.start, range.end) : false;
                const hasStart = mode === "range" && range.start && sameDay(d, range.start);
                const hasEnd   = mode === "range" && range.end   && sameDay(d, range.end);

                const dots = eventsByDate.get(dateKey(d))?.slice(0, 3) || [];

                return (
                  <button
                    key={dateKey(d)}
                    onClick={() => onDayClick(d)}
                    title={d.toDateString()}
                    style={{
                      ...S.cell,
                      ...(isCurrentMonth ? null : S.cellMuted),
                      ...(isToday ? S.cellToday : null),
                      ...(isSelected ? S.cellSelected : null),
                      ...(isInRange ? S.cellInRange : null),
                      ...(hasStart || hasEnd ? S.cellRangeEdge : null),
                    }}
                  >
                    <div style={S.cellTop}>
                      <span style={S.dayNum}>{d.getDate()}</span>
                    </div>
                    <div style={S.dots}>
                      {dots.map((ev) => (
                        <span key={ev.id} style={S.dot} title={ev.title} />
                      ))}
                      {eventsByDate.get(dateKey(d))?.length > 3 && (
                        <span style={S.more}>+{eventsByDate.get(dateKey(d)).length - 3}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* --- Right panel: Add event + list --- */}
          <aside style={S.side}>
            <form style={S.formCard} onSubmit={addEvent}>
              <div style={S.formHead}>
                <strong>Add event</strong>
              </div>
              <div style={S.group}>
                <label style={S.label}>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  style={S.input}
                  required
                />
              </div>
              <div style={S.group}>
                <label style={S.label}>Title</label>
                <input
                  type="text"
                  placeholder="Meeting / Task / Reminder"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  style={S.input}
                  required
                />
              </div>
              <div style={S.row}>
                <div style={{ ...S.group, flex: 1 }}>
                  <label style={S.label}>Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    style={S.input}
                  />
                </div>
                <div style={{ ...S.group, flex: 1 }}>
                  <label style={S.label}>Add across range</label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={form.multiAdd}
                      onChange={(e) => setForm((f) => ({ ...f, multiAdd: e.target.checked }))}
                      disabled={!(range.start && range.end)}
                    />
                    <span style={S.hint}>
                      {range.start && range.end ? "Selected range" : "Select a range first"}
                    </span>
                  </label>
                </div>
              </div>
              <div style={S.group}>
                <label style={S.label}>Notes</label>
                <textarea
                  placeholder="Optional"
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  style={S.textarea}
                />
              </div>
              <div style={S.actions}>
                <button type="submit" style={S.btn}>Add</button>
                <button
                  type="button"
                  style={S.ghost}
                  onClick={() => setForm({ date: dateKey(today), title: "", time: "", note: "", multiAdd: false })}
                >
                  Reset
                </button>
              </div>
            </form>

            <div style={S.listCard}>
              <div style={S.formHead}>
                <strong>{rightPanelTitle}</strong>
                <span style={S.muted}>{rightPanelEvents.length} item(s)</span>
              </div>
              {rightPanelEvents.length === 0 ? (
                <div style={S.empty}>No events yet.</div>
              ) : (
                <ul style={S.list}>
                  {rightPanelEvents
                    .slice()
                    .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)))
                    .map((ev) => (
                      <li key={ev.id} style={S.item}>
                        <div>
                          <div style={{ fontWeight: 700 }}>
                            {ev.title} {ev.time ? <span style={S.muted}>• {ev.time}</span> : null}
                          </div>
                          <div style={S.mutedSmall}>
                            {parseKey(ev.date).toDateString()}
                            {ev.note ? ` — ${ev.note}` : ""}
                          </div>
                        </div>
                        <button style={S.remove} onClick={() => deleteEvent(ev.id)}>Delete</button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </aside>
        </div>

        <footer style={S.footer}>
          <span>© {new Date().getFullYear()} TINITIATE • Demo calendar</span>
          <span style={S.muted}>Events saved to your browser (localStorage).</span>
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
      fontFamily:
        "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    container: { maxWidth: 1120, margin: "0 auto", padding: "24px 20px" },
    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, flexWrap: "wrap", marginBottom: 14,
    },
    brand: { display: "flex", alignItems: "center", gap: 12 },
    brandMark: {
      width: 28, height: 28, borderRadius: 8,
      background: "linear-gradient(135deg, rgba(59,130,246,1), rgba(14,165,233,1))",
      boxShadow: "0 6px 16px rgba(59,130,246,0.35)",
    },
    brandTitle: { fontWeight: 900, letterSpacing: "-0.01em" },
    brandSub: { fontSize: 13, color: "#475569" },

    controls: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
    segment: {
      display: "inline-flex", gap: 6, background: "white",
      border: "1px solid #e2e8f0", padding: 4, borderRadius: 999,
    },
    segmentBtn: {
      border: "none", background: "transparent", padding: "8px 12px",
      borderRadius: 999, cursor: "pointer", fontWeight: 700, color: "#0f172a",
    },
    segmentBtnActive: { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" },

    nav: { display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
    monthLabel: { minWidth: 180, textAlign: "center", fontWeight: 800 },
    btn: {
      padding: "10px 14px", background: "#2563eb", color: "white", border: "none",
      borderRadius: 10, fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 18px rgba(37,99,235,0.22)",
    },
    ghost: {
      padding: "8px 12px", background: "white", color: "#0f172a",
      border: "1px solid #e2e8f0", borderRadius: 10, fontWeight: 600, cursor: "pointer",
    },

    layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: 14 },

    // Calendar card
    calCard: {
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
      padding: 12, boxShadow: "0 10px 20px rgba(2,6,23,0.04)",
    },
    weekRow: {
      display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6,
    },
    weekCell: {
      textAlign: "center", fontWeight: 800, color: "#475569", fontSize: 12,
    },
    grid: {
      display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6,
    },
    cell: {
      display: "grid", gridTemplateRows: "auto 1fr", alignItems: "start",
      minHeight: 92, textAlign: "left", padding: 8, borderRadius: 12,
      border: "1px solid #e2e8f0", background: "white", cursor: "pointer",
      transition: "transform .12s ease, box-shadow .12s ease, background .12s ease",
    },
    cellMuted: { opacity: 0.55, background: "#fafafa" },
    cellToday: { outline: "2px solid #2563eb", outlineOffset: "-2px" },
    cellSelected: { background: "#eff6ff", borderColor: "#bfdbfe" },
    cellInRange: { background: "#eef2ff" },
    cellRangeEdge: { boxShadow: "0 0 0 2px #6366f1 inset" },

    cellTop: { display: "flex", alignItems: "baseline", justifyContent: "space-between" },
    dayNum: { fontWeight: 800 },
    dots: { display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 },
    dot: { width: 8, height: 8, borderRadius: 999, background: "#2563eb" },
    more: { fontSize: 12, color: "#475569" },

    // Right panel
    side: { display: "grid", gap: 12, alignSelf: "start" },
    formCard: {
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
      padding: 12, boxShadow: "0 12px 24px rgba(2,6,23,0.06)", display: "grid", gap: 8,
    },
    listCard: {
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
      padding: 12, boxShadow: "0 12px 24px rgba(2,6,23,0.06)", display: "grid", gap: 8,
    },
    formHead: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    group: { display: "grid", gap: 6 },
    label: { fontSize: 12, fontWeight: 700 },
    input: {
      padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 12,
      outline: "none", background: "white", fontSize: 14,
    },
    textarea: {
      minHeight: 80, padding: "10px 12px", border: "1px solid #cbd5e1",
      borderRadius: 12, outline: "none", background: "white", fontSize: 14, resize: "vertical",
    },
    row: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
    hint: { fontSize: 12, color: "#64748b" },
    actions: { display: "flex", gap: 8, alignItems: "center" },

    list: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 },
    item: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 10, border: "1px solid #eef2f7", borderRadius: 12, padding: 10,
    },
    muted: { color: "#64748b", fontSize: 13 },
    mutedSmall: { color: "#64748b", fontSize: 12 },
    remove: { border: "none", background: "transparent", color: "#b91c1c", cursor: "pointer", textDecoration: "underline" },

    footer: {
      marginTop: 18, paddingTop: 12, borderTop: "1px solid #e2e8f0",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 10, fontSize: 13,
    },
  };
}

/* ================= How to use (Vite) =================
1) Save as: src/CalendarPage.jsx
2) In src/App.jsx:
   import CalendarPage from "./CalendarPage";
   export default function App(){ return <CalendarPage/>; }
3) npm run dev
*/
