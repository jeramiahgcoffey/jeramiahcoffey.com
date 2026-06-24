import { site } from "@/content/site";
import { featuredRepos } from "@/content/work";

export interface RepoCard {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
}

interface GhRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
}

/**
 * Fetch live data for the curated featured repos.
 * Falls back to static descriptions if the GitHub API is unavailable or
 * rate-limited (unauthenticated build). Revalidates hourly.
 */
export async function getFeaturedRepos(): Promise<RepoCard[]> {
  let live: Record<string, GhRepo> = {};
  try {
    const res = await fetch(
      `https://api.github.com/users/${site.handle}/repos?per_page=100&sort=updated`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    );
    if (res.ok) {
      const repos = (await res.json()) as GhRepo[];
      live = Object.fromEntries(repos.map((r) => [r.name, r]));
    }
  } catch {
    // network failure at build time — fall back to static data below
  }

  return featuredRepos.map((f) => {
    const r = live[f.name];
    return {
      name: f.name,
      description: r?.description?.trim() || f.fallbackDesc,
      language: r?.language || f.fallbackLang,
      stars: r?.stargazers_count ?? 0,
      url: r?.html_url || `https://github.com/${site.handle}/${f.name}`,
    };
  });
}
