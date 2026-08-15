import type { Post } from '../types'

export const newWaysToAdvertise: Post = {
  slug: 'new-ways-to-advertise-ai-assistants',
  title: 'New Ways to Advertise: What Changed When AI Assistants Started Selling Ads',
  cardTitle: 'New Ways to Advertise in 2026',
  seoTitle: 'New Ways to Advertise in 2026: ChatGPT Ads Explained',
  excerpt:
    'ChatGPT now sells ads with CPC bidding, a self-serve manager and its own conversion measurement. Here is what is actually available, what it means for a small budget, and how to judge any new ad channel before you fund it.',
  description:
    'What ChatGPT advertising offers in 2026, how buying and measurement work, and how to judge whether a new ad platform deserves your budget.',
  category: 'Advertising',
  date: '2026-08-14',
  readMinutes: 10,
  author: { name: 'Marrelay', role: 'Digital studio, Toronto' },
  tags: ['ChatGPT Ads', 'Advertising', 'CPC', 'Media buying', 'Attribution'],
  seedViews: 0,
  blocks: [
    {
      t: 'lead',
      text: 'For about fifteen years, "running ads" meant Google and Meta, with LinkedIn thrown in if you sold to businesses. That list has just got longer, and it is worth understanding why, because every new channel goes through the same short window where it is cheap and underused before everyone else turns up and it is expensive from then on.',
    },
    {
      t: 'callout',
      kind: 'note',
      title: 'Where this comes from',
      text: 'Everything below about ChatGPT ads comes from OpenAI\'s own announcements and documentation, linked at the end. Nobody has years of performance data on this channel yet, including us, so treat any confident claims about results, including ours, with suspicion.',
    },

    {
      t: 'brands',
      items: [
        { key: 'openai', label: 'ChatGPT Ads' },
        { key: 'google-ads', label: 'Google Ads' },
        { key: 'ga4', label: 'Google Analytics 4' },
      ],
    },

    { t: 'h2', id: 'what-changed', text: 'What actually changed' },
    {
      t: 'p',
      text: 'OpenAI has taken ChatGPT advertising from a closed pilot involving a handful of brands to something a small business can actually buy. Three changes matter.',
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
      t: 'figure',
      kind: 'cpm-vs-cpc',
      caption: 'The change that matters on a small budget: CPM charges at the impression, CPC only once someone arrives.',
    },
    {
      t: 'p',
      text: 'There is also a route through agency partners, among them Dentsu, Omnicom, Publicis and WPP, and through technology partners including Adobe, Criteo, Kargo, Pacvue and StackAdapt. If your media already runs through one of those, the channel may be reachable without opening a single new account.',
    },

    { t: 'h2', id: 'why-different', text: 'Why the context is genuinely different' },
    {
      t: 'p',
      text: 'A search ad catches someone typing three words into a box. An ad inside an assistant catches them halfway through explaining the actual problem in full sentences, usually while weighing up options and working out what to do about it.',
    },
    {
      t: 'p',
      text: 'That is a real difference in intent, and it is the reason OpenAI gives for adding CPC in the first place: in a conversation aimed at making a decision, a click means something rather than being a stray thumb. Whether it converts better than search for your particular business is an empirical question, and nobody can answer it for you yet.',
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
      text: 'A new channel earns a test when most of these come back yes.',
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
      text: 'Every ad platform counts conversions in a way that flatters itself, and every one of them will report a different number from your own analytics. Nobody is being dishonest. Attribution windows differ, time zones and date boundaries differ, deduplication rules differ, and platforms increasingly fold in modelled conversions to cover clicks they could not observe.',
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
      text: 'Being early is not a virtue in itself. Wait if your existing campaigns still have obvious room to improve, if your conversion tracking is not trustworthy yet, if the budget is small enough that splitting it leaves both halves too noisy to read, or if nobody has an hour a week to actually watch the thing. Being second costs very little. Being early and unmeasured costs a great deal.',
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
      text: 'If you want the mechanics rather than the strategy, our [ChatGPT Ads conversion tracking guide](/blogs/chatgpt-ads-conversion-tracking-setup) covers installing the OpenAI Pixel, firing the right events, handling consent and deduplicating browser against server conversions.',
    },
    {
      t: 'sources',
      title: 'Primary sources',
      items: [
        { label: 'OpenAI: New ways to buy ChatGPT ads', url: 'https://openai.com/index/new-ways-to-buy-chatgpt-ads/', note: '5 May 2026 announcement' },
        { label: 'OpenAI: Our approach to advertising', url: 'https://openai.com/index/our-approach-to-advertising-and-expanding-access/', note: 'the stated principles' },
        { label: 'OpenAI Ads', url: 'https://ads.openai.com/', note: 'sign up for an advertiser account' },
        { label: 'OpenAI Help Center: Conversion Measurement', url: 'https://help.openai.com/en/articles/20001409-conversion-measurement' },
      ],
    },
  ],
}
