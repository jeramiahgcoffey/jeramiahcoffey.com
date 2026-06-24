# jeramiahcoffey.com

Personal site for Jeramiah Coffey, built from scratch. The concept: a career as a
live system you scan. Roles are processes (`RUNNING`, `PUBLISHED`, `EXIT 0`),
side projects run as daemons, and the whole thing behaves like the localhost
process monitor it is named after (`portview`).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind v4** for tokens, hand-authored CSS for the system UI
- **next/font**: JetBrains Mono + Hanken Grotesk
- Markdown writing with `gray-matter` + `react-markdown`
- Live GitHub repo data, revalidated hourly

## Develop

```bash
npm run dev     # http://localhost:3000
npm run build   # production build + type check
npm start       # serve the production build
```

## Where the content lives

- `content/site.ts` — name, url, socials, location, career start (drives the uptime ticker)
- `content/work.ts` — the process table (roles), toolchain, featured repos
- `content/writing/*.md` — blog posts. Frontmatter: `title, date, pillar, summary, draft`
- `lib/github.ts` — fetches live stars/descriptions for featured repos
- `app/page.tsx` — the dashboard; `about.md` prose is inline here

To add a post: drop a `.md` file in `content/writing/`. It appears in
`tail -f writing.log` on the home page and at `/writing`.

## Design rules

- **green = alive** (status only), **gold = voice** (brand). Nothing else uses them.
- No em dashes, anywhere.
- No AI-slop tells: no gradient text, no glassmorphism, tinted not pure black.

## Deploy

See [DEPLOY.md](./DEPLOY.md) for Vercel + GoDaddy DNS.
