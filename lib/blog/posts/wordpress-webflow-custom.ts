import type { Post } from '../types'

export const wordpressWebflowCustom: Post = {
  slug: 'wordpress-vs-webflow-vs-custom-built',
  title: 'WordPress, Webflow, or Custom-Built? An Honest Answer for Small Businesses',
  cardTitle: 'WordPress vs Webflow vs Custom',
  excerpt:
    'Most comparisons are written by people who only sell one of the three. Here is what each option actually costs over three years, who each one genuinely suits, and the questions that decide it faster than any feature table.',
  description:
    'A studio-neutral comparison of WordPress, Webflow and custom-built websites for small businesses: real three-year costs, who each suits, and how to decide without a feature checklist.',
  category: 'Web Development',
  date: '2026-08-14',
  readMinutes: 12,
  author: { name: 'Marrelay', role: 'Digital studio, Toronto' },
  tags: ['WordPress', 'Webflow', 'Custom development', 'Website cost', 'CMS'],
  seedViews: 0,
  blocks: [
    {
      t: 'lead',
      text: 'Almost every comparison of these three is written by an agency that builds on exactly one of them. We build custom sites and we also work on WordPress, and there are businesses we actively talk out of a custom build. This is the version of the conversation we have on a first call, written down.',
    },
    {
      t: 'callout',
      kind: 'note',
      title: 'The honest summary',
      text: 'For most small businesses with a marketing site, the platform matters far less than who builds it and whether you can edit it afterwards. A well-built WordPress site beats a badly-built custom one every single time, and costs less.',
    },

    { t: 'h2', id: 'what-you-are-choosing', text: 'What you are actually choosing between' },
    {
      t: 'p',
      text: 'These three are not the same kind of thing, which is why feature tables comparing them tend to mislead.',
    },
    {
      t: 'ul',
      items: [
        'WordPress is software you install on hosting you rent. You own it, you can move it, and you are responsible for keeping it updated.',
        'Webflow is a hosted product. You design in their tool, they host it, and you pay monthly for as long as the site exists.',
        'Custom-built means someone writes the site in code. Nothing is rented, nothing auto-updates, and the result does exactly and only what was specified.',
      ],
    },
    {
      t: 'p',
      text: 'The trade is roughly: WordPress gives you the most flexibility and the most maintenance; Webflow gives you the least maintenance and the least control; custom gives you exactly what you asked for and no path to change it without a developer.',
    },

    {
      t: 'figure',
      kind: 'platform-tradeoff',
      caption: 'The two axes that actually decide it: how much control you keep, and how much maintenance you take on.',
    },

    { t: 'h2', id: 'real-costs', text: 'What each one really costs over three years' },
    {
      t: 'p',
      text: 'Quoted build prices hide the real number. A cheap build with a costly platform can beat an expensive build over three years, or lose badly. Ranges below are indicative for a small business marketing site of roughly 5-15 pages, and vary widely by market and scope.',
    },
    {
      t: 'table',
      head: ['', 'WordPress', 'Webflow', 'Custom-built'],
      rows: [
        ['Typical build', '$2k - $15k', '$3k - $15k', '$10k - $45k'],
        ['Platform / hosting', '$10 - $50 / mo', '$15 - $50+ / mo', '$0 - $20 / mo'],
        ['Ongoing maintenance', 'Updates required', 'Handled for you', 'Rarely needed'],
        ['Who can edit content', 'Anyone, after training', 'Anyone, after training', 'Only if a CMS was built in'],
        ['Cost to leave', 'Low - it is portable', 'High - needs rebuilding', 'Low - you own the code'],
      ],
      caption: 'Indicative ranges for a 5-15 page marketing site. Get quotes; do not budget from a table on the internet.',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'The number nobody quotes you',
      text: 'Ask what it costs to leave. Webflow sites do not transfer to another platform - moving means rebuilding. WordPress and custom code can both be picked up and moved to any host. That is not an argument against Webflow, but it should be a conscious choice rather than a discovery three years later.',
    },

    { t: 'h2', id: 'wordpress', text: 'WordPress: when it is the right answer' },
    {
      t: 'p',
      text: 'WordPress runs a large share of the web for a reason. It is genuinely good at content, the talent pool is enormous, and you are never locked in to one supplier.',
    },
    { t: 'h3', text: 'Choose it if' },
    {
      t: 'ul',
      items: [
        'You publish regularly - blog posts, case studies, news - and want that to be effortless',
        'You want to be able to hire anyone, anywhere, to work on it later',
        'You need a specific integration and would rather not pay to have it built from scratch',
        'Budget matters more than having something visually unlike anything else',
      ],
    },
    { t: 'h3', text: 'Be honest about' },
    {
      t: 'ul',
      items: [
        'It needs maintaining. Core, theme and plugins all update, and an unmaintained WordPress site is the most commonly compromised thing on the web.',
        'Plugins are where sites go wrong. Every one is code from a stranger running on your site; twenty of them is twenty ways to break.',
        'Speed is not automatic. WordPress can be extremely fast, but only if someone is deliberate about it.',
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'The plugin question',
      text: 'Ask any WordPress developer how many plugins their build will use. Under ten suggests someone building deliberately. Thirty-plus suggests a site assembled from parts, and it will be slow and fragile within two years.',
    },

    { t: 'h2', id: 'webflow', text: 'Webflow: when it is the right answer' },
    {
      t: 'p',
      text: 'Webflow removes an entire category of problem. There is nothing to update, nothing to get hacked through an abandoned plugin, and hosting is handled.',
    },
    { t: 'h3', text: 'Choose it if' },
    {
      t: 'ul',
      items: [
        'You want a visually distinctive marketing site and do not want to think about maintenance ever',
        'Your site is mostly pages and a small blog, without complex functionality',
        'You would rather pay predictably every month than deal with an annual maintenance conversation',
        'Nobody on your team wants to be responsible for updates',
      ],
    },
    { t: 'h3', text: 'Be honest about' },
    {
      t: 'ul',
      items: [
        'You are renting. Stop paying and the site goes away - there is no self-hosted fallback.',
        'Costs step up as you grow: more CMS items, more traffic or more editors each push you up a tier.',
        'Editing it well takes real learning. Many businesses end up paying a retainer for changes they assumed they would make themselves.',
        'Complex functionality often means bolting on third-party tools, each with its own monthly fee.',
      ],
    },

    { t: 'h2', id: 'custom', text: 'Custom-built: when it is the right answer (and when it is not)' },
    {
      t: 'p',
      text: 'This is what we do most, so treat what follows with appropriate suspicion - including the part where we tell you when not to buy it.',
    },
    { t: 'h3', text: 'Choose it if' },
    {
      t: 'ul',
      items: [
        'The site has to do something specific - a calculator, a booking flow, a customer portal, an integration with software you already run',
        'Performance is genuinely commercial for you, because you are paying for every click that arrives',
        'You have enough traffic that small conversion differences are worth real money',
        'You need it to do exactly one job perfectly rather than many jobs adequately',
      ],
    },
    { t: 'h3', text: 'Do not choose it if' },
    {
      t: 'ul',
      items: [
        'You need a five-page brochure site - you will pay a premium for flexibility you never use',
        'Nobody has written down what it must do, in which case you are paying a developer to guess',
        'You want to restructure pages yourself every month and no CMS is in the build',
      ],
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'The real risk with custom',
      text: 'It is not cost, it is dependency. A custom site with no CMS and no documentation means every text change goes through whoever built it. Ask two questions before signing: can I edit content without calling you, and do I own the code if we part ways? If either answer is no, the price is higher than the quote.',
    },

    { t: 'h2', id: 'decide-fast', text: 'Five questions that decide it faster than any feature table' },
    {
      t: 'steps',
      items: [
        {
          title: 'How often will the content actually change?',
          body: 'Weekly means you need a genuine CMS and should not consider custom without one. Twice a year means you are over-thinking this and any of the three will do.',
        },
        {
          title: 'Does the site need to DO something, or explain something?',
          body: 'Explaining - any of the three works, pick on budget and maintenance appetite. Doing - calculators, portals, integrations - custom starts earning its price.',
        },
        {
          title: 'Who edits it on a Tuesday afternoon?',
          body: 'If the answer is a non-technical person in your team, that constraint outranks every other consideration on this page.',
        },
        {
          title: 'What happens if you fall out with the builder?',
          body: 'WordPress: hire anyone. Custom with owned code: hire anyone. Webflow: hire a Webflow specialist. Custom with no handover: you are stuck. Ask before, not after.',
        },
        {
          title: 'What is your three-year budget, not your build budget?',
          body: 'Add the build, the monthly platform cost, and a realistic allowance for changes. The cheapest build is regularly the most expensive site.',
        },
      ],
    },

    { t: 'h2', id: 'what-matters-more', text: 'What matters more than the platform' },
    {
      t: 'p',
      text: 'Having built and rescued sites on all three, the platform is rarely what determines whether a site works. These are:',
    },
    {
      t: 'ul',
      items: [
        'Whether it is fast on a mobile phone on a normal connection',
        'Whether it is obvious within five seconds what you do and how to contact you',
        'Whether the person who owns the business can change a price without raising a ticket',
        'Whether analytics were set up properly, so you can tell what is working',
        'Whether someone will still be maintaining it in two years',
      ],
    },
    {
      t: 'quote',
      text: 'A fast, clear WordPress site beats a beautiful custom build nobody can update. We have replaced more of the second than the first.',
    },

    {
      t: 'faq',
      items: [
        {
          q: 'Which is best for SEO?',
          a: 'All three can rank equally well. Google does not know or care what you built with. What it measures - speed, mobile experience, clear structure, useful content - is a function of how carefully the site was built, not the platform.',
        },
        {
          q: 'Is WordPress insecure?',
          a: 'Unmaintained WordPress is insecure. Maintained WordPress with a small number of reputable plugins is fine. The vulnerability is almost always an outdated plugin, not WordPress itself.',
        },
        {
          q: 'Can I move from Webflow to WordPress later?',
          a: 'Your content can be exported, but the site itself cannot be transferred - it has to be rebuilt. Budget for a second build if you think you might move, and factor that into the comparison now.',
        },
        {
          q: 'Is a custom site always faster?',
          a: 'It has the highest ceiling because nothing unnecessary is loaded, but it is not automatic. A carelessly built custom site can easily be slower than a well-built WordPress one. Ask for the mobile PageSpeed score of something they have already shipped.',
        },
        {
          q: 'What about website builders like Wix or Squarespace?',
          a: 'Reasonable for a very small site where budget is the binding constraint and you will build it yourself. The limits appear when you need a specific integration or your content grows past what the templates handle - and like Webflow, leaving means rebuilding.',
        },
      ],
    },

    {
      t: 'sources',
      title: 'Check the current numbers yourself',
      items: [
        { label: 'Webflow pricing', url: 'https://webflow.com/pricing', note: 'site and CMS plan tiers' },
        { label: 'WordPress.org', url: 'https://wordpress.org/', note: 'the self-hosted software' },
        { label: 'PageSpeed Insights', url: 'https://pagespeed.web.dev/', note: 'test any studio\'s existing work before hiring' },
      ],
    },

    { t: 'divider' },
    {
      t: 'p',
      text: 'If you are choosing right now: write down the answers to the five questions above before you talk to anyone. Any studio worth hiring will reach the same recommendation you did - and if they recommend the one thing they happen to sell regardless of your answers, that tells you something too.',
    },
  ],
}
