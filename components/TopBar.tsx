"use client";

import { useEffect, useState } from "react";
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

  const activeNav = onWriting ? "writing" : active;
  const pathLabel = onWriting ? "/writing" : active ? `/${active}` : "";

  // smooth-scroll for in-page section links (reliable across App Router nav);
  // falls through to normal navigation when the target isn't on this page
  const jump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `/#${id}`);
    setActive(id);
  };

  return (
    <header className="topbar mono">
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
      <nav aria-label="Sections">
        {NAV.map((item) =>
          item.route ? (
            <Link
              key={item.id}
              href={item.href}
              className={activeNav === item.id ? "active" : undefined}
              aria-current={activeNav === item.id ? "page" : undefined}
            >
              {item.label}
            </Link>
          ) : (
            <a
              key={item.id}
              href={item.href}
              className={activeNav === item.id ? "active" : undefined}
              aria-current={activeNav === item.id ? "true" : undefined}
              onClick={(e) => jump(e, item.id)}
            >
              {item.label}
            </a>
          ),
        )}
      </nav>
    </header>
  );
}
