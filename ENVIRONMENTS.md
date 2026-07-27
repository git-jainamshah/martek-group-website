# Environments: production, QA, dev

One Vercel project, three branches, **three completely separate databases**.
Nothing crosses between them — the only connection to data is `DATABASE_URL`,
and each environment has its own.

| | Production | QA | DEV |
|---|---|---|---|
| Branch | `main` | `qa` | `dev` |
| URL | www.marrelay.com | qa.marrelay.com | dev.marrelay.com |
| Database | existing Neon | **new, separate** | **new, separate** |
| `NEXT_PUBLIC_APP_ENV` | *(unset)* | `qa` | `dev` |
| Indexed by Google | Yes | **No** | **No** |
| Admin banner | none | amber "QA" | blue "Development" |
| GTM / GA4 | from its own DB | from its own DB | from its own DB |

Everything defaults to production. `NEXT_PUBLIC_APP_ENV` unset = today's exact
behaviour, which is why merging this changed nothing on the live site.

---

## What is already done

- Branches `qa` and `dev` created from `main` (identical code today).
- Environment module `lib/env.ts` — safe default of `production`.
- QA/DEV blocked from search engines three ways: `robots.txt` disallow-all,
  `X-Robots-Tag: noindex` header on every response, and `<meta name="robots">`.
- Admin shows a coloured environment ribbon naming the connected database, and
  the browser tab reads `[QA] Marrelay Admin`.
- `environment` pushed into every dataLayer event (`production` / `qa` / `dev`).
- `scripts/clone-db.sh` — guarded copy of one database into another.
- Old working branch `qa/admin-backend` renamed to `work/admin-backend`
  (git cannot have both `qa` and `qa/...`). It was fully merged; nothing lost.

---

## What you need to do

### 1. Create two Neon databases (5 min)

Vercel dashboard → **Storage** → **Create Database** → Neon. Do this twice:

- name it `marrelay-qa`
- name it `marrelay-dev`

**Important:** when Vercel asks which environments to connect it to, choose
**"Do not connect"** / clear all environments. You will wire the variable up
manually in step 3 — otherwise Vercel may overwrite the production
`DATABASE_URL`, which is the one thing that must not change.

Copy each connection string somewhere safe.

### 2. Copy production data into QA (5 min)

From the repo root, with `pg_dump` v16+ installed:

```bash
./scripts/clone-db.sh "<PRODUCTION_DATABASE_URL>" "<QA_DATABASE_URL>"
```

It refuses to run if the two are the same, refuses targets that look like
production, and asks you to type the target host to confirm. Repeat for dev if
you want dev seeded too (or leave dev empty — it self-creates its schema on
first boot).

> The copy contains real customer data. Treat QA access with the same care as
> production, or clear the leads table there once you have confirmed things work.

### 3. Add branch-scoped environment variables (10 min)

Vercel → project **martek_website** → **Settings → Environment Variables**.

For each variable below: set **Environment = Preview**, then click
**"Specific Git Branch"** and enter the branch name. This is what keeps QA and
DEV values from ever reaching production.

**Branch `qa`:**

| Key | Value |
|---|---|
| `DATABASE_URL` | *(the marrelay-qa connection string)* |
| `NEXT_PUBLIC_APP_ENV` | `qa` |
| `NEXT_PUBLIC_SITE_URL` | `https://qa.marrelay.com` |

**Branch `dev`:**

| Key | Value |
|---|---|
| `DATABASE_URL` | *(the marrelay-dev connection string)* |
| `NEXT_PUBLIC_APP_ENV` | `dev` |
| `NEXT_PUBLIC_SITE_URL` | `https://dev.marrelay.com` |

**Do not touch the existing Production variables.** Production has no
`NEXT_PUBLIC_APP_ENV` and that is deliberate — absent means production.

### 4. Point the subdomains at the branches (10 min)

Vercel → **Settings → Domains** → **Add**:

- add `qa.marrelay.com`, then set **Git Branch = `qa`**
- add `dev.marrelay.com`, then set **Git Branch = `dev`**

Vercel shows the DNS record to create. In your DNS provider add two `CNAME`
records:

```
qa    CNAME  cname.vercel-dns.com
dev   CNAME  cname.vercel-dns.com
```

SSL is issued automatically within a few minutes.

### 5. Turn off deployment protection for those branches (2 min)

Vercel → **Settings → Deployment Protection**. Preview deployments are
password-gated by default. To let your team open qa.marrelay.com directly,
either disable protection for preview deployments or add the two domains to
**Protection Bypass**. Skip this if you would rather keep them gated.

### 6. Give QA its own GTM / GA4 (15 min)

Nothing to configure in code — container IDs come from the database, so QA
already reads whatever its own database says.

1. In Google Tag Manager, create a **new container** for QA.
2. In GA4, create a **new property** (or a new data stream) for QA.
3. Open **qa.marrelay.com/admin → Analytics & SEO** and enter the QA container
   there. It only affects QA.

Production keeps its existing container untouched.

Optionally, in your production GTM add a trigger exception on
`environment != "production"` — the dataLayer now carries that key, so any
stray non-production hit can be dropped.

---

## Daily workflow

```
work/*  ──►  dev  ──►  qa  ──►  main
 build      try it    team     live
            quickly   tests
```

```bash
# start a change
git checkout dev && git pull
# ...edit...
git commit -am "..." && git push          # dev.marrelay.com updates

# promote to QA when it is worth testing
git checkout qa && git pull && git merge dev && git push

# promote to production once QA signs off
git checkout main && git pull && git merge qa && git push
```

Because all three run the same code, a promotion is just a fast-forward merge.

---

## Schema changes

Tables are created idempotently on boot (`ensureDb()` in `lib/admin/db.ts`),
and migrations are `ADD COLUMN IF NOT EXISTS`. So a new column appears in each
environment automatically the first time that environment runs the new code.
Add migrations to the `alters` array in that file, never as a one-off manual
`ALTER` — otherwise environments drift.

---

## Verifying isolation

After setup, confirm the wall holds:

1. Open `qa.marrelay.com/admin` — the amber ribbon should name the **QA**
   database, not the production one. This is the single most important check.
2. Submit a test lead on qa.marrelay.com. It must appear in the QA admin and
   **not** in production's.
3. `curl -I https://qa.marrelay.com` → expect `x-robots-tag: noindex, ...`.
4. `curl https://qa.marrelay.com/robots.txt` → expect `Disallow: /`.
5. `curl -I https://www.marrelay.com` → expect **no** `x-robots-tag` header,
   confirming production is still fully indexable.

---

## Rollback

Nothing here changes production behaviour, so there is nothing to undo. If you
ever want to remove the environments entirely: delete the `qa` and `dev`
domains in Vercel, delete the two branch-scoped variable sets, and optionally
delete the branches. Production is unaffected at every step.
