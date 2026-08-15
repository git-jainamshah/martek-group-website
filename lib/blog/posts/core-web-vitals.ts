import type { Post } from '../types'

export const coreWebVitals: Post = {
  slug: 'core-web-vitals-for-non-developers',
  title: 'Core Web Vitals for People Who Do Not Write Code',
  cardTitle: 'Core Web Vitals for Non-Developers',
  excerpt:
    'Three numbers decide whether your site feels fast or frustrating, and whether Google quietly ranks you lower. Here is how to read them, find what is broken, and tell someone exactly what to fix.',
  description:
    'A plain-English guide to Core Web Vitals for business owners: what LCP, INP and CLS mean, how to measure yours in five minutes, and the fixes that actually move the numbers.',
  category: 'Performance',
  date: '2026-07-24',
  readMinutes: 9,
  author: { name: 'Marrelay', role: 'Digital studio, Toronto' },
  tags: ['Core Web Vitals', 'Page speed', 'SEO', 'LCP', 'INP', 'CLS'],
  seedViews: 210,
  blocks: [
    {
      t: 'lead',
      text: 'You do not need to understand JavaScript to fix a slow website. You need to know which three numbers Google measures, what makes each one bad, and how to hand a developer a specific instruction instead of "the site feels slow". That is what this guide gives you.',
    },
    {
      t: 'callout',
      kind: 'note',
      title: 'Why this matters commercially',
      text: 'Core Web Vitals are a confirmed Google ranking signal, but the bigger cost is silent: visitors leave sites that feel sluggish before they ever see your offer. Speed is a conversion problem first and an SEO problem second.',
    },

    {
      t: 'brands',
      items: [
        { key: 'search-console', label: 'Search Console' },
        { key: 'ga4', label: 'Google Analytics 4' },
      ],
    },

    { t: 'h2', id: 'the-three', text: 'The three numbers, in plain English' },
    {
      t: 'p',
      text: 'Google measures three things about how your page feels to a real person. Each one maps to a moment of frustration you have experienced yourself.',
    },
    {
      t: 'figure',
      kind: 'cwv-meters',
      caption: 'The three Core Web Vitals and their good / needs-work / poor thresholds.',
    },
    {
      t: 'h3',
      text: 'LCP: how long until the page looks ready',
    },
    {
      t: 'p',
      text: 'Largest Contentful Paint measures when the biggest visible thing (usually your hero image or headline) has finished loading. It is the moment a visitor stops staring at a blank screen. Aim for under 2.5 seconds.',
    },
    {
      t: 'h3',
      text: 'INP: how quickly the page reacts when you tap',
    },
    {
      t: 'p',
      text: 'Interaction to Next Paint measures the delay between clicking something and the page visibly responding. It replaced the older FID metric because it measures every interaction, not just the first. That "did my tap register?" feeling is bad INP. Aim for under 200 milliseconds.',
    },
    {
      t: 'h3',
      text: 'CLS: how much the page jumps around',
    },
    {
      t: 'p',
      text: 'Cumulative Layout Shift measures content moving while you are trying to read or click it. You go to press a button, an ad loads above it, and you press the wrong thing. Aim for under 0.1, which is a unitless score rather than a time.',
    },
    {
      t: 'table',
      caption: 'What counts as good. Google grades you at the 75th percentile of real visits, so your worst quarter of visitors decides your score.',
      head: ['Metric', 'Good', 'Needs work', 'Poor'],
      rows: [
        ['LCP (loading)', 'Under 2.5s', '2.5s to 4.0s', 'Over 4.0s'],
        ['INP (responsiveness)', 'Under 200ms', '200ms to 500ms', 'Over 500ms'],
        ['CLS (visual stability)', 'Under 0.1', '0.1 to 0.25', 'Over 0.25'],
      ],
    },

    { t: 'h2', id: 'measure', text: 'Measure yours in five minutes' },
    {
      t: 'p',
      text: 'There are two kinds of data and confusing them is the most common mistake. Lab data is a simulated test run on demand. Field data is what actually happened to real visitors over the last 28 days. Google ranks on field data. Lab data is for diagnosing.',
    },
    {
      t: 'steps',
      items: [
        {
          title: 'Run PageSpeed Insights',
          body: 'Go to pagespeed.web.dev and enter your URL. The top section, "Discover what your real users are experiencing", is field data. That is your actual score. The section below it is a lab simulation used for diagnosis.',
        },
        {
          title: 'Check Search Console for the full picture',
          body: 'In Google Search Console, open Experience then Core Web Vitals. This groups every page on your site into good, needs improvement, and poor, split by mobile and desktop. It tells you which page templates are the problem, not just one URL.',
        },
        {
          title: 'Test mobile, and be honest about it',
          body: 'Most traffic is mobile and mobile scores are almost always worse. If you only ever check desktop, you are grading yourself on the easy exam.',
        },
      ],
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Ignore the big round score',
      text: 'That 0 to 100 performance number is a weighted lab score. It is useful for tracking progress, but Google does not rank you on it. Chasing 100 while your field LCP is 4 seconds is optimising the wrong thing.',
    },

    { t: 'h2', id: 'fix-lcp', text: 'Fixing slow loading (LCP)' },
    {
      t: 'p',
      text: 'In our experience the cause is almost always one of four things, and the first one accounts for most cases.',
    },
    {
      t: 'ul',
      items: [
        'Enormous hero images. A 4000px, 8MB photo squeezed into a 1200px slot. Resize to the size actually displayed and export as WebP or AVIF. This single fix routinely cuts seconds.',
        'Images loading lazily when they should not. Lazy loading is great below the fold and harmful for the hero, because the browser delays the very thing being measured. The hero image should load eagerly and be marked high priority.',
        'Slow hosting or no caching. If the server takes over half a second to respond before anything downloads, no front-end tweak will save you. Check the "server response time" line in PageSpeed Insights.',
        'Fonts blocking the text. Custom fonts can hide your headline until they download. Using font-display: swap shows text immediately in a fallback, then swaps.',
      ],
    },
    {
      t: 'code',
      lang: 'html',
      caption: 'What a well-behaved hero image looks like in the markup.',
      code: `<!-- Good: sized, eager, prioritised, modern format -->
<img
  src="/hero-1600.webp"
  width="1600" height="900"
  alt="..."
  loading="eager"
  fetchpriority="high"
>

<!-- Bad: unsized (causes CLS) and lazy (delays LCP) -->
<img src="/hero-4000.jpg" alt="..." loading="lazy">`,
    },

    { t: 'h2', id: 'fix-inp', text: 'Fixing sluggish taps (INP)' },
    {
      t: 'p',
      text: 'Poor INP nearly always means too much JavaScript competing for attention. The browser can only do one thing at a time on the main thread, so while a script is busy, your tap waits.',
    },
    {
      t: 'ul',
      items: [
        'Audit your third-party scripts. Chat widgets, heatmaps, A/B testing tools, five different pixels: each one costs responsiveness. Remove anything you have not looked at in three months.',
        'Load non-essential scripts later. A live-chat widget does not need to load before the page is usable. Deferring it changes nothing for visitors and helps the metric a lot.',
        'Beware plugin bloat. On WordPress especially, twenty plugins each adding scripts to every page is a classic INP killer.',
        'Watch heavy animations. Effects that run continuously while scrolling keep the main thread busy at exactly the moment people are trying to interact.',
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'The quickest INP win',
      text: 'List every third-party script on your site and ask, for each one, "what decision did this inform in the last quarter?" Most sites can delete two or three immediately with zero downside.',
    },

    { t: 'h2', id: 'fix-cls', text: 'Fixing jumpy layouts (CLS)' },
    {
      t: 'p',
      text: 'CLS is the easiest of the three to fix and the most annoying to visitors. Every cause comes down to the browser not knowing how much space something will need.',
    },
    {
      t: 'ul',
      items: [
        'Images and videos without width and height attributes. The browser reserves no space, then shoves everything down when the image arrives. Always set dimensions (or a CSS aspect ratio).',
        'Ads, embeds and iframes with no reserved space. Give the container a fixed minimum height so the slot exists before the content arrives.',
        'Banners injected at the top of the page. A cookie notice or promo bar that appears after render pushes the entire page down. Reserve its height, or overlay it instead of inserting it.',
        'Late-loading fonts that change text size. When the fallback font is a different size to the real one, every line reflows. Matching fallback metrics prevents the jump.',
      ],
    },

    { t: 'h2', id: 'brief', text: 'How to brief a developer (copy this)' },
    {
      t: 'p',
      text: 'The difference between a fast fix and a vague back-and-forth is specificity. Rather than "can you make the site faster", send something like this.',
    },
    {
      t: 'quote',
      text: 'Our field data in Search Console shows mobile LCP at 4.1s and CLS at 0.28 across product pages. PageSpeed flags the hero image (3.2MB, lazy-loaded) and the review widget iframe as the main causes. Please resize and convert hero images to WebP with eager loading, and reserve a fixed height for the review widget. Target: LCP under 2.5s, CLS under 0.1 on mobile.',
    },
    {
      t: 'p',
      text: 'That paragraph names the metric, the measured value, the suspected cause, the requested change, and the target. It is the difference between a quote and a guess.',
    },

    { t: 'h2', id: 'faq', text: 'Questions we get asked' },
    {
      t: 'faq',
      items: [
        {
          q: 'How much will fixing this improve my rankings?',
          a: 'Core Web Vitals are a tiebreaker, not a magic lever. If you and a competitor have comparable content and authority, the faster site wins. If their content is far better, speed alone will not overtake them. Fix it for the conversion gain and take the SEO benefit as a bonus.',
        },
        {
          q: 'My score changes every time I test. Why?',
          a: 'You are looking at lab data, which varies with network conditions and server load on each run. Field data updates on a 28-day rolling window, so it moves slowly and steadily. Judge progress on field data, roughly a month after a change ships.',
        },
        {
          q: 'I have almost no traffic, so Search Console shows no data. What now?',
          a: 'Field data needs a minimum volume of real visits. Until you have that, use the lab results in PageSpeed Insights as your guide and fix the obvious offenders (images, scripts, unsized elements). They are the same fixes either way.',
        },
        {
          q: 'Is a page builder like Elementor or Wix hopeless for this?',
          a: 'Not hopeless, but they add overhead you cannot fully remove. You can usually reach "needs improvement" with careful image and plugin discipline. Reaching consistently good on mobile often means a lighter, custom-built front end.',
        },
      ],
    },

    { t: 'h2', id: 'wrap', text: 'The short version' },
    {
      t: 'p',
      text: 'Check your field data in Search Console, not the lab score. Compress and correctly size your hero image to fix LCP. Delete third-party scripts you no longer use to fix INP. Set dimensions on images and reserve space for injected elements to fix CLS. Then re-check in a month, because field data moves slowly.',
    },
    {
      t: 'sources',
      title: 'Measure and read the numbers yourself',
      items: [
        { label: 'PageSpeed Insights', url: 'https://pagespeed.web.dev/', note: 'test any page in about a minute' },
        { label: 'web.dev: Core Web Vitals', url: 'https://web.dev/articles/vitals', note: 'the definitions and thresholds' },
        { label: 'Google Search Console', url: 'https://search.google.com/search-console', note: 'the Core Web Vitals report, on real visitors' },
        { label: 'Chrome UX Report', url: 'https://developer.chrome.com/docs/crux', note: 'the field data Google actually uses' },
      ],
    },

  ],
}
