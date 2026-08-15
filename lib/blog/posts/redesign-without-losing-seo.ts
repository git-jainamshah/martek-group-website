import type { Post } from '../types'

export const redesignWithoutLosingSeo: Post = {
  slug: 'website-redesign-without-losing-seo',
  title: 'How to Redesign Your Website Without Losing Your Google Rankings',
  cardTitle: 'Redesign Without Losing Your Rankings',
  seoTitle: 'Website Redesign Without Losing Google Rankings',
  excerpt:
    'The traffic drop after a redesign is not bad luck. It is almost always the same handful of mistakes, made in the same order. Here is the checklist that prevents it, and how to tell within a week whether something went wrong.',
  description:
    'A redesign checklist for business owners: build a redirect map, keep the pages that earn traffic, and catch a ranking drop in week one.',
  category: 'Web Development',
  date: '2026-08-14',
  readMinutes: 11,
  author: { name: 'Marrelay', role: 'Digital studio, Toronto' },
  tags: ['Website redesign', 'SEO', '301 redirects', 'Site migration', 'Google Search Console'],
  seedViews: 0,
  blocks: [
    {
      t: 'lead',
      text: 'A redesign is the single most common way a small business loses its search traffic overnight. The design gets signed off, the site goes live, and six weeks later someone notices the phone stopped ringing. The good news: the causes are boring, repeatable, and almost entirely preventable with a day of preparation before launch.',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'The one-sentence version',
      text: 'Google ranks URLs, not websites. If your URLs change and nothing tells Google where they went, you are not redesigning your site - you are launching a new one with no history.',
    },

    {
      t: 'brands',
      items: [
        { key: 'search-console', label: 'Search Console' },
        { key: 'ga4', label: 'Google Analytics 4' },
        { key: 'google', label: 'Google Search' },
      ],
    },

    { t: 'h2', id: 'why-traffic-drops', text: 'Why traffic drops after a redesign' },
    {
      t: 'p',
      text: 'Every page that ranks has earned that position over time: links pointing at it, people clicking it in results, Google building confidence that the URL answers a particular question. None of that is attached to your logo or your layout. It is attached to the address.',
    },
    {
      t: 'p',
      text: 'When /services-web-design becomes /what-we-do/web, Google sees the first address disappear and a brand new one appear. The new address has no history. The old one returns a 404. Whatever the first page had earned is stranded, and the replacement starts from nothing.',
    },
    {
      t: 'ul',
      items: [
        'URLs changed and nothing redirects the old ones (by far the most common)',
        'The staging site was left blocked from search engines, and the block shipped to production',
        'Page titles and headings were rewritten by a designer optimising for looks, not for the query the page ranked for',
        'Text-heavy pages were replaced with image-heavy ones, so the words Google matched on no longer exist',
        'The new site is slower on mobile than the old one',
      ],
    },

    { t: 'h2', id: 'before-you-start', text: 'Before anyone designs anything' },
    {
      t: 'p',
      text: 'The work that protects your rankings happens before the first mockup. You are building an inventory of what you already have, so that nothing valuable gets thrown away by accident.',
    },
    {
      t: 'steps',
      items: [
        {
          title: 'Export every URL you currently have',
          body: 'Pull your sitemap.xml, then cross-check it against Google Search Console (Pages report) and your analytics. Sitemaps are frequently incomplete; Search Console shows what Google has actually indexed, which is what matters.',
        },
        {
          title: 'Mark the pages that earn something',
          body: 'For each URL note its clicks and impressions over the last 12 months, and whether it has ever produced an enquiry. Most sites find that 10-20% of pages produce nearly all the value. Those are the pages you protect.',
        },
        {
          title: 'Note which pages have links pointing at them',
          body: 'A page another site links to carries authority that took years to accumulate and cannot be rebuilt on demand. Losing one of those is far more expensive than losing a page nobody links to.',
        },
        {
          title: 'Record the title and H1 of every page that ranks',
          body: 'You will want these to survive the redesign, even if the visual design around them changes completely.',
        },
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Twelve months, not three',
      text: 'Use a full year of data. Businesses with any seasonality routinely delete pages that look dead in August and carry the whole of December.',
    },

    { t: 'h2', id: 'redirect-map', text: 'The redirect map' },
    {
      t: 'p',
      text: 'This is the single most important artefact of a redesign, and it is a spreadsheet. Two columns: every old URL, and the new URL that best replaces it. Build it before launch, not after.',
    },
    {
      t: 'table',
      head: ['Old URL', 'New URL', 'Redirect type'],
      rows: [
        ['/services-web-design', '/services/web-development', '301 permanent'],
        ['/about-us.html', '/about', '301 permanent'],
        ['/blog/old-post-title', '/blogs/new-post-title', '301 permanent'],
        ['/summer-promo-2024', '/pricing', '301 permanent'],
        ['/tag/uncategorised', '(none - let it 404)', 'None'],
      ],
      caption: 'A redirect map is just this, one row per URL. Every old address needs a decision.',
    },
    {
      t: 'figure',
      kind: 'redirect-map',
      caption: 'The whole idea in one picture: a 301 carries the page\'s history to its new address, a 404 strands it.',
    },
    {
      t: 'p',
      text: 'Use 301 (permanent), not 302 (temporary). A 301 tells Google the move is final and to transfer the page\'s accumulated authority to the new address. A 302 says "check back later", and Google keeps the old URL in its index waiting for a return that never comes.',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Do not redirect everything to the homepage',
      text: 'It is the most common shortcut and the most expensive. Google treats a redirect to an irrelevant page as a soft 404 and passes on none of the value. A visitor who clicked a result about CAD drawings and lands on your homepage simply leaves. Redirect to the closest equivalent page, or let it 404 honestly.',
    },
    {
      t: 'p',
      text: 'Letting a page 404 is a legitimate choice. A 2019 promotion or an empty tag archive should not be kept alive. The rule is simple: if it has traffic or links, redirect it; if it has neither, let it go.',
    },

    { t: 'h2', id: 'keep-the-words', text: 'Keep the words that made the page rank' },
    {
      t: 'p',
      text: 'Redesigns tend to reduce text. Paragraphs become icons, headings become hero images, and a page that ranked for "engineering drawings Toronto" quietly stops containing either phrase in a form Google can read.',
    },
    {
      t: 'ul',
      items: [
        'Keep the H1 close to the original for any page that ranks - the visual style can change completely, the words should not',
        'If a heading must live inside an image, repeat it as real text somewhere on the page',
        'Do not cut a 600-word service page to 80 words because the new layout looks cleaner with less copy',
        'Keep page titles under about 60 characters and lead with the phrase people actually search',
      ],
    },

    { t: 'h2', id: 'launch-day', text: 'Launch day: the checks that take ten minutes' },
    {
      t: 'p',
      text: 'The two failures below account for a large share of post-launch disasters, and both take under a minute to check.',
    },
    {
      t: 'steps',
      items: [
        {
          title: 'Confirm the site is not blocking search engines',
          body: 'Staging sites are usually set to noindex so Google ignores them. If that setting ships to production, your site vanishes from search within days. Visit yoursite.com/robots.txt and confirm it does not say Disallow: / , then view the page source and search for "noindex".',
        },
        {
          title: 'Spot-check your redirects',
          body: 'Take ten old URLs from your map - especially your best-performing pages - and paste each into a browser. Each should land on the right new page, not the homepage and not a 404.',
        },
        {
          title: 'Submit the new sitemap',
          body: 'In Google Search Console, submit your new sitemap.xml. This is how you tell Google to come and look rather than waiting to be found.',
        },
        {
          title: 'Check the mobile page speed',
          body: 'Run the new homepage and one service page through PageSpeed Insights on mobile. A redesign that is prettier and slower is a bad trade - visitors leave before they see the design you paid for.',
        },
      ],
    },
    {
      t: 'callout',
      kind: 'note',
      title: 'Keep analytics continuous',
      text: 'Reuse the same GA4 property rather than creating a fresh one. A new property means your history restarts on launch day, and you lose the before-and-after comparison exactly when you most need it to tell whether the redesign worked.',
    },

    { t: 'h2', id: 'first-month', text: 'The first month: what to watch, and when to worry' },
    {
      t: 'p',
      text: 'A small dip in the first two weeks is normal. Google has to recrawl, follow your redirects, and re-evaluate. What matters is the direction of travel by week three.',
    },
    {
      t: 'figure',
      kind: 'redesign-recovery',
      caption: 'The normal shape of a recovery. A dip in week one is expected; still being down at week four is not.',
    },
    {
      t: 'table',
      head: ['When', 'What to check', 'What is normal'],
      rows: [
        ['Day 1', 'robots.txt, noindex, top-10 redirects', 'Everything correct - these are pass/fail, not judgement calls'],
        ['Week 1', 'Search Console → Pages, for a spike in 404s', 'A few 404s from pages you deliberately retired'],
        ['Week 2', 'Clicks and impressions vs the previous month', 'Down 10-20% and starting to recover'],
        ['Week 4', 'Same comparison', 'Back to roughly where you started'],
        ['Week 8', 'Same comparison', 'At or above the old baseline'],
      ],
      caption: 'If week 4 is still down 40%+, something is structurally wrong. Do not wait it out.',
    },
    {
      t: 'p',
      text: 'The Search Console Pages report is your alarm. A sudden jump in "Not found (404)" means URLs you missed. "Blocked by robots.txt" or "Excluded by noindex tag" on pages that should rank means a staging setting shipped. Both are fixable in an afternoon if you catch them in week one, and expensive if you find them in month three.',
    },

    { t: 'h2', id: 'ask-your-developer', text: 'Five questions to ask whoever builds it' },
    {
      t: 'p',
      text: 'You do not need to do this work yourself. You do need to know whether the person doing it has thought about it. Ask these before signing anything.',
    },
    {
      t: 'ol',
      items: [
        'Are any URLs changing, and if so can I see the redirect map before we launch?',
        'Which existing pages get the most search traffic today, and what happens to each of them?',
        'How will you confirm the staging noindex has been removed on launch day?',
        'Are we keeping the same analytics property, so I can compare before and after?',
        'What are the mobile page speed scores on the new build, compared with the current site?',
      ],
    },
    {
      t: 'p',
      text: 'A studio that answers these quickly has done redesigns before. One that says "SEO is a separate service we can quote for afterwards" is telling you the migration is not in scope - which is fine, as long as you know it before launch rather than after.',
    },

    {
      t: 'faq',
      items: [
        {
          q: 'How long does it take to recover rankings after a redesign?',
          a: 'With redirects done properly, most sites are back to their previous levels within four to eight weeks. Without redirects, recovery can take months and some pages never return, because the links pointing at the old URLs now point at nothing.',
        },
        {
          q: 'Should I keep my old URLs instead of changing them?',
          a: 'If your current URLs are readable and describe the page, keeping them is the safest option and removes an entire category of risk. Only change URLs when there is a real benefit - a clearer structure, or removing something like /index.php?p=42.',
        },
        {
          q: 'Do I need to redirect pages that get no traffic?',
          a: 'Not if they also have no links pointing at them. Check both before deleting: a page with zero visits can still be carrying authority from an old directory listing or news mention.',
        },
        {
          q: 'Will changing my design alone hurt rankings?',
          a: 'No. Google does not rank you on aesthetics. Problems come from what a redesign usually changes alongside the design: URLs, page text, headings, and load speed. Change the look while keeping those four stable and rankings hold.',
        },
        {
          q: 'What if I already relaunched and traffic dropped?',
          a: 'Start with Search Console. Check the Pages report for a 404 spike and for pages excluded by noindex or robots.txt. Then take your top 20 old URLs from before the launch and test each one. Most post-launch drops trace back to one of those two causes and can still be fixed weeks later.',
        },
      ],
    },

    {
      t: 'sources',
      title: 'Primary sources',
      items: [
        { label: 'Google Search Central: Site moves with URL changes', url: 'https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes', note: 'the official migration guidance' },
        { label: 'Google Search Central: Redirects and Google Search', url: 'https://developers.google.com/search/docs/crawling-indexing/301-redirects' },
        { label: 'Google Search Console', url: 'https://search.google.com/search-console', note: 'the Pages report is your post-launch alarm' },
        { label: 'PageSpeed Insights', url: 'https://pagespeed.web.dev/', note: 'check mobile speed before and after' },
      ],
    },

    { t: 'divider' },
    {
      t: 'p',
      text: 'A redesign should be the moment your site starts working harder, not the moment it disappears. The difference is a spreadsheet of redirects and ten minutes of checks on launch day.',
    },
  ],
}
