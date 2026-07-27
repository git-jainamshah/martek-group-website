# Environments: production, QA, dev

One Vercel project, three branches. **Production has its own database; QA and dev
share a second one.** Production data can never reach QA/dev or vice versa.

| | Production | QA | DEV |
|---|---|---|---|
| Branch | `main` | `qa` | `dev` |
| URL | www.marrelay.com | qa.marrelay.com | dev.marrelay.com |
| Database | `web-database` (`ep-hidden-dust-…`) | `marrelay-qa` (`ep-noisy-rain-…`) | same as QA |
| Reads env var | `DATABASE_URL` | `QA_DATABASE_URL` | `DEV_DATABASE_URL` |
| `NEXT_PUBLIC_APP_ENV` | *(unset)* | `qa` | `dev` |
| Indexed by Google | Yes | **No** | **No** |
| Admin banner | none | amber "QA" | blue "Development" |

Everything defaults to production: `NEXT_PUBLIC_APP_ENV` is unset there, so the
live site behaves exactly as it always has.

**QA and dev cannot silently fall back to production.** If `QA_DATABASE_URL` or
`DEV_DATABASE_URL` is ever missing, that environment throws an error instead of
connecting to the production database.

---

## Promotion flow

```
work/*  ──►  dev  ──►  qa  ──►  main
 build      try it    pre-prod   live
            fast      sign-off
```

```bash
# 1. Build on dev
git checkout dev && git pull
#    ...make changes...
git commit -am "what changed" && git push        # dev.marrelay.com updates

# 2. Promote to QA for final checks
git checkout qa && git pull && git merge dev && git push

# 3. Publish to production once QA looks right
git checkout main && git pull && git merge qa && git push
```

Each promotion is a fast-forward merge — same code, just moving forward. Nothing
is rebuilt or re-tested from scratch, so what you signed off on in QA is exactly
what goes live.

Since dev and QA share a database, data you create on dev shows up on QA. That
is intentional: it means QA is testing against realistic content rather than an
empty shell.

---

## Copying production data into QA

QA starts empty. To load a snapshot of real production data:

### One-time setup (macOS)

```bash
brew install libpq
echo 'export PATH="/opt/homebrew/opt/libpq/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
pg_dump --version        # should print 16.x or newer
```

(Intel Macs: the path is `/usr/local/opt/libpq/bin`.)

### Run the copy

```bash
cd "~/Documents/Jainam Personal Projects/Martek Group"

./scripts/clone-db.sh \
  "postgresql://…@ep-hidden-dust-auihsu8i-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  "postgresql://…@ep-noisy-rain-aukihy4w-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

First argument is the **source** (production), second is the **target** (QA).
Get both connection strings from Vercel → Storage → the database → `.env.local`
tab → Show secret.

The script refuses to run if the two are the same database, refuses targets that
look like production, and makes you type the target host to confirm. It prints
row counts at the end so you can see it worked.

Re-run it any time you want to refresh QA with current production data — it
replaces the target completely.

> The copy contains real customer leads. QA is publicly reachable, so either
> treat QA access as carefully as production, or delete the leads in the QA
> admin once you have finished testing.

### If you would rather not install anything

Log into qa.marrelay.com/admin and it creates an empty schema plus a fresh admin
user on first boot. You lose the real data but get a clean environment
immediately, which is fine for testing features that do not depend on existing
records.

---

## Analytics: QA and dev get their own

Container IDs come from the database, not from code. Because QA/dev use a
different database, they already read their own tracking configuration.

1. Create a new GTM container and GA4 property for non-production.
2. Enter it at **qa.marrelay.com/admin → Analytics & SEO**.

Production's container is untouched. Every dataLayer event also carries
`environment` (`production` / `qa` / `dev`), so you can add a trigger exception
in production GTM on `environment != "production"` to drop stray hits.

---

## Schema changes

Tables are created idempotently on boot (`ensureDb()` in `lib/admin/db.ts`) and
migrations are `ADD COLUMN IF NOT EXISTS`. A new column appears in each
environment the first time that environment runs the new code. Add migrations to
the `alters` array in that file — never as a manual one-off `ALTER`, or the
environments will drift.

---

## Verifying isolation

1. Open `qa.marrelay.com/admin` — the amber ribbon should read
   `db: ep-noisy-rain-…`, not `ep-hidden-dust-…`. This is the single most
   important check.
2. Submit a test lead on qa.marrelay.com. It must appear in the QA admin and
   **not** in production's.
3. `curl -I https://qa.marrelay.com` → expect `x-robots-tag: noindex, …`
4. `curl https://qa.marrelay.com/robots.txt` → expect `Disallow: /`
5. `curl -I https://www.marrelay.com` → expect **no** `x-robots-tag`, confirming
   production is still fully indexable.

---

## Access

Vercel Authentication is off, so qa/dev are publicly reachable by URL — required
for teammates without Vercel accounts. They are hard-blocked from search engines,
and the admin panel still requires a login. To lock them down again: Settings →
Deployment Protection → Require Log In (note: password protection needs a Pro
plan).

---

## Rollback

Production is unaffected by all of this. To remove the environments: delete the
`qa`/`dev` domains, delete the branch-scoped variables, optionally delete the
branches. Production keeps running throughout.
