# Deploying jeramiahcoffey.com

Target: **Vercel** (hosting) + **GoDaddy** (DNS for the domain you already own).

## 1. Push to GitHub

```bash
gh repo create jeramiahcoffey.com --private --source . --remote origin --push
```

(or make it public if you want the source visible as part of the portfolio.)

## 2. Import into Vercel

1. Go to https://vercel.com/new and import the repo.
2. Framework preset: **Next.js** (auto-detected). No env vars needed.
3. Deploy. You get a `*.vercel.app` URL to verify against.

No build config required. The GitHub repo fetch in `lib/github.ts` runs
unauthenticated and falls back to static descriptions, so the build never
fails on rate limits.

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

- Confirm `https://jeramiahcoffey.com` and `https://www.jeramiahcoffey.com` both load.
- Set the canonical (already configured to `https://jeramiahcoffey.com` in `app/layout.tsx`).
- Optional: add an OG image at `app/opengraph-image.png` (1200x630) for richer link previews.
