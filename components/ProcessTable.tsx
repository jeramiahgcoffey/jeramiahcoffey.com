"use client";

import { useRef, useState } from "react";
import { processes as ALL, statusClass, elapsedFor, whenFor, type Process } from "@/content/work";

function match(p: Process, query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return `${p.name} ${p.role} ${p.stack} ${p.status}`.toLowerCase().includes(q);
}

export default function ProcessTable() {
  const [q, setQ] = useState("");
  const [filterOn, setFilterOn] = useState(false);
  const [sel, setSel] = useState(ALL[0]?.name ?? "");
  const [open, setOpen] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Derived once per render so RUNNING tenure reflects the current month.
  const now = new Date();
  const visible = ALL.filter((p) => match(p, q));

  const toggleFilter = () => {
    setFilterOn((on) => {
      const next = !on;
      if (next) requestAnimationFrame(() => inputRef.current?.focus());
      else setQ("");
      return next;
    });
  };

  return (
    <section className="panel" id="work" aria-label="Work history">
      <div className="panel-h mono">
        <span>
          <span className="cmd">$</span> ps -ef --career
        </span>
        <span className="ph-right">
          <span className="r">{ALL.length} processes</span>
          <button
            type="button"
            className={`ph-filter${filterOn ? " on" : ""}`}
            aria-label={filterOn ? "Hide filter" : "Filter processes"}
            aria-expanded={filterOn}
            aria-controls="proc-filter"
            onClick={toggleFilter}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </span>
      </div>

      {filterOn && (
        <div className="filter mono" id="proc-filter">
          <span className="pre">/</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setQ("");
                setFilterOn(false);
                inputRef.current?.blur();
              }
            }}
            placeholder="filter processes by name, stack, status"
            autoComplete="off"
            aria-label="Filter processes"
          />
        </div>
      )}

      <div className="thead mono">
        <span>PORT</span>
        <span>PROCESS</span>
        <span>STATUS</span>
        <span>TIME</span>
      </div>

      <div id="rows">
        {visible.map((p, i) => (
          <div className="prow-wrap" key={p.name}>
            <button
              className={`prow stagger${sel === p.name ? " sel" : ""}`}
              style={{ animationDelay: `${i * 45}ms` }}
              aria-expanded={open === p.name}
              onMouseEnter={() => setSel(p.name)}
              onClick={() => {
                setSel(p.name);
                setOpen((o) => (o === p.name ? null : p.name));
              }}
            >
              <span className="port">{p.port}</span>
              <span className="name">
                {p.name}
                <span className="role">{p.role}</span>
              </span>
              <span className={`status ${statusClass[p.status]}`}>
                <span className="d" />
                {p.status}
              </span>
              <span className="el" suppressHydrationWarning>{elapsedFor(p, now)}</span>
            </button>

            <div className={`detail${open === p.name ? " open" : ""}`}>
              <div className="detail-in">
                <div className="when" suppressHydrationWarning>{whenFor(p)}</div>
                <div className="stk">{p.stack}</div>
                <ul>
                  {p.detail.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
                {p.link && (
                  <a className="repo" href={p.link} target="_blank" rel="noopener noreferrer">
                    view repo ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        {visible.length === 0 && <div className="no-proc mono">no processes match that filter</div>}
      </div>
    </section>
  );
}
