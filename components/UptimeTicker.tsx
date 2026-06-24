"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

export default function UptimeTicker() {
  const [label, setLabel] = useState("uptime …");

  useEffect(() => {
    const start = new Date(site.careerStart + "T00:00:00");
    const pad = (n: number) => String(n).padStart(2, "0");
    function tick() {
      const now = new Date();
      let y = now.getFullYear() - start.getFullYear();
      let mo = now.getMonth() - start.getMonth();
      let d = now.getDate() - start.getDate();
      if (d < 0) {
        mo--;
        d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      }
      if (mo < 0) {
        y--;
        mo += 12;
      }
      setLabel(`uptime ${y}y ${mo}mo ${d}d · ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="pill mono uptime" suppressHydrationWarning>
      {label}
    </span>
  );
}
