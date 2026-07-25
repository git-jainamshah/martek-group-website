import type { Post } from '../types'

export const websiteCostComparison: Post = {
  slug: 'how-much-does-a-small-business-website-cost',
  title: 'How Much Does a Small Business Website Really Cost? (DIY vs Freelancer vs Agency)',
  cardTitle: 'What a Small Business Website Really Costs',
  excerpt:
    'Quotes for the same website range from $0 to $50,000, which makes them useless without context. Here is what each route actually costs over five years, including the fees nobody quotes you.',
  description:
    'Real 2026 costs for a small business website compared across DIY builders, freelancers and agencies, including five-year totals and the hidden fees most quotes leave out.',
  category: 'Buying guide',
  date: '2026-07-26',
  readMinutes: 13,
  author: { name: 'Marrelay', role: 'Digital studio, Toronto' },
  tags: ['Website cost', 'Hiring', 'Freelancer vs agency', 'Budgeting', 'Small business'],
  seedViews: 410,
  blocks: [
    {
      t: 'lead',
      text: 'Ask five people what a website costs and you will hear zero, five hundred, five thousand and fifty thousand dollars, all describing something they call "a website". None of them are lying. They are describing different things. This guide gives you the real numbers for each route, the five-year total rather than the sticker price, and a straight answer on which one fits your situation.',
    },
    {
      t: 'callout',
      kind: 'note',
      title: 'We build websites for a living',
      text: 'So read this with appropriate suspicion. We have tried to write the guide we would want a friend to read, including the parts where the answer is "do not hire anyone yet". If you only take one thing from it, make it the five-year table.',
    },

    { t: 'h2', id: 'why-range', text: 'Why the price range is so absurd' },
    {
      t: 'p',
      text: 'The word "website" covers a business card and a sales engine equally. Four things drive nearly all the price difference.',
    },
    {
      t: 'ul',
      items: [
        'Pages and complexity. A one-page site is a weekend. A site with booking, payments, logins and integrations is a software project.',
        'Who does the thinking. A template asks you to decide the words, structure and strategy. A professional charges partly for making those decisions correctly.',
        'Design originality. Template-based work is fast and cheap. Custom design is slower and priced accordingly.',
        'Who carries the risk. A freelancer disappearing mid-project is your problem. Part of an agency fee buys continuity and accountability.',
      ],
    },

    { t: 'h2', id: 'diy', text: 'Option 1: DIY builders ($0 to $400/year)' },
    {
      t: 'p',
      text: 'Wix, Squarespace, Shopify, WordPress with a template. You do the work; the platform provides the tools.',
    },
    {
      t: 'table',
      head: ['', 'Typical cost', 'Reality'],
      rows: [
        ['Platform subscription', '$16 to $30/mo', 'Forever, and it rises. Cancel and the site goes away.'],
        ['Premium template', '$0 to $200 one-off', 'Optional; free ones are usually fine.'],
        ['Your time', '20 to 60 hours', 'The real cost. At any sensible hourly value this dwarfs the subscription.'],
        ['Five-year total', 'About $1,000 to $2,000', 'Plus 20 to 60 hours you will not get back.'],
      ],
    },
    {
      t: 'p',
      text: 'DIY is genuinely the right answer when you are pre-revenue, testing an idea, or your customers will never judge you on your website. It is the wrong answer when the site is your main sales channel, because the ceiling on quality and speed is low and you cannot take the site with you.',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'The lock-in nobody mentions at signup',
      text: 'Site builders do not let you export a working site. Leaving means rebuilding from scratch. Your content and your domain are portable; the site itself is not. Factor that into any multi-year decision.',
    },

    { t: 'h2', id: 'freelancer', text: 'Option 2: A freelancer ($800 to $8,000)' },
    {
      t: 'p',
      text: 'One person builds it for you. Enormously variable in quality, and the single most common route for small businesses.',
    },
    {
      t: 'table',
      head: ['Tier', 'Typical price', 'What you get'],
      rows: [
        ['Marketplace (Fiverr, Upwork budget end)', '$150 to $800', 'A template filled in with your text. Sometimes fine, often a rebuild waiting to happen.'],
        ['Experienced freelancer', '$1,500 to $5,000', 'Proper discovery, custom design on a solid platform, decent performance and SEO basics.'],
        ['Specialist / senior', '$5,000 to $15,000', 'Strategy, custom build, integrations, measurement, ongoing support.'],
      ],
    },
    {
      t: 'p',
      text: 'The variance here is brutal, so the selection process matters more than the price. Ask for three live sites they built, then run those URLs through PageSpeed Insights yourself. If their own portfolio sites are slow, yours will be too.',
    },
    {
      t: 'ul',
      items: [
        'Ask who owns the code and accounts at the end. The answer must be you.',
        'Ask what happens if you need a change in six months, and what that costs.',
        'Ask whether the price includes content and images, because it usually does not and that gap is where projects stall.',
        'Be wary of anyone who quotes before asking what the site is for.',
      ],
    },

    { t: 'h2', id: 'agency', text: 'Option 3: An agency or studio ($5,000 to $50,000+)' },
    {
      t: 'p',
      text: 'A team: strategy, design, build, testing, sometimes content and ongoing marketing. Price scales with the size of the team and the ambition of the project.',
    },
    {
      t: 'table',
      head: ['Type', 'Typical project', 'Best for'],
      rows: [
        ['Small studio (2 to 8 people)', '$5,000 to $25,000', 'Serious small and mid-size business sites; senior attention without corporate overhead'],
        ['Mid-size agency', '$25,000 to $100,000', 'Multi-stakeholder projects, brand work, complex integrations'],
        ['Large agency', '$100,000+', 'Enterprise, compliance-heavy, multi-market'],
      ],
    },
    {
      t: 'p',
      text: 'You are buying reliability and breadth: someone is accountable, work does not stop when one person is ill, and specialists handle design, build and measurement. You are also paying for overhead, which is why a small studio often lands in the sweet spot for an SMB.',
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Fixed price beats hourly for you',
      text: 'Hourly puts every scope discussion on your bill and every risk on your side. A fixed-price quote against a written scope moves the estimation risk to the person best placed to manage it. If a supplier will not quote fixed, it usually means they cannot predict their own process.',
    },

    { t: 'h2', id: 'hidden', text: 'The costs nobody puts in the quote' },
    {
      t: 'p',
      text: 'This is where budgets actually break. Every route carries these, and they are routinely omitted from the headline number.',
    },
    {
      t: 'table',
      caption: 'Recurring and easily forgotten costs.',
      head: ['Item', 'Typical cost', 'Notes'],
      rows: [
        ['Domain', '$15/yr', 'Non-negotiable, cheap, must be in your name'],
        ['Hosting', '$0 to $50/mo', 'Free tiers are genuinely fine for most brochure sites'],
        ['SSL certificate', '$0', 'Free everywhere now. Being charged for it is a red flag'],
        ['Content and copywriting', '$0 to $3,000', 'The most common cause of a stalled project'],
        ['Photography', '$0 to $2,000', 'Stock photos are free-ish and look it'],
        ['Maintenance and updates', '$0 to $200/mo', 'WordPress needs this. Static sites barely do'],
        ['Changes after launch', '$75 to $200/hr', 'Ask about this before signing, not after'],
        ['Email hosting', '$0 to $84/yr', 'Separate from the website'],
      ],
    },

    { t: 'h2', id: 'five-year', text: 'The five-year comparison that actually matters' },
    {
      t: 'p',
      text: 'Compare like for like: a small business site, roughly five to ten pages, contact form, decent design. Sticker prices mislead because subscriptions never stop and one-off builds do.',
    },
    {
      t: 'table',
      caption: 'Approximate five-year totals, including hosting and typical maintenance.',
      head: ['Route', 'Up front', 'Ongoing', '5-year total'],
      rows: [
        ['DIY on Squarespace', '$0', 'About $300/yr', 'About $1,500 + your 40 hours'],
        ['Budget marketplace freelancer', 'About $500', 'About $200/yr', 'About $1,500 (often plus a rebuild)'],
        ['Experienced freelancer', 'About $3,000', 'About $200/yr', 'About $4,000'],
        ['Small studio, fixed price', 'About $8,000', 'About $200/yr', 'About $9,000'],
        ['Mid-size agency', 'About $30,000', 'About $2,400/yr', 'About $42,000'],
      ],
    },
    {
      t: 'p',
      text: 'The interesting line is the budget freelancer. It looks cheapest and frequently is not, because a meaningful share of those projects get rebuilt within two years. A rebuild means paying twice and losing the time between.',
    },

    { t: 'h2', id: 'which', text: 'So which should you choose?' },
    {
      t: 'steps',
      items: [
        { title: 'Choose DIY if', body: 'You are pre-revenue or testing, your customers do not judge you on your site, and you have more time than money. Spend nothing, learn what customers actually ask, then decide.' },
        { title: 'Choose a freelancer if', body: 'You have some revenue, you need something credible and custom-ish, and your requirements are clear enough to write down. Vet hard, insist on ownership, and expect to supply the content.' },
        { title: 'Choose a small studio if', body: 'The website meaningfully drives revenue, you need design plus build plus measurement handled together, and you want one accountable party. This is the usual fit for an established SMB.' },
        { title: 'Choose a large agency if', body: 'You have multiple stakeholders, brand requirements, compliance obligations, or genuine scale. If you are not sure you need this, you do not.' },
      ],
    },
    {
      t: 'quote',
      text: 'The right budget is the one where a modest improvement in results pays it back within a year. If your site drives $10,000 of business annually, a $30,000 build is not ambitious, it is a mistake. If it drives $500,000, spending $3,000 is leaving money on the table.',
    },

    { t: 'h2', id: 'faq', text: 'Questions we get asked' },
    {
      t: 'faq',
      items: [
        {
          q: 'Why did one quote come in at $2,000 and another at $20,000 for the same brief?',
          a: 'Usually because they are quoting different work. The cheap quote is often a template populated with your content; the expensive one includes discovery, custom design, content help, integrations and testing. Ask each to itemise deliverables and the gap explains itself. If it does not, the expensive one may simply be overhead.',
        },
        {
          q: 'Is WordPress cheaper than a custom build?',
          a: 'Cheaper to start, rarely cheaper over five years once you count plugin licences, maintenance, security and the performance work needed to keep it fast. It is a good fit when you need heavy content management or specific plugin ecosystems.',
        },
        {
          q: 'Should I pay monthly for a "website subscription" service?',
          a: 'Occasionally, if it genuinely includes ongoing changes and hosting and you value never thinking about it. But do the arithmetic over five years and check whether you own anything at the end. Most of these total more than a fixed-price build and leave you with nothing transferable.',
        },
        {
          q: 'How long should it take?',
          a: 'A one-pager is days. A five to ten page small business site is typically two to six weeks. Anything quoted at "a few days" for a full site is a template swap; anything quoted at six months for a brochure site has a process problem. Delays are usually caused by content, not code.',
        },
        {
          q: 'What should I insist on in the contract?',
          a: 'Ownership of code, design files and all accounts; a written scope with deliverables; a fixed price or a capped estimate; a defined post-launch fix period; and the hourly rate for future changes. Those five lines prevent most disputes.',
        },
      ],
    },

    { t: 'h2', id: 'wrap', text: 'The short version' },
    {
      t: 'p',
      text: 'DIY costs about $1,500 over five years plus dozens of your hours. A good freelancer lands near $4,000. A small studio lands near $9,000 and adds strategy and accountability. Ignore sticker prices, compare five-year totals, insist on owning everything, and pick the tier where a modest lift in results pays the cost back inside a year.',
    },
  ],
}
