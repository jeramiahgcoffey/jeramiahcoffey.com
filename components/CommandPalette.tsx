"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "@/content/site";

// sections in DOM/visual order; ids must match the markup in app/page.tsx
const SECTIONS = [
  { id: "intro", label: "intro" },
  { id: "work", label: "work" },
  { id: "source", label: "source" },
  { id: "about", label: "about" },
  { id: "toolchain", label: "toolchain" },
  { id: "writing", label: "writing" },
  { id: "contact", label: "contact" },
] as const;

type Command = { id: string; label: string; hint: string; run: () => void };

function isEditable(el: EventTarget | null) {
  const n = el as HTMLElement | null;
  if (!n) return false;
  const tag = n.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || n.isContentEditable;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  // refs mirror state so the stable global key listener reads current values
  const openRef = useRef(open);
  openRef.current = open;
  const activeRef = useRef(active);
  activeRef.current = active;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    setCopied(false);
  }, []);

  const scrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? "auto" : "smooth");

  const goToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
        // focus now lives on the section; don't let close() pull it back to the trigger
        restoreFocus.current = null;
        window.history.replaceState(null, "", `/#${id}`);
      } else {
        router.push(`/#${id}`);
      }
    },
    [router],
  );

  // move between page sections with [ and ]
  const step = useCallback(
    (dir: 1 | -1) => {
      const present = SECTIONS.filter((s) => document.getElementById(s.id));
      if (!present.length) return;
      const offset = 120;
      let cur = 0;
      present.forEach((s, i) => {
        const top = document.getElementById(s.id)!.getBoundingClientRect().top;
        if (top <= offset) cur = i;
      });
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) cur = present.length - 1;
      const next = Math.min(Math.max(cur + dir, 0), present.length - 1);
      goToSection(present[next].id);
    },
    [goToSection],
  );

  const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const copyEmail = useCallback(() => {
    if (!navigator.clipboard) {
      window.location.href = site.socials.email;
      return;
    }
    navigator.clipboard.writeText(site.email).then(
      () => {
        setCopied(true);
        window.setTimeout(close, 850);
      },
      () => {
        window.location.href = site.socials.email;
      },
    );
  }, [close]);

  const commands = useMemo<Command[]>(
    () => [
      ...SECTIONS.map((s) => ({
        id: `go-${s.id}`,
        label: `Go to ${s.label}`,
        hint: "section",
        run: () => goToSection(s.id),
      })),
      { id: "open-writing", label: "Open writing", hint: "page", run: () => router.push("/writing") },
      { id: "go-home", label: "Go home", hint: "page", run: () => router.push("/") },
      { id: "copy-email", label: "Copy email address", hint: "action", run: copyEmail },
      { id: "email", label: "Email me", hint: "link", run: () => (window.location.href = site.socials.email) },
      { id: "github", label: "GitHub profile", hint: "link", run: () => openExternal(site.socials.github) },
      { id: "linkedin", label: "LinkedIn profile", hint: "link", run: () => openExternal(site.socials.linkedin) },
      { id: "view-source", label: "View site source", hint: "link", run: () => openExternal(site.repo) },
    ],
    [goToSection, router, copyEmail],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(q));
  }, [commands, query]);
  const filteredRef = useRef(filtered);
  filteredRef.current = filtered;

  const runCommand = useCallback(
    (cmd: Command) => {
      if (cmd.id === "copy-email") {
        cmd.run();
        return; // keeps the panel open to show "copied", then auto-closes
      }
      cmd.run();
      close();
    },
    [close],
  );
  const runRef = useRef(runCommand);
  runRef.current = runCommand;

  // single global key listener; reads latest via refs
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (!openRef.current) {
        if (isEditable(e.target)) return;
        // [ and ] always jump sections, even from inside the table
        if (e.key === "]") {
          e.preventDefault();
          step(1);
          return;
        }
        if (e.key === "[") {
          e.preventDefault();
          step(-1);
          return;
        }
        // j/k/arrows jump sections too, unless a table row is focused (it owns them)
        const ae = document.activeElement;
        const inRows = ae instanceof Element && !!ae.closest("#rows");
        if (inRows) return;
        if (e.key === "j" || e.key === "ArrowDown") {
          e.preventDefault();
          step(1);
        } else if (e.key === "k" || e.key === "ArrowUp") {
          e.preventDefault();
          step(-1);
        }
        return;
      }
      // palette open
      const n = filteredRef.current.length;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (n ? Math.min(a + 1, n - 1) : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        setActive(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActive(Math.max(n - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filteredRef.current[activeRef.current];
        if (cmd) runRef.current(cmd);
      } else if (e.key === "Tab") {
        e.preventDefault(); // trap focus in the dialog
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [step, close]);

  // trigger from the top-bar button
  useEffect(() => {
    const toggle = () => setOpen((o) => !o);
    window.addEventListener("toggle-cmdk", toggle);
    return () => window.removeEventListener("toggle-cmdk", toggle);
  }, []);

  // body lock + focus management while open
  useEffect(() => {
    if (open) {
      restoreFocus.current = document.activeElement as HTMLElement;
      document.body.classList.add("cmdk-open");
      requestAnimationFrame(() => inputRef.current?.focus());
      return () => {
        document.body.classList.remove("cmdk-open");
        restoreFocus.current?.focus?.();
      };
    }
  }, [open]);

  // keep the active option scrolled into view
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!open) return null;

  const activeId = filtered[active]?.id ? `cmdk-opt-${filtered[active].id}` : undefined;

  return (
    <div className="cmdk-overlay" onMouseDown={close}>
      <div
        className="cmdk mono"
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cmdk-input">
          <span className="cmdk-prompt" aria-hidden="true">
            {copied ? "ok" : "›"}
          </span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-activedescendant={activeId}
            aria-label="Type a command or search"
            placeholder={copied ? "email copied to clipboard" : "type a command or search…"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="cmdk-esc" aria-hidden="true">
            esc
          </kbd>
        </div>

        <div className="cmdk-list" id="cmdk-list" role="listbox" aria-label="Commands" ref={listRef}>
          {filtered.length === 0 && <div className="cmdk-empty">no matching commands</div>}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              id={`cmdk-opt-${cmd.id}`}
              type="button"
              role="option"
              aria-selected={i === active}
              data-active={i === active}
              className={`cmdk-opt${i === active ? " active" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseMove={() => setActive(i)}
              onClick={() => runCommand(cmd)}
            >
              <span className="cmdk-label">{cmd.label}</span>
              <span className="cmdk-hint">{cmd.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
