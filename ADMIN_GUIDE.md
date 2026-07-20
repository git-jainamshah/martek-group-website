# Marrelay Admin Panel

A hidden admin backend at **`/admin`**, backed by **Postgres** — works on Vercel (Neon),
any hosted Postgres, or locally. One env var (`DATABASE_URL`) is the only configuration.

## One-time setup (Vercel)

1. Vercel dashboard → your `martek_website` project → **Storage** → **Create Database** →
   **Neon (Postgres)** — free tier is plenty.
2. Connect it to the project for **all environments** (Production, Preview, Development).
   Vercel injects `DATABASE_URL` automatically.
3. Redeploy (or push any commit). The schema creates and seeds itself on first use.

For local development, copy the same connection string into `.env.local`:

```
DATABASE_URL=postgres://...your-neon-connection-string...
```

Local dev and all deployments can share one database, so content edits are consistent
everywhere.

## Sign in

- URL: `/admin` (redirects to `/admin/login`)
- First admin: `email.jainam@gmail.com` / `Password@023!`
  **Change this password right after your first sign-in.**

The admin area is invisible to search engines: excluded from the sitemap, served with
`X-Robots-Tag: noindex` + meta robots, and deliberately *not* listed in robots.txt
(listing it would advertise the URL).

## Modules

| Page | What it does |
|---|---|
| Dashboard | Counts + latest leads at a glance |
| Manage Media | Every media file linked on the live site, where it's used (file + line), one-click replace (same URL, old file archived) |
| Storage | iPhone-style gallery — Photos / Videos tabs, sort by date added / modified / size / name, asc/desc, group by date. Delete blocked with an error popup if the file is linked on the site |
| Analytics & SEO | Link GTM / Tealium per environment (production / qa / dev). Custom scripts with drag-to-reorder load order, placement (head / body / footer), fire before-or-after tag managers. robots.txt rules + Google/Bing verification |
| Pricing & Packages | Edit every pricing card across Home, Pricing page, and all five service pages. Live within 60 seconds |
| Announcements & Banners | Top black bar copy (default + per-page overrides, `**bold**` supported). Promo pop-up feature flag with 3 templates: simple copy, picture + buttons, sign-up form |
| Leads | Every form submission stored permanently (no delete). Filters: search / status / form / service / budget / date range. Status pipeline, internal notes, CSV / Excel / PDF export |
| Access Management | Add users (email = username), temp password shown once to hand over, forced password change on first sign-in, revoke / restore / reset |

## Performance rules baked in

- A tag manager's loader renders **only** if linked & enabled for the current environment.
  No GTM linked → zero GTM bytes; no Tealium linked → nothing Tealium-related is requested.
- Public pages stay statically served with 60-second ISR revalidation, so admin edits go
  live within a minute without slowing the site down.

## Environments

Set `MARTEK_ENV` to `production`, `qa`, or `dev` per deployment to control which tag
managers/scripts load. Defaults: Vercel production → `production`, Vercel preview → `qa`,
local dev → `dev`.

## Known limitation on Vercel (serverless)

Media **file** uploads/replacement need a writable disk, so on Vercel those two actions
are disabled with a clear message (browsing, link-mapping, and delete-protection still
work via a build-time manifest). They work fully when running on a persistent server.
Planned upgrade: Vercel Blob storage for full media management in the cloud.

## Version control / rollback

- Each admin module was committed separately on `qa/admin-backend` — any module can be
  reverted individually.
- All content lives in Postgres (Neon has point-in-time restore on paid tiers; free tier
  keeps daily backups). Media replacements archive the previous file automatically.

## After pulling this branch

```bash
npm install
npm run dev   # needs DATABASE_URL in .env.local for the admin; site works without it
```
