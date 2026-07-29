# jeramiahcoffey.com

Personal site for Jeramiah Coffey, built from scratch. The concept: a career as a
live system you scan. Roles are processes (`RUNNING`, `PUBLISHED`, `EXIT 0`),
side projects run as daemons, and the whole thing behaves like the localhost
process monitor it is named after (`portview`).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind v4** for tokens, hand-authored CSS for the system UI
- **next/font**: JetBrains Mono + Hanken Grotesk
- Markdown writing with `js-yaml` + `react-markdown`
- Live GitHub telemetry (repos, stars, and releases), revalidated hourly with
  failure-safe local fallbacks
- Playwright browser smoke tests + GitHub Actions CI

## Develop

```bash
npm run dev     # http://localhost:3000
npm run build   # production build + type check
npm run lint    # Next.js, React, TypeScript, and accessibility linting
npm test        # Playwright smoke tests against the production build
npm run check   # lint + build + browser tests
npm start       # serve the production build
```

Playwright expects a production build. Run `npm run build` before `npm test`;
the test configuration starts the production server automatically.

## Where the content lives

- `content/site.ts` — name, url, socials, location, career start (drives the uptime ticker)
- `content/work.ts` — the process table (roles), toolchain, featured repos;
  the `portview` process version is overlaid from the latest live release
- `content/writing/*.md` — blog posts. Frontmatter: `title, date, pillar, summary, draft`
- `lib/github.ts` — fetches the shared GitHub telemetry snapshot and featured repo data
- `components/PortfolioStats.tsx` — renders career, writing, repo, star, and release stats
- `app/page.tsx` — the dashboard; `about.md` prose is inline here

To add a post: drop a `.md` file in `content/writing/`. It appears in
`tail -f writing.log` on the home page and at `/writing`.

SEO discovery files are generated from the same content:

- `app/sitemap.ts` includes the home page, writing index, and published posts.
- `app/robots.ts` points crawlers to the sitemap.
- `app/opengraph-image.tsx` and `app/twitter-image.tsx` generate social cards.

The home page is incrementally regenerated every hour. GitHub requests run in
parallel and can use an optional server-only `GITHUB_TOKEN` for higher API rate
limits. Without a token, the public API is used; if GitHub is unavailable,
local career and writing stats still render and remote values show an honest
unavailable state rather than stale hard-coded numbers.

## Design rules

- **green = alive** (status only), **gold = voice** (brand). Nothing else uses them.
- No em dashes, anywhere.
- No AI-slop tells: no gradient text, no glassmorphism, tinted not pure black.

## Deploy

See [DEPLOY.md](./DEPLOY.md) for Vercel + GoDaddy DNS.
