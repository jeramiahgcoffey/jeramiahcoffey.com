import "server-only";
import { site } from "@/content/site";
import { featuredRepos } from "@/content/work";

const GITHUB_REVALIDATE_SECONDS = 3600;

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
  fork: boolean;
}

interface GhRelease {
  tag_name: string;
  html_url: string;
  published_at: string | null;
}

interface GithubResult<T> {
  data: T | null;
  ok: boolean;
}

export interface GithubPortfolioData {
  featured: RepoCard[];
  publicRepoCount: number | null;
  totalStars: number | null;
  latestRelease: {
    tag: string;
    url: string;
    publishedAt: string | null;
  } | null;
  source: "live" | "partial" | "fallback";
  refreshSeconds: number;
}

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchGithub<T>(path: string): Promise<GithubResult<T>> {
  try {
    const response = await fetch(`https://api.github.com${path}`, {
      headers: githubHeaders(),
      next: {
        revalidate: GITHUB_REVALIDATE_SECONDS,
        tags: ["github-portfolio"],
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { data: null, ok: false };
    return { data: (await response.json()) as T, ok: true };
  } catch {
    return { data: null, ok: false };
  }
}

/**
 * Fetch the public GitHub snapshot used by both the telemetry bus and curated
 * repo rows. Requests run in parallel, revalidate hourly, and degrade
 * independently so a release-endpoint failure does not hide live repo data.
 */
export async function getGithubPortfolioData(): Promise<GithubPortfolioData> {
  const [reposResult, releaseResult] = await Promise.all([
    fetchGithub<GhRepo[]>(
      `/users/${site.handle}/repos?per_page=100&sort=updated`,
    ),
    fetchGithub<GhRelease>(
      `/repos/${site.handle}/portview/releases/latest`,
    ),
  ]);

  const repos = Array.isArray(reposResult.data) ? reposResult.data : null;
  const byName = Object.fromEntries((repos ?? []).map((repo) => [repo.name, repo]));
  const ownedRepos = repos?.filter((repo) => !repo.fork) ?? null;

  const successfulSources = Number(reposResult.ok) + Number(releaseResult.ok);
  const source =
    successfulSources === 2 ? "live" : successfulSources === 1 ? "partial" : "fallback";

  return {
    featured: featuredRepos.map((featured) => {
      const repo = byName[featured.name];
      return {
        name: featured.name,
        description: repo?.description?.trim() || featured.fallbackDesc,
        language: repo?.language || featured.fallbackLang,
        stars: repo?.stargazers_count ?? 0,
        url:
          repo?.html_url ||
          `https://github.com/${site.handle}/${featured.name}`,
      };
    }),
    publicRepoCount: ownedRepos?.length ?? null,
    totalStars:
      ownedRepos?.reduce((sum, repo) => sum + repo.stargazers_count, 0) ?? null,
    latestRelease:
      releaseResult.data && releaseResult.ok
        ? {
            tag: releaseResult.data.tag_name,
            url: releaseResult.data.html_url,
            publishedAt: releaseResult.data.published_at,
          }
        : null,
    source,
    refreshSeconds: GITHUB_REVALIDATE_SECONDS,
  };
}
