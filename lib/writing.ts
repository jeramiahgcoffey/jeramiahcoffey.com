import fs from "node:fs";
import path from "node:path";
import { JSON_SCHEMA, load } from "js-yaml";

const DIR = path.join(process.cwd(), "content", "writing");
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function toISODate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? "");
}

function parsePost(file: string) {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const match = FRONTMATTER.exec(raw);
  if (!match) throw new Error(`Missing or invalid frontmatter in ${file}`);

  const parsed = load(match[1], { schema: JSON_SCHEMA });
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Frontmatter must be a mapping in ${file}`);
  }

  return {
    data: parsed as Record<string, unknown>,
    content: match[2],
  };
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
      const { data, content } = parsePost(file);
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
