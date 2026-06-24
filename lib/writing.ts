import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content", "writing");

// YAML auto-parses `date: 2026-06-20` into a Date at UTC midnight. Stringifying it
// gives a locale string (wrong day in negative-offset TZs, and sorts by weekday
// name). Normalize back to a stable ISO YYYY-MM-DD string.
function toISODate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? "");
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  pillar: string;
  summary: string;
  draft: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

function readAll(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
      return {
        slug,
        title: String(data.title ?? slug),
        date: toISODate(data.date),
        pillar: String(data.pillar ?? ""),
        summary: String(data.summary ?? ""),
        draft: Boolean(data.draft ?? false),
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPosts(): PostMeta[] {
  return readAll().map(({ content, ...meta }) => {
    void content;
    return meta;
  });
}

export function getPost(slug: string): Post | undefined {
  return readAll().find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  // parse YYYY-MM-DD as a local date; new Date("2026-06-20") is UTC midnight,
  // which renders as the previous day in negative-offset timezones (e.g. Denver)
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
