import Link from "next/link";
import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import { site } from "@/content/site";
import { getPosts, formatDate } from "@/lib/writing";
import { SOCIAL_IMAGE_ALT } from "@/lib/social-image";

const description =
  "Notes on engineering in the AI age, building for ABA therapy, learning in public, and trading code quality for outcomes.";

export const metadata: Metadata = {
  title: "Writing",
  description,
  alternates: { canonical: `${site.url}/writing` },
  openGraph: {
    title: `Writing · ${site.name}`,
    description,
    url: `${site.url}/writing`,
    type: "website",
    images: [
      {
        url: `${site.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: SOCIAL_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Writing · ${site.name}`,
    description,
    images: [{ url: `${site.url}/twitter-image`, alt: SOCIAL_IMAGE_ALT }],
  },
};

export default function WritingIndex() {
  const posts = getPosts();

  return (
    <div className="app">
      <TopBar />
      <div className="page">
        <Link className="backlink" href="/">
          ← back to localhost
        </Link>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, letterSpacing: "-.025em", lineHeight: 1.1 }}>
          Writing
        </h1>
        <p style={{ color: "var(--dim)", marginTop: 12, maxWidth: "60ch", fontSize: 16 }}>
          Notes on engineering in the AI age, building for ABA therapy, learning in public, and trading code quality for
          outcomes.
        </p>
        <div className="writing-list">
          {posts.map((p) => (
            <Link className="wcard" key={p.slug} href={`/writing/${p.slug}`}>
              <div className="wtop">
                <span className="pillar">[{p.pillar}]</span>
                <span>{formatDate(p.date)}</span>
                {p.draft && <span>· draft</span>}
              </div>
              <div className="wt">{p.title}</div>
              <div className="wd">{p.summary}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
