# Getting Marrelay pages indexed (Search Console guide)

Short answer to "do I need to update GSC?": **yes, twice now, then almost never again.**
Your sitemap updates itself, but new pages still get found faster if you nudge Google once.

---

## Do this once (10 minutes, today)

### 1. Submit the sitemap

Search Console → **Indexing → Sitemaps** → enter `sitemap.xml` → Submit.

Your sitemap is generated automatically and already contains all 5 blog posts plus every
public page. You only submit the sitemap **once ever**. After that, Google re-reads it on its
own schedule and picks up new posts automatically.

Check back in a day: status should read "Success" with ~20 discovered URLs.

### 2. Request indexing for the 5 new blog URLs

Search Console → paste the URL in the **search bar at the very top** → wait for the check →
click **Request indexing**.

Do this for each:

```
https://www.marrelay.com/blogs
https://www.marrelay.com/blogs/cheapest-way-to-start-a-business-online
https://www.marrelay.com/blogs/how-much-does-a-small-business-website-cost
https://www.marrelay.com/blogs/google-consent-mode-v2-in-3-steps
https://www.marrelay.com/blogs/core-web-vitals-for-non-developers
https://www.marrelay.com/blogs/dwg-vs-step-vs-stl-cad-file-formats-explained
```

There's a daily quota (~10-12 requests), so this fits comfortably in one sitting.

**What to expect:** "URL is not on Google" before you request — that's normal for brand-new
pages. Indexing takes anywhere from a few hours to two weeks. Requesting again doesn't speed
it up, so do it once and leave it.

### 3. Re-submit the sitemap once (optional but helps)

Because canonical tags changed on `/pricing`, `/privacy`, `/terms` and `/services`, hit the
sitemap row's "..." menu and re-submit. This tells Google those pages changed.

---

## Every time you publish a new post

1. Publish (deploy).
2. Search Console → top search bar → paste the new URL → **Request indexing**.
3. That's it. No sitemap action needed — it regenerates automatically.

Optional but effective: share the URL on LinkedIn the same day. External links are one of the
fastest ways Google discovers a page.

---

## What was already handled for you (no action needed)

| Thing | Status |
|---|---|
| `sitemap.xml` includes all blog posts | Automatic, regenerates each deploy |
| `robots.txt` allows crawling, points to sitemap | Done |
| Canonical URL on every page | Fixed — `/pricing` etc. used to point at the homepage |
| Unique title + meta description per post | Done, all follow `Marrelay - <Title>` |
| Article schema (rich results) | Done |
| FAQPage schema (can win FAQ rich snippets) | Done on all 5 posts |
| BreadcrumbList schema (Home > Blog > Post in results) | Done |
| Open Graph tags (link previews on LinkedIn/X) | Done |
| Thin `/abstracts` page excluded from index | Set to noindex |
| Blog posts pre-rendered as static HTML | Yes — fast, fully crawlable |
| Internal links to each post (nav, footer, homepage, related) | Done |

---

## Checks worth running (5 minutes each, once)

**Rich Results Test** — https://search.google.com/test/rich-results
Paste any blog URL. Should detect Article, FAQ and Breadcrumbs. This confirms you're eligible
for enhanced search listings.

**Mobile usability / PageSpeed** — https://pagespeed.web.dev
Paste the homepage and one blog post. Field data will be empty until you have traffic; that's
expected on a new site.

---

## What to watch in Search Console over the next 90 days

| When | Where | What good looks like |
|---|---|---|
| Week 1-2 | Indexing → Pages | Blog URLs move from "Discovered" to "Indexed" |
| Week 2-4 | Performance → Queries | First non-brand queries appear (not just "marrelay") |
| Month 2-3 | Performance → Pages | Blog posts start collecting impressions |
| Month 3+ | Performance | Impressions climbing; clicks follow impressions |

**Important:** impressions come before clicks. Seeing impressions with 0 clicks isn't failure,
it means you're ranking on page 3-5 and climbing. Clicks arrive as you reach the top 10.

---

## The honest expectation

New domain + new pages = slow start. The posts are technically perfect for SEO now, but
technical SEO only makes you *eligible* to rank. What actually lifts you into the top 10 is
**backlinks and time**. That's why the directory list in `Marrelay_SEO_Growth_Kit.xlsx`
matters as much as the articles themselves.

Publish consistently, get listed on the directories, share each post on LinkedIn. Compounding
starts around month 3.
