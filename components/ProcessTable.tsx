"use client";

import { useEffect, useRef, useState } from "react";
import { processes as ALL, statusClass, type Process } from "@/content/work";

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
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const qRef = useRef(q);
  const selRef = useRef(sel);
  qRef.current = q;
  selRef.current = sel;

  const visible = ALL.filter((p) => match(p, q));

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // command palette owns the keyboard while it's open
      if (document.body.classList.contains("cmdk-open")) return;
      const inInput = document.activeElement === inputRef.current;
      const ae = document.activeElement;
      const inRows = ae instanceof Element && !!ae.closest("#rows");

      if (e.key === "/" && !inInput) {
        e.preventDefault();
        setFilterOn(true);
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }
      if (e.key === "Escape") {
        setFilterOn(false);
        setQ("");
        setOpen(null);
        inputRef.current?.blur();
        // step out of the table so j/k/arrows control sections again
        if (inRows) (ae as HTMLElement).blur();
        return;
      }
      if (inInput) return;

      // row navigation only while a row in this table is focused; otherwise
      // let global section nav (j/k/arrows) move between sections
      if (!inRows) return;

      const vis = ALL.filter((p) => match(p, qRef.current));
      if (!vis.length) return;
      const idx = Math.max(0, vis.findIndex((p) => p.name === selRef.current));

      const focus = (name: string) => rowRefs.current[name]?.scrollIntoView({ block: "nearest" });

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        const next = vis[Math.min(idx + 1, vis.length - 1)].name;
        setSel(next);
        focus(next);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        const prev = vis[Math.max(idx - 1, 0)].name;
        setSel(prev);
        focus(prev);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cur = vis[idx]?.name;
        if (cur) setOpen((o) => (o === cur ? null : cur));
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="panel" id="work" aria-label="Work history">
      <div className="panel-h mono">
        <span>
          <span className="cmd">$</span> ps -ef --career
        </span>
        <span className="r">{ALL.length} processes</span>
      </div>

      {filterOn && (
        <div className="filter mono">
          <span className="pre">/</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
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
              ref={(el) => {
                rowRefs.current[p.name] = el;
              }}
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
              <span className="el">{p.elapsed}</span>
            </button>

            <div className={`detail${open === p.name ? " open" : ""}`}>
              <div className="detail-in">
                <div className="when">{p.when}</div>
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
      </div>
    </section>
  );
}
