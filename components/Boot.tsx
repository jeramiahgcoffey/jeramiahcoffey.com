"use client";

import { useEffect, useState } from "react";

// persists across client-side navigations within a single page load, so
// returning to home from /writing doesn't replay the boot sequence.
// resets on a hard reload (new JS context), which is when we *want* it.
let hasBooted = false;

export default function Boot() {
  const [done, setDone] = useState(() => hasBooted);
  const [lines, setLines] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (hasBooted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hasBooted = true;
      setDone(true);
      return;
    }
    hasBooted = true;
    const timers: number[] = [];
    [1, 2, 3].forEach((n, i) => timers.push(window.setTimeout(() => setLines(n), 180 * (i + 1))));
    const fadeT = window.setTimeout(() => setFade(true), 180 * 3 + 420);
    const doneT = window.setTimeout(() => setDone(true), 180 * 3 + 420 + 320);

    const skip = () => {
      setFade(true);
      window.setTimeout(() => setDone(true), 150);
    };
    const armT = window.setTimeout(() => {
      window.addEventListener("keydown", skip, { once: true });
      window.addEventListener("click", skip, { once: true });
    }, 150);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(fadeT);
      clearTimeout(doneT);
      clearTimeout(armT);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, []);

  if (done) return null;

  return (
    <div id="boot" aria-hidden="true" style={{ opacity: fade ? 0 : 1, transition: "opacity .3s" }}>
      <div className="mono">
        {lines >= 1 && (
          <div className="l">
            <span className="n">~</span> scanning localhost for processes
          </div>
        )}
        {lines >= 2 && (
          <div className="l">
            found <span className="ok">3</span> running, <span className="ok">3</span> exited 0
          </div>
        )}
        {lines >= 3 && (
          <div className="l">
            <span className="ok">ready.</span>
          </div>
        )}
      </div>
    </div>
  );
}
