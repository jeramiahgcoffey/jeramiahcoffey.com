"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const path = usePathname() || "/unknown";

  return (
    <div className="app">
      <main className="notfound">
        <div className="nf-card mono">
          <div className="nf-top">
            <span className="dot" aria-hidden="true" />
            <span className="dot" aria-hidden="true" />
            <span className="dot" aria-hidden="true" />
            <span className="nf-title">jeramiah.localhost — 404</span>
          </div>
          <div className="nf-body">
            <p className="l">
              <span className="cmd">$</span> curl localhost{path}
            </p>
            <p className="l err">curl: (7) failed to connect — no process listening on that route</p>
            <p className="l dim">exit status 404</p>
            <p className="l">
              <span className="cmd">$</span> cd ~<span className="cur" aria-hidden="true" />
            </p>
          </div>
          <nav className="nf-actions" aria-label="Recovery">
            <Link href="/">cd ~ (home)</Link>
            <Link href="/writing">ls ~/writing</Link>
          </nav>
        </div>
      </main>
    </div>
  );
}
