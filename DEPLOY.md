# Deploying jeramiahcoffey.com

Target: **Vercel** (hosting) + **GoDaddy** (DNS for the domain you already own).

## 1. Push to GitHub

```bash
gh repo create jeramiahcoffey.com --private --source . --remote origin --push
```

(or make it public if you want the source visible as part of the portfolio.)

## 2. Import into Vercel

1. Go to https://vercel.com/new and import the repo.
2. Framework preset: **Next.js** (auto-detected). No env vars are required.
   Optionally set a server-only `GITHUB_TOKEN` with read access to public
   metadata for higher API rate limits.
3. Deploy. You get a `*.vercel.app` URL to verify against.

No build config is required. GitHub telemetry is cached and revalidated hourly.
It falls back to curated repo descriptions and marks unavailable remote stats,
so rate limits or network failures never fail the build or fabricate a zero.

## 3. Point the domain (GoDaddy)

In Vercel: **Project → Settings → Domains → Add** `jeramiahcoffey.com`
(add `www.jeramiahcoffey.com` too; Vercel will offer to redirect one to the other).

Vercel then shows the exact records. The standard setup:

| Type  | Host / Name | Value                    |
| ----- | ----------- | ------------------------ |
| A     | `@`         | `76.76.21.21`            |
| CNAME | `www`       | `cname.vercel-dns.com`   |

In **GoDaddy → Domain → DNS → Manage Zones** for `jeramiahcoffey.com`:

1. Edit the existing `A` record for `@` to the value Vercel shows (verify it in
   the Vercel dashboard, do not trust this doc blindly, the IP can change).
2. Add/point the `www` `CNAME` to `cname.vercel-dns.com`.
3. Remove any GoDaddy parking/forwarding records that conflict with `@` or `www`.

Propagation is usually minutes, up to ~48h worst case. Vercel auto-provisions
HTTPS once DNS resolves.

> Tip: GoDaddy sometimes has a "Forwarding" setting that overrides A records.
> If the apex domain will not resolve to Vercel, check Forwarding is off.

## 4. After it is live

- Confirm `https://jeramiahcoffey.com` loads.
- Confirm `https://www.jeramiahcoffey.com` permanently redirects to the apex domain.
- Set the canonical (already configured to `https://jeramiahcoffey.com` in `app/layout.tsx`).
- Confirm `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, and `/twitter-image` return successfully.
- Add the domain property in Google Search Console, submit
  `https://jeramiahcoffey.com/sitemap.xml`, and confirm the home page is indexable.
- Test a shared link in an Open Graph preview tool to confirm the generated
  1200x630 social card renders correctly.
