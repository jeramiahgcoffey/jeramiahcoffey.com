import type { GithubPortfolioData } from "@/lib/github";

interface PortfolioStatsProps {
  careerStart: string;
  publishedPosts: number;
  github: GithubPortfolioData;
  snapshotAt: Date;
}

function careerTenure(start: string, now: Date): string {
  const from = new Date(`${start}T00:00:00Z`);
  let months =
    (now.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    now.getUTCMonth() -
    from.getUTCMonth();
  if (now.getUTCDate() < from.getUTCDate()) months -= 1;
  months = Math.max(0, months);

  const years = Math.floor(months / 12);
  return `${years}y ${months % 12}m`;
}

function releaseDate(iso: string | null): string {
  if (!iso) return "release published";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function padCount(value: number): string {
  return String(value).padStart(2, "0");
}

export default function PortfolioStats({
  careerStart,
  publishedPosts,
  github,
  snapshotAt,
}: PortfolioStatsProps) {
  const sourceLabel = {
    live: "github live",
    partial: "github partial",
    fallback: "local fallback",
  }[github.source];
  const snapshot = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(snapshotAt);

  return (
    <section
      className="panel telemetry"
      id="stats"
      aria-label="Live portfolio stats"
      data-source={github.source}
    >
      <div className="panel-h mono">
        <span>
          <span className="cmd">$</span> stats --live
        </span>
        <span
          className={`telemetry-health ${github.source}`}
          title={`${sourceLabel}; refreshes every ${github.refreshSeconds / 3600} hour`}
        >
          <span className="telemetry-led" aria-hidden="true" />
          {github.source} · {github.refreshSeconds / 3600}h refresh
        </span>
      </div>

      <dl className="telemetry-grid">
        <div className="telemetry-cell">
          <dt>engineering uptime</dt>
          <dd>{careerTenure(careerStart, snapshotAt)}</dd>
          <span>since Jun 2022</span>
        </div>
        <div className="telemetry-cell">
          <dt>published writing</dt>
          <dd>{padCount(publishedPosts)}</dd>
          <span>local content index</span>
        </div>
        <div className="telemetry-cell">
          <dt>public repos</dt>
          <dd>{github.publicRepoCount === null ? "—" : padCount(github.publicRepoCount)}</dd>
          <span>owned, excluding forks</span>
        </div>
        <div className="telemetry-cell">
          <dt>stars received</dt>
          <dd>{github.totalStars === null ? "—" : `★${github.totalStars}`}</dd>
          <span>across owned repos</span>
        </div>
        <div className="telemetry-cell telemetry-release">
          <dt>latest portview</dt>
          <dd>
            {github.latestRelease ? (
              <a
                href={github.latestRelease.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View portview ${github.latestRelease.tag} on GitHub`}
              >
                {github.latestRelease.tag} ↗
              </a>
            ) : (
              "—"
            )}
          </dd>
          <span>
            {github.latestRelease
              ? releaseDate(github.latestRelease.publishedAt)
              : "GitHub unavailable"}
          </span>
        </div>
      </dl>

      <div className="telemetry-foot mono">
        <span>snapshot {snapshot}</span>
        <span>static-first · stale-while-revalidate · failure-safe</span>
      </div>
    </section>
  );
}
