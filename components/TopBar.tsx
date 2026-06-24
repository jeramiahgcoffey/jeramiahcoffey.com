"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UptimeTicker from "./UptimeTicker";
import { site } from "@/content/site";

const NAV = [
  { id: "work", href: "/#work", label: "work" },
  { id: "source", href: "/#source", label: "source" },
  { id: "writing", href: "/writing", label: "writing", route: true },
  { id: "about", href: "/#about", label: "about" },
];

// home-page sections tracked for scroll-spy, in vertical order
const IDS = ["work", "source", "about"];

export default function TopBar() {
  const pathname = usePathname();
  const onWriting = pathname?.startsWith("/writing") ?? false;
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (onWriting) return;
    if (!document.getElementById(IDS[0])) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      const offset = 140;
      let current = IDS[0];
      for (const id of IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) current = id;
      }
      // last section can't always scroll to the top band — force it at page bottom
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = IDS[IDS.length - 1];
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onWriting]);

  // light up the section panel currently under the bar
  useEffect(() => {
    IDS.forEach((id) => {
      document.getElementById(id)?.classList.toggle("in-view", id === active && !onWriting);
    });
  }, [active, onWriting]);

  // dropdown: close on Escape, outside click, or growing past the mobile breakpoint
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 560) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const activeNav = onWriting ? "writing" : active;
  const pathLabel = onWriting ? "/writing" : active ? `/${active}` : "";

  // smooth-scroll for in-page section links (reliable across App Router nav);
  // falls through to normal navigation when the target isn't on this page
  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    setMenuOpen(false);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <header className="topbar mono" ref={headerRef}>
      <Link className="host" href="/" aria-label="Home">
        jeramiah<b>.</b>localhost
        <span className="path" suppressHydrationWarning>
          {pathLabel}
        </span>
      </Link>
      <span className="pill online">
        <span className="led" />
        online
      </span>
      <UptimeTicker />
      <span className="pill loc">{site.location}</span>
      <span className="spacer" />
      <button
        type="button"
        className="cmdk-btn"
        aria-label="Open command menu"
        onClick={() => window.dispatchEvent(new CustomEvent("toggle-cmdk"))}
      >
        <svg className="ico" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="cmdk-kbd" aria-hidden="true">⌘K</span>
      </button>
      <button
        type="button"
        className="menu-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="topnav"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className="bars" aria-hidden="true" />
      </button>
      <nav id="topnav" aria-label="Sections" className={menuOpen ? "open" : undefined}>
        {NAV.map((item) => {
          const cls = activeNav === item.id ? "active" : undefined;
          // routed link (writing), or a hash link when we're off the home page:
          // use next/link so it's a client-side nav (no full reload, no boot replay)
          if (item.route || onWriting) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cls}
                aria-current={cls ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          }
          // on home: smooth-scroll to the in-page section
          return (
            <a
              key={item.id}
              href={item.href}
              className={cls}
              aria-current={cls ? "true" : undefined}
              onClick={(e) => jump(e, item.id)}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
