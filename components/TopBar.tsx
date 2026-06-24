import Link from "next/link";
import UptimeTicker from "./UptimeTicker";
import { site } from "@/content/site";

export default function TopBar() {
  return (
    <div className="topbar mono">
      <Link className="host" href="/">
        jeramiah<b>.</b>localhost
      </Link>
      <span className="pill">
        <span className="led" />
        online
      </span>
      <UptimeTicker />
      <span className="pill hideable">{site.location}</span>
      <span className="spacer" />
      <nav>
        <a href="/#work">work</a>
        <a href="/#source">source</a>
        <Link href="/writing">writing</Link>
        <a href="/#about">about</a>
      </nav>
    </div>
  );
}
