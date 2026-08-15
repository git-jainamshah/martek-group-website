import type { Post } from '../types'

export const newWaysToAdvertise: Post = {
  slug: 'new-ways-to-advertise-ai-assistants',
  title: 'New Ways to Advertise: What Changed When AI Assistants Started Selling Ads',
  cardTitle: 'New Ways to Advertise in 2026',
  excerpt:
    'ChatGPT now sells ads with CPC bidding, a self-serve manager and its own conversion measurement. Here is what is actually available, what it means for a small budget, and how to judge any new ad channel before you fund it.',
  description:
    'What ChatGPT advertising actually offers in 2026, how buying and measurement work, and a framework for deciding whether a new ad platform deserves your budget.',
  category: 'Advertising',
  date: '2026-08-14',
  readMinutes: 10,
  author: { name: 'Marrelay', role: 'Digital studio, Toronto' },
  tags: ['ChatGPT Ads', 'Advertising', 'CPC', 'Media buying', 'Attribution'],
  seedViews: 0,
  blocks: [
    {
      t: 'lead',
      text: 'For about fifteen years, "running ads" meant Google and Meta, with LinkedIn for B2B. That list has just grown in a way that is worth understanding, because a new channel is briefly cheap before everyone arrives, and expensive forever afterwards.',
    },
    {
      t: 'callout',
      kind: 'note',
      title: 'Where this comes from',
      text: 'Everything below about ChatGPT ads comes from OpenAI\'s own announcements and documentation, linked at the end. Nobody has years of performance data on this channel yet, including us, so treat any confident claims about results, including ours, with suspicion.',
    },

    { t: 'h2', id: 'what-changed', text: 'What actually changed' },
    {
      t: 'p',
      text: 'OpenAI has moved ChatGPT advertising from a closed pilot with a handful of brands into something a small business can buy. Three changes matter.',
    },
    {
      t: 'steps',
      items: [
        {
          title: 'Self-serve buying',
          body: 'A beta Ads Manager lets businesses register, add payment details, set budgets and bids, upload ads and see performance directly, without going through an agency. OpenAI describes it as being for companies of all sizes, from SMBs and startups to global brands, and is opening it gradually.',
        },
        {
          title: 'CPC bidding',
          body: 'The pilot started on a CPM basis, meaning you paid for impressions. Cost-per-click bidding is now available, so you can pay for the click instead. For a small budget that is the difference between buying exposure and buying visits.',
        },
        {
          title: 'Real measurement',
          body: 'A pixel and a Conversions API now exist, so you can see what happened after the click: a purchase, a lead, a signup. Advertisers get aggregated performance data, not access to anyone\'s conversation.',
        },
      ],
    },
    {
      t: 'p',
      text: 'You can also buy through agency partners including Dentsu, Omnicom, Publicis and WPP, and through technology partners including Adobe, Criteo, Kargo, Pacvue and StackAdapt. If you already run media through one of those, the channel may be reachable without any new account at all.',
    },

    { t: 'h2', id: 'why-different', text: 'Why the context is genuinely different' },
    {
      t: 'p',
      text: 'A search ad reaches someone typing three words into a box. An ad in an assistant reaches someone part-way through explaining their problem in full sentences, often comparing options and deciding what to do next.',
    },
    {
      t: 'p',
      text: 'That is a real difference in intent, and it is OpenAI\'s stated reason for adding CPC: in a decision-oriented conversation, a click is a meaningful signal rather than an accident. Whether that converts better than search for your business is an empirical question nobody can answer for you yet.',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'The honest caveat',
      text: 'New channels attract exactly two kinds of coverage: breathless case studies from people selling services, and dismissals from people invested in the old thing. Both are worth ignoring. The only evidence that matters is a small, measured test with your own money and your own conversion data.',
    },

    { t: 'h2', id: 'worth-testing', text: 'Is it worth testing for you?' },
    {
      t: 'p',
      text: 'A new channel is worth a test when the answer to most of these is yes.',
    },
    {
      t: 'table',
      head: ['Question', 'Why it decides the answer'],
      rows: [
        ['Do people research your category in detail before buying?', 'Assistants are used for exploration and comparison. Impulse categories fit less well.'],
        ['Can you measure a conversion properly?', 'Without tracking you are buying clicks and hoping. That is not a test, it is a donation.'],
        ['Can you afford to spend without a return for 4 to 6 weeks?', 'Every new channel costs money to learn. Budget for the learning, not just the clicks.'],
        ['Is your current spend already efficient?', 'If Google and Meta are still improving, that is usually the better next dollar.'],
        ['Do you have a landing page that converts?', 'A new channel does not fix a page that does not work. It just finds you a more expensive way to discover that.'],
      ],
      caption: 'Three or more yes answers make a test reasonable. Fewer, and your money is better spent elsewhere.',
    },

    { t: 'h2', id: 'how-to-test', text: 'How to test a new channel without wasting the budget' },
    {
      t: 'steps',
      items: [
        {
          title: 'Set up measurement before spending a penny',
          body: 'Install the pixel, fire a real conversion event, confirm it appears. Running for two weeks and then discovering nothing was tracked is the most expensive mistake available here, and it is entirely avoidable.',
        },
        {
          title: 'Decide what success is, in advance and in writing',
          body: 'A cost per lead you would be happy with, or a number of enquiries at a price you can defend. Deciding afterwards means you will rationalise whatever happened.',
        },
        {
          title: 'Give it a real but capped budget',
          body: 'Enough to produce a readable result, small enough that being wrong does not matter. If you cannot get roughly 30 to 50 conversions in the window, you will not learn anything statistically useful and should plan on judging directionally.',
        },
        {
          title: 'Change one thing at a time',
          body: 'New channel, new landing page and new offer at once means you learn nothing about any of them.',
        },
        {
          title: 'Set an end date and actually keep it',
          body: 'Write down the date you will decide. Channels quietly bleed money for months precisely because nobody scheduled the decision.',
        },
      ],
    },

    { t: 'h2', id: 'attribution', text: 'Expect the attribution to be messy' },
    {
      t: 'p',
      text: 'Every ad platform counts conversions in its own favour, and every platform will report a different number from your analytics. This is not dishonesty, it is different attribution windows, time zones, deduplication rules and, increasingly, modelled conversions where a click could not be directly observed.',
    },
    {
      t: 'ul',
      items: [
        'Use each platform\'s own reporting to optimise inside that platform, because that is what its bidding runs on',
        'Use your own analytics or CRM to judge total business impact across channels',
        'Watch your total enquiry volume against total spend. If the platform claims 40 conversions and your inbox has not changed, believe the inbox',
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'The cheapest attribution tool you own',
      text: 'Add "How did you hear about us?" to your enquiry form. It is imperfect and people misremember, but when a new channel is genuinely working it shows up there within weeks, and it costs nothing.',
    },

    { t: 'h2', id: 'not-yet', text: 'When to wait instead' },
    {
      t: 'p',
      text: 'Not every business should be early to a channel. Wait if your existing campaigns still have room to improve, if you cannot measure conversions properly yet, if your budget is small enough that splitting it makes both halves unreadable, or if nobody has time to watch a new channel weekly. Being second is cheap. Being early and unmeasured is not.',
    },

    {
      t: 'faq',
      items: [
        {
          q: 'How much should I budget for a first test?',
          a: 'Enough to buy a readable number of conversions at roughly your current cost per acquisition, over four to six weeks. If that number is uncomfortable, the honest answer is to wait rather than to run a test too small to interpret.',
        },
        {
          q: 'Do ads appear inside ChatGPT answers?',
          a: 'OpenAI states that ads are kept separate from ChatGPT\'s answers, that answers remain independent, and that conversations are not shared with advertisers. Advertisers receive aggregated performance data only.',
        },
        {
          q: 'Can I reuse my Google Ads creative?',
          a: 'Use it as a starting point, but expect to rewrite. Copy written to win a three-word search query reads oddly next to a conversational answer. Test a version that speaks to the question someone was actually asking.',
        },
        {
          q: 'Is this replacing Google Ads?',
          a: 'No, and anyone saying so is selling something. It is an additional place to reach people who are actively deciding. Treat it as a test alongside what already works, funded from a test budget rather than by cutting a channel that is performing.',
        },
        {
          q: 'What is the single biggest mistake to avoid?',
          a: 'Spending before measurement works. Every other mistake here is recoverable and teaches you something. That one produces a bill and no information.',
        },
      ],
    },

    { t: 'divider' },
    {
      t: 'p',
      text: 'If you want the mechanics rather than the strategy, our companion guide walks through installing the OpenAI Pixel, firing the right events, handling consent, and deduplicating browser and server conversions.',
    },
    {
      t: 'p',
      text: 'Sources: OpenAI, "New ways to buy ChatGPT ads" (5 May 2026); OpenAI Help Center, "Conversion Measurement"; OpenAI Developers, "Measurement Pixel" and "Conversions API".',
    },
  ],
}
