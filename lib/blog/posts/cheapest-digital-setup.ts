import type { Post } from '../types'

export const cheapestDigitalSetup: Post = {
  slug: 'cheapest-way-to-start-a-business-online',
  title: 'The Cheapest Way to Start a Business Online in 2026 (Real Costs, Nothing Hidden)',
  cardTitle: 'The Cheapest Way to Start a Business Online',
  excerpt:
    'You can be online, taking payments, and looking legitimate for under $100 in your first year. Here is the exact stack, what each piece costs, and the upgrades that are actually worth paying for later.',
  description:
    'A real cost breakdown of the minimum digital setup for a new business in 2026: domain, website, email, payments and analytics, with free and paid options compared.',
  category: 'Starting out',
  date: '2026-07-26',
  readMinutes: 12,
  author: { name: 'Marrelay', role: 'Digital studio, Toronto' },
  tags: ['Startup costs', 'Small business', 'Website cost', 'Free tools', 'Getting started'],
  seedViews: 480,
  blocks: [
    {
      t: 'lead',
      text: 'Most "how to start an online business" articles are affiliate lists that quietly steer you toward the most expensive option. This is the opposite: the genuinely cheapest setup that still looks professional, what each piece actually costs in 2026, and where spending money is worth it. We build these for a living, so we will also tell you when not to hire someone like us.',
    },
    {
      t: 'callout',
      kind: 'note',
      title: 'The short answer',
      text: 'Domain (about $15/year) plus a free website host plus a free email forwarder plus a no-monthly-fee payment link. Total first-year cost: roughly $15 to $95 depending on whether you want a proper business inbox. Everything else can wait until you have customers.',
    },

    { t: 'h2', id: 'what-you-need', text: 'What you actually need (and what you do not)' },
    {
      t: 'p',
      text: 'The single biggest waste of money for new businesses is buying the complete toolkit before having a single customer. Here is the honest split between essential on day one and safely deferred.',
    },
    {
      t: 'table',
      caption: 'Day-one essentials versus things that can wait.',
      head: ['Need it now', 'Can wait', 'Why'],
      rows: [
        ['A domain name', 'Trademark registration', 'The domain is your identity and cheap. Legal protection matters once you have something to protect.'],
        ['A one-page website', 'A ten-page website', 'One clear page that explains what you do and how to contact you outperforms an empty ten-page site.'],
        ['A way to be contacted', 'A CRM', 'An inbox is a CRM until roughly your fiftieth customer.'],
        ['A way to take money', 'A full e-commerce store', 'A payment link works fine until you have real order volume.'],
        ['Basic analytics', 'A dashboard suite', 'You need to know if anyone visits. You do not need cohort analysis yet.'],
        ['One social profile', 'Being on every platform', 'One channel you actually post to beats five abandoned ones.'],
      ],
    },

    { t: 'h2', id: 'domain', text: 'Step 1: The domain (about $15/year)' },
    {
      t: 'p',
      text: 'This is the one thing you should not cheap out on and cannot get free. A custom domain is the difference between looking like a business and looking like a hobby. It is also the only piece here that is genuinely hard to change later, because it is what everything else points at.',
    },
    {
      t: 'ul',
      items: [
        'Expect $10 to $20 per year for a .com. Registrars that charge $2 for year one usually renew at $40 or more, so always check the renewal price, not the promo price.',
        'Buy privacy protection only if it is free (most good registrars include it). It hides your personal address from public records.',
        'Prefer .com if available. Country domains like .ca signal local trust, which helps if you serve one country. Novelty endings look less trustworthy to a first-time visitor.',
        'Keep it short and typo-proof. If you have to spell it out loud on a call, it is too clever.',
      ],
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Do not buy hosting from the domain upsell screen',
      text: 'Registrars make their margin on the add-ons after checkout: hosting, email, site builders, SEO packages. Every one of those has a better and cheaper alternative below. Buy the domain, decline everything else, and leave.',
    },

    { t: 'h2', id: 'website', text: 'Step 2: The website ($0 to start)' },
    {
      t: 'p',
      text: 'You do not need to pay for hosting in 2026. Several excellent platforms host small sites free, including a custom domain and an SSL certificate. Here is the honest comparison.',
    },
    {
      t: 'table',
      caption: 'Website options, cheapest first. Prices are typical 2026 rates and change often, so check before committing.',
      head: ['Option', 'Cost', 'Good for', 'The catch'],
      rows: [
        ['Free static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages)', '$0', 'Fast, simple sites; custom domain and SSL included', 'You need a template or basic technical comfort to deploy'],
        ['Carrd or similar one-pagers', '$0 to $19/yr', 'A single landing page, live in an hour', 'Limited to simple layouts; not built to grow'],
        ['WordPress on cheap hosting', '$3 to $10/mo', 'Blogging, plugins, familiar to many', 'You maintain updates, security, backups; speed suffers if neglected'],
        ['Squarespace / Wix', '$16 to $30/mo', 'Design-led sites with zero technical work', 'Roughly $200 to $360 per year, forever, and you cannot take the site elsewhere'],
        ['Shopify', '$29+/mo', 'Selling physical products at real volume', 'Overkill and expensive until you have consistent orders'],
        ['Custom built', 'One-off project fee', 'When the site is a serious sales channel', 'Not a day-one purchase; earn the revenue first'],
      ],
    },
    {
      t: 'p',
      text: 'Our honest recommendation for month one: a single page on a free host. Not because cheap is virtuous, but because you will learn more from one live page and ten real conversations than from three weeks of building pages nobody has asked for yet.',
    },
    {
      t: 'h3',
      text: 'What that one page must contain',
    },
    {
      t: 'steps',
      items: [
        { title: 'What you do, in plain words', body: 'Above the fold, no jargon. A visitor should know within five seconds whether they are in the right place. "We fix commercial fridges in the GTA" beats "innovative refrigeration solutions".' },
        { title: 'Who it is for', body: 'Naming your customer makes the right person feel understood and saves you from unqualified enquiries.' },
        { title: 'Proof you are real', body: 'A photo of you or your work, a testimonial, a client name, a licence number. New businesses lose deals to doubt, not to price.' },
        { title: 'One obvious next step', body: 'One call to action, repeated. Book a call, request a quote, buy. Two competing buttons halve your conversions.' },
        { title: 'A real way to reach you', body: 'Email and phone visible, not buried in a form. Some buyers will only ever call.' },
      ],
    },

    { t: 'h2', id: 'email', text: 'Step 3: Business email ($0 to $84/year)' },
    {
      t: 'p',
      text: 'Sending quotes from a personal Gmail costs you deals you never hear about. Using your domain (you@yourbusiness.com) is the cheapest credibility upgrade that exists.',
    },
    {
      t: 'table',
      caption: 'Email options for a one-person business.',
      head: ['Option', 'Cost', 'Notes'],
      rows: [
        ['Email forwarding (Cloudflare, ImprovMX)', '$0', 'you@yourdomain.com lands in your normal inbox. Sending as that address takes a little setup, but it works.'],
        ['Zoho Mail free tier', '$0', 'A real mailbox on your domain for a single user. Excellent value at zero.'],
        ['Google Workspace', 'About $84/yr', 'Worth it when you want reliable deliverability, Drive, and calendar in one place.'],
        ['Microsoft 365 Business Basic', 'About $72/yr', 'Same idea; choose it if your clients live in Outlook and Teams.'],
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'The deliverability trap nobody warns you about',
      text: 'If you send email from your domain, set up SPF, DKIM and DMARC records. Without them your quotes land in spam and you will assume clients are ignoring you. Most providers walk you through it in about ten minutes, and it is the difference between being unheard and being read.',
    },

    { t: 'h2', id: 'payments', text: 'Step 4: Taking money ($0 upfront)' },
    {
      t: 'p',
      text: 'You do not need a store or a merchant account. Every major processor now offers no-monthly-fee payment links that work from any device.',
    },
    {
      t: 'ul',
      items: [
        'Stripe Payment Links or PayPal: no monthly fee, roughly 2.9% plus 30 cents per transaction. Create a link, put it in an email or on your page, get paid.',
        'Square: same model, with the advantage of a free card reader if you also sell in person.',
        'Wave or Zoho Invoice: free invoicing with a pay-now button, useful for service businesses that bill after the work.',
        'Do not pay for a subscription billing platform until you actually have subscriptions.',
      ],
    },
    {
      t: 'p',
      text: 'Percentage fees feel expensive but cost nothing when you are not selling, which is exactly the right shape of risk for a new business. Flat monthly platform fees are the opposite.',
    },

    { t: 'h2', id: 'analytics', text: 'Step 5: Knowing if it works ($0)' },
    {
      t: 'p',
      text: 'Flying blind is the most expensive thing on this list. Two free tools tell you almost everything that matters at this stage.',
    },
    {
      t: 'ol',
      items: [
        'Google Search Console: free, and the only place that tells you what people searched before they found you. Verify your domain and submit your sitemap on day one, because it only collects data from the moment you connect it.',
        'Google Analytics 4 (or a lighter privacy-friendly alternative): free, and tells you how many people arrive, from where, and what they do. Set up one conversion event, usually a form submission or a payment.',
      ],
    },
    {
      t: 'callout',
      kind: 'note',
      title: 'Do this even if you ignore the data for months',
      text: 'Analytics cannot report on the past. Connecting these tools on day one costs twenty minutes and gives you a year of history when you finally want to make a decision. Connecting them next year gives you nothing about this year.',
    },

    { t: 'h2', id: 'total', text: 'The total bill' },
    {
      t: 'table',
      caption: 'First-year cost of a complete, professional-looking setup.',
      head: ['Item', 'Cheapest', 'Comfortable'],
      rows: [
        ['Domain', '$15/yr', '$15/yr'],
        ['Website hosting', '$0 (free host)', '$0 to $200/yr'],
        ['Business email', '$0 (forwarding or Zoho)', '$84/yr (Workspace)'],
        ['Payments', '$0 + per-transaction fees', '$0 + fees'],
        ['Analytics', '$0', '$0'],
        ['Logo / brand', '$0 (a clean typeface)', '$50 to $300 one-off'],
        ['TOTAL, YEAR ONE', 'About $15', 'About $100 to $600'],
      ],
    },
    {
      t: 'p',
      text: 'The cheapest column is not a compromise starter kit. Plenty of businesses run on exactly that stack for years, because customers judge you on clarity, responsiveness and proof, not on how much your tooling costs.',
    },

    { t: 'h2', id: 'worth-paying', text: 'When it becomes worth paying for help' },
    {
      t: 'p',
      text: 'We build websites for a living, so treat this as an honest boundary rather than a sales pitch. Do not hire anyone, including us, until at least one of these is true.',
    },
    {
      t: 'ul',
      items: [
        'Your website is now a real sales channel and a better one would measurably earn more than it costs. Ten percent more conversions on meaningful revenue justifies a build; ten percent more on nothing does not.',
        'You are losing hours every week to tools you dislike. Time is the cost most owners forget to count.',
        'You need something genuinely custom: a booking system, a quoting tool, an integration. Templates run out at exactly this point.',
        'You keep hearing the same objection, and it traces back to how your site presents you.',
      ],
    },
    {
      t: 'quote',
      text: 'If you are unsure, stay cheap. The right time to invest in your digital presence is when it is already producing value and you want more of it, not when you are hoping it will conjure value from nothing.',
    },

    { t: 'h2', id: 'mistakes', text: 'Five expensive mistakes we see constantly' },
    {
      t: 'ol',
      items: [
        'Paying monthly for a site builder for years. Thirty dollars a month feels small and totals $1,800 over five years, with nothing you can take with you when you leave.',
        'Buying a ten-page site before knowing what customers ask. You end up rewriting all of it once you learn the real questions.',
        'Skipping the domain to save fifteen dollars. A free subdomain quietly signals "temporary" to every visitor.',
        'Installing analytics a year late. That is a year of decisions made on nothing and a year of history you cannot recover.',
        'Buying tools for a scale you do not have. Marketing automation before an audience, a CRM before customers, an ERP before inventory.',
      ],
    },

    { t: 'h2', id: 'faq', text: 'Questions we get asked' },
    {
      t: 'faq',
      items: [
        {
          q: 'Is a free website host actually safe for a real business?',
          a: 'Yes. Vercel, Netlify and Cloudflare Pages run enormous production workloads and include SSL and a global CDN on their free tiers. The limitation is not reliability, it is that free tiers suit static sites; complex applications and heavy traffic eventually need a paid plan.',
        },
        {
          q: 'Do I need a logo before launching?',
          a: 'No. Your business name set in a good typeface is a perfectly respectable logo and is what many well-known brands effectively use. Spend on identity once you know how you want to be perceived, which usually becomes clear after your first dozen customers.',
        },
        {
          q: 'Should I start with social media instead of a website?',
          a: 'Social is where attention lives, but you do not own it: an algorithm change or a suspended account can erase your reach overnight. Use social to reach people and a site you own to convert them. A domain costs less per year than one boosted post.',
        },
        {
          q: 'How long until this setup brings customers?',
          a: 'Being findable and being visible are different. This setup makes you credible immediately for people you point at it. Organic search traffic realistically takes several months and depends on content and links, which is why your first customers should come from outreach and referrals, not from waiting on Google.',
        },
        {
          q: 'Can I upgrade later without redoing everything?',
          a: 'Yes, provided you own the domain and keep your content somewhere portable. That is the real reason to own your domain from day one: every other piece can be swapped without your customers noticing.',
        },
      ],
    },

    { t: 'h2', id: 'wrap', text: 'The short version' },
    {
      t: 'p',
      text: 'Buy a domain for about fifteen dollars. Put one clear page on a free host. Get email on your domain, free if budget is tight. Take payments with a no-monthly-fee link. Connect Search Console and analytics on day one. Then stop buying things and go find customers, because no tool on this list will do that part for you.',
    },
  ],
}
