"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UptimeTicker from "./UptimeTicker";
import { site } from "@/content/site";

const NAV = [
  { id: "work", href: "/#work", label: "work" },
  { id: "source", href: "/#source", label: "source" },
  { id: "writing", href: "/writing", label: "writing", route: true },
  { id: "about", href: "/#about", label: "about" },
];

// ids present on the home page, in DOM order, for scroll-spy
const SPY_IDS = ["work", "source", "about", "writing"];

export default function TopBar() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = SPY_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!els.length) return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const current = SPY_IDS.find((id) => visible.get(id)) ?? null;
        setActive(current);
      },
      { rootMargin: "-82px 0px -62% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // light up the panel header of the section currently under the bar
  useEffect(() => {
    SPY_IDS.forEach((id) => {
      document.getElementById(id)?.classList.toggle("in-view", id === active);
    });
  }, [active]);

  return (
    <div className="topbar mono">
      <Link className="host" href="/">
        jeramiah<b>.</b>localhost
        <span className="path" suppressHydrationWarning>
          {active ? `/${active}` : ""}
        </span>
      </Link>
      <span className="pill">
        <span className="led" />
        online
      </span>
      <UptimeTicker />
      <span className="pill hideable">{site.location}</span>
      <span className="spacer" />
      <nav>
        {NAV.map((item) =>
          item.route ? (
            <Link key={item.id} href={item.href} className={active === item.id ? "active" : undefined}>
              {item.label}
            </Link>
          ) : (
            <a key={item.id} href={item.href} className={active === item.id ? "active" : undefined}>
              {item.label}
            </a>
          ),
        )}
      </nav>
    </div>
  );
}
