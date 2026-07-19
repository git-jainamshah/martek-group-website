# Martek Admin Panel

A hidden, self-contained admin backend at **`/admin`**. No external services, no new npm
dependencies — the database is SQLite built into Node.js (requires **Node ≥ 22.13**), stored
at `data/admin.db` (gitignored).

## Sign in

- URL: `/admin` (redirects to `/admin/login`)
- First admin: `email.jainam@gmail.com` / `Password@023!`
  **Change this password right after your first sign-in** (Access Management → key icon on
  your own row gives you a fresh temp password flow, or just use it once and rotate).

The admin area is invisible to search engines: it is excluded from the sitemap, served with
`X-Robots-Tag: noindex` + meta robots, and deliberately *not* listed in robots.txt (listing
it would advertise the URL).

## Modules

| Page | What it does |
|---|---|
| Dashboard | Counts + latest leads at a glance |
| Manage Media | Every media file linked on the live site, where it's used (file + line), one-click replace (same URL, old file archived to `public/uploads/archive`) |
| Storage | iPhone-style gallery — Photos / Videos tabs, sort by date added / modified / size / name, asc/desc, group by date. Delete is blocked with an error popup if the file is linked on the site |
| Analytics & SEO | Link GTM / Tealium per environment (production / qa / dev). Custom scripts with drag-to-reorder load order, placement (head / body / footer), and fire before-or-after tag managers. robots.txt extra rules + Google/Bing verification tokens |
| Pricing & Packages | Edit every pricing card across Home, Pricing page, and all five service pages. Changes are live within 60 seconds |
| Announcements & Banners | Top black bar copy (default + per-page overrides, `**bold**` supported). Promo pop-up banner feature flag with 3 templates: simple copy, picture + buttons, sign-up form |
| Leads | Every form submission stored permanently (no delete). Filter by search / status / form / service / budget / date range. Status pipeline (new → contacted → qualified → won/lost), internal notes, export CSV / Excel / PDF |
| Access Management | Add users (first, last, email → email is the username). Auto-generated temp password shown once in a popup to hand over. Temp-password sign-ins force a new password; the temp one is discarded. Revoke / restore access, reset passwords |

## Performance rules baked in

- A tag manager's loader is rendered **only** if linked & enabled for the current
  environment. No GTM linked → zero GTM bytes; no Tealium linked → nothing Tealium-related
  is even requested.
- Public pages stay statically served with 60-second ISR revalidation, so admin edits go
  live within a minute without slowing the site down.

## Environments

Set `MARTEK_ENV` to `production`, `qa`, or `dev` on each deployment to control which tag
managers/scripts load. Without it: Vercel production → `production`, Vercel preview → `qa`,
local dev → `dev`, plain `next start` → `production`.

## Version control / rollback

- All code is in git — each admin module was committed separately, so any module can be
  reverted individually.
- `data/admin.db` holds all content (leads, users, scripts, pricing, settings). Back it up
  by copying the file. Media replacements archive the previous file automatically.

## Important deployment note

The DB and media storage use the local filesystem. That's perfect for local use, a VPS, or
any persistent server. **Vercel's serverless filesystem is ephemeral** — on Vercel the
public site keeps working (it falls back to built-in defaults), but admin data won't
persist. When you're ready to run the admin on Vercel, we swap `lib/admin/sqlite.ts` for a
hosted Postgres (e.g. Supabase/Neon) and media to Blob storage — the rest of the code is
already structured for that swap.

## After pulling this branch

```bash
npm install   # no new packages, but refreshes lockfile state
npm run dev   # requires Node >= 22.13
# open http://localhost:3000/admin
```
