# Marrelay - SEO Action Plan

## The honest diagnosis

Your site is **not indexed yet** - a search for `site:marrelay.com` returns nothing. That's the entire reason for zero organic traffic, and it is **normal for a brand-new domain**. Nothing is broken in the code: you have a valid robots.txt, sitemap, canonical tags, per-page metadata, Open Graph/Twitter cards, and rich structured data. Google simply hasn't discovered and trusted the site yet.

Ranking is earned in this order: **get indexed → earn local/topical trust → rank**. We can't skip to step 3. Below, the code work is done; the rest is off-page and only you can do it - and it's where the real gains are.

> **Reality check on "#1 in Toronto":** head terms like *"web development Toronto"* are highly competitive and take 6–12+ months plus real backlinks for a new site. Your fast, realistic wins are: **branded search, long-tail queries, and the Google local pack (via Business Profile)**. No one can honestly guarantee #1 - but this plan maximizes how fast and high you climb.

---

## Do these NOW (highest impact)

### 1. Google Search Console - this is the missing step
1. Go to **search.google.com/search-console** → Add property → **Domain** (`marrelay.com`) - the Domain type covers www + non-www + http/https.
2. Verify with a **DNS TXT record** (same place you added the Microsoft 365 record). *Alternatively*, use the HTML-tag method and paste the token into **Admin → Analytics/SEO → Google verification** (the site already wires that tag into `<head>`).
3. **Submit your sitemap:** Sitemaps → enter `sitemap.xml` → Submit. (Full URL: `https://www.marrelay.com/sitemap.xml`.)
4. **Request indexing:** URL Inspection → paste your homepage → "Request indexing." Repeat for `/services/*`, `/case-studies`, `/contact`. This is how a new site gets crawled in days instead of months.
5. Watch the **Pages (Coverage)** report over the next 1–2 weeks to confirm pages get indexed.

### 2. Bing Webmaster Tools
- **bing.com/webmasters** → add the site → "Import from Google Search Console" (one click) → submit the same sitemap. (Bing also feeds ChatGPT/Copilot search.)

### 3. Google Business Profile - the lever for "Toronto"
You're mid-setup; finish it fully - this is what gets you into the **map/local pack**:
- **Primary category:** pick the closest (e.g., "Website designer" or "Marketing agency"); add secondary categories for your other services.
- **Service areas:** Toronto + GTA cities (Mississauga, Markham, Scarborough, Vaughan, etc.).
- Complete **description, hours, phone, website link, services, and photos** (logo, work samples, team).
- **Verify** the profile, then **ask early clients/contacts for reviews** - review count + recency is a top local-ranking factor.

### 4. Add a phone number
Set a business phone in **Admin → Company Profile**. It flows into your schema (`telephone`) and must match your Business Profile exactly (NAP consistency - see below). Right now it's blank, so the schema omits it.

---

## Weeks 1–4 (build trust signals)

- **NAP consistency:** your **N**ame, **A**ddress, **P**hone must be *identical* everywhere - website footer, Business Profile, and every directory. Inconsistency confuses local ranking.
- **Citations / directories** (aim for 8–12): Clutch, GoodFirms, DesignRush, Yelp, YellowPages.ca, Crunchbase, LinkedIn company page, plus Toronto/Ontario business directories.
- **First backlinks:** founder's network, partners/vendors, any client sites ("built by Marrelay"), local chambers of commerce, relevant Slack/Discord/community profiles. A handful of quality links matters far more than dozens of spammy ones.
- **Social profiles:** claim and fill Instagram / LinkedIn / X with the site link (already in your footer + schema `sameAs`).

---

## Ongoing (the compounding game)

- **Content targeting long-tail + local intent.** You have a `/blogs` slot - start publishing 1–2 posts/month answering real buyer questions, e.g.:
  - "How much does a website cost in Toronto (2026)?"
  - "GA4 setup checklist for a small business"
  - "CAD drafting for small manufacturers in Ontario - what to expect"
  - "SEO vs. Google Ads for a Toronto startup"
  Each post should internally link to the relevant `/services/*` page.
- **Get more reviews** steadily on the Business Profile.
- **Earn links** via guest posts, HARO/Qwoted (reporter requests), partnerships, and genuinely useful content people cite.
- **Re-request indexing** in Search Console whenever you publish or substantially update a page.

---

## What I already did in code (done, live)

- **Toronto-optimized titles & descriptions** - homepage now leads with *"Web, Data, SEO & CAD Studio in Toronto"*; every service page is *"[Service] in Toronto"* with a locally-worded description.
- **Local structured data** - `ProfessionalService` schema now includes **GeoCoordinates**, **telephone** (when set), and **areaServed** = Toronto / GTA / Ontario / Canada.
- **BreadcrumbList schema** on all service and case-study pages (better SERP display + crawl understanding), alongside the existing FAQ and CreativeWork schema.
- **Stable sitemap `lastmod`** (was regenerating on every request, which crawlers distrust) and a **web app manifest**.
- Confirmed: `index,follow` everywhere public, admin excluded, canonicals correct, OG/Twitter cards present, SSR-rendered content (fully crawlable).

---

## One-glance checklist

- [ ] Verify domain in **Google Search Console** + submit sitemap + request indexing
- [ ] **Bing Webmaster Tools** (import from GSC) + submit sitemap
- [ ] Finish + verify **Google Business Profile**, add categories, service areas, photos
- [ ] Add a **phone number** in Admin → Company Profile
- [ ] Get the **first 3–5 reviews** on the Business Profile
- [ ] List on **8–12 directories** with identical NAP
- [ ] Start a **monthly blog cadence** on long-tail Toronto topics
- [ ] Re-check the **Coverage report** in 2 weeks to confirm indexing
