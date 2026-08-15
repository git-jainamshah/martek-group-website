import type { Post } from '../types'

export const chatgptAdsTracking: Post = {
  slug: 'chatgpt-ads-conversion-tracking-setup',
  title: 'ChatGPT Ads Conversion Tracking: A Practical Setup Guide',
  cardTitle: 'ChatGPT Ads Conversion Tracking',
  excerpt:
    'The OpenAI Pixel, the oppref click reference, consent, and the deduplication step most people miss. A working setup in under an hour, written from the official documentation rather than guesswork.',
  description:
    'Step-by-step setup for ChatGPT Ads conversion tracking: install the OpenAI Pixel, fire standard events, handle consent and CSP, and deduplicate browser and server events.',
  category: 'Analytics',
  date: '2026-08-14',
  readMinutes: 13,
  author: { name: 'Marrelay', role: 'Digital studio, Toronto' },
  tags: ['ChatGPT Ads', 'OpenAI Pixel', 'Conversion tracking', 'oaiq', 'Conversions API', 'Measurement'],
  seedViews: 0,
  blocks: [
    {
      t: 'lead',
      text: 'ChatGPT ads are new enough that most agencies have not set the measurement up yet, and old enough that you can no longer run them blind. This is the setup, in order, with the parts that are easy to get wrong called out. Everything here comes from OpenAI\'s own developer documentation, not from reverse engineering.',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Time-sensitive: 17 August 2026',
      text: 'Automatic advanced matching is already the default for new web pixels. On 17 August 2026 OpenAI also enables it for existing web pixels. If you have a pixel installed and have not reviewed what that means for your consent setup, look at it before that date rather than after.',
    },

    { t: 'h2', id: 'what-you-need', text: 'What you need before you start' },
    {
      t: 'ul',
      items: [
        'A ChatGPT Ads account with access to Ads Manager',
        'A Pixel ID, created in the conversions tab of Ads Manager',
        'Access to edit the <head> of your site, or a tag manager that can inject into it',
        'A clear list of which actions on your site count as a conversion',
      ],
    },
    {
      t: 'p',
      text: 'That last one takes five minutes and saves hours. Write down the two or three actions that actually matter (a form submission, a booking, a purchase) before touching any code. Sites that skip this end up measuring page views and calling it conversion tracking.',
    },

    { t: 'h2', id: 'how-it-connects', text: 'How a click becomes a conversion' },
    {
      t: 'p',
      text: 'Understanding the chain makes every later step obvious, and explains why the common mistakes break things.',
    },
    {
      t: 'figure',
      kind: 'oai-measure-flow',
      caption: 'The chain: a click adds oppref to your URL, the Pixel stores it, and later events are matched back to the ad.',
    },
    {
      t: 'p',
      text: 'When someone clicks your ad, OpenAI appends a click reference called oppref to your landing page URL. The Pixel reads it and stores it in a first-party cookie named __oppref, so a conversion that happens three pages later can still be tied back to the click that caused it.',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'The most common way this breaks',
      text: 'Anything that strips query parameters kills attribution. Redirects that drop the query string, a homepage that bounces visitors to a locale path, an aggressive cache rule, or a consent tool that reloads the page without its parameters. If oppref does not survive to the page where the Pixel runs, the conversion cannot be matched to the click.',
    },

    { t: 'h2', id: 'install', text: 'Step 1: install the Pixel' },
    {
      t: 'p',
      text: 'Add this near the top of the <head> on every page where a conversion could happen. Near the top matters: put it below a slow third-party script and you will lose conversions that fire before it loads.',
    },
    {
      t: 'code',
      lang: 'html',
      caption: 'The installation snippet. Replace <YOUR-PIXEL-ID> with the ID from the conversions tab in Ads Manager.',
      code: `<script>
  (function (w, d, s, u) {
    if (w.oaiq) return;
    var q = function () { q.q.push(arguments); };
    q.q = [];
    w.oaiq = q;
    var js = d.createElement(s);
    js.async = true;
    js.src = u;
    var f = d.getElementsByTagName(s)[0];
    f.parentNode.insertBefore(js, f);
  })(window, document, "script", "https://bzrcdn.openai.com/sdk/oaiq.min.js");

  oaiq("init", {
    pixelId: "<YOUR-PIXEL-ID>",
    debug: true
  });
</script>`,
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Leave debug on while you test',
      text: 'debug: true logs Pixel activity to the browser console so you can watch events fire as you click through the site. Remove it before you finish, or you will ship console noise to every visitor.',
    },

    { t: 'h2', id: 'consent', text: 'Step 2: handle consent, before init' },
    {
      t: 'p',
      text: 'If you operate anywhere that requires consent for measurement, this step is not optional and the order matters. The Pixel defaults consent to true, so if you do nothing it will start measuring immediately.',
    },
    {
      t: 'code',
      lang: 'js',
      caption: 'Set consent to false before init, then grant it when the visitor accepts.',
      code: `oaiq("consent", false);

oaiq("init", {
  pixelId: "<YOUR-PIXEL-ID>",
});

// Call this only after the visitor grants measurement consent.
oaiq("consent", true);`,
    },
    {
      t: 'p',
      text: 'While consent is false the Pixel sends nothing. Granting consent later allows future events, but blocked events are not replayed, so anything that happened before the visitor accepted is gone. That is the correct behaviour, and it is worth knowing so the numbers do not surprise you.',
    },

    { t: 'h2', id: 'events', text: 'Step 3: fire the events that matter' },
    {
      t: 'p',
      text: 'Use a standard event whenever one describes what happened. Standard events are understood by the optimisation system; custom events are not treated the same way, so reach for them only when nothing fits.',
    },
    {
      t: 'table',
      head: ['If your conversion is', 'Use this event', 'With data type'],
      rows: [
        ['A form or enquiry', 'lead_created', 'customer_action'],
        ['An account signup', 'registration_completed', 'customer_action'],
        ['A booking', 'appointment_scheduled', 'customer_action'],
        ['A purchase', 'order_created', 'contents'],
        ['Add to cart', 'items_added', 'contents'],
        ['Checkout begun', 'checkout_started', 'contents'],
        ['A paid subscription', 'subscription_created', 'plan_enrollment'],
        ['A free trial', 'trial_started', 'plan_enrollment'],
      ],
      caption: 'The event name says what happened; the data type selects the shape of the object you send with it.',
    },
    {
      t: 'code',
      lang: 'js',
      caption: 'A lead, and a purchase. Amounts are integers in the smallest currency unit, so 2599 means $25.99.',
      code: `// Service business: fire on the thank-you page or after a successful AJAX submit
oaiq("measure", "lead_created", {
  type: "customer_action"
});

// Ecommerce: fire on the order confirmation page
oaiq("measure", "order_created", {
  type: "contents",
  amount: 2599,
  currency: "USD",
  contents: [
    { id: "sku_123", name: "Starter bundle", content_type: "product", quantity: 1 }
  ]
});`,
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Amounts are integers, not decimals',
      text: 'Send 2599 for $25.99. Sending 25.99 is the single most common data error in any pixel implementation, and it quietly distorts every revenue figure you later report on.',
    },
    {
      t: 'p',
      text: 'If nothing standard fits, a custom event needs three things lined up: the literal string "custom" as the event name, a data object of type "custom", and a custom_event_name in the options.',
    },
    {
      t: 'code',
      lang: 'js',
      caption: 'The smallest valid custom event.',
      code: `oaiq(
  "measure",
  "custom",
  { type: "custom" },
  { custom_event_name: "quote_requested" }
);`,
    },

    { t: 'h2', id: 'dedup', text: 'Step 4: deduplicate, if you also send server-side' },
    {
      t: 'p',
      text: 'Running the Pixel and the Conversions API together is more resilient than either alone, because browser events are lost to ad blockers and network failures while server events are not. But send the same purchase twice without telling OpenAI they are the same and you will report double the revenue.',
    },
    {
      t: 'code',
      lang: 'js',
      caption: 'The same event_id on both sides is what makes deduplication work.',
      code: `oaiq(
  "measure",
  "order_created",
  { type: "contents", amount: 2599, currency: "USD" },
  { event_id: "order_12345" }   // send this exact id from your server too
);`,
    },
    {
      t: 'p',
      text: 'Use something you already have and that is genuinely unique, such as the order ID. Matching is done on your Pixel ID, the event name and the event_id, so all three have to line up. For custom events the custom_event_name must match on both sides as well.',
    },
    {
      t: 'callout',
      kind: 'note',
      title: 'Do not call the Conversions API from the browser',
      text: 'The server API is for your server. Calling it from page code exposes credentials and is explicitly warned against in the documentation. Browser events go through the Pixel; server events go through the API.',
    },

    { t: 'h2', id: 'csp', text: 'Step 5: content security policy, if you have one' },
    {
      t: 'p',
      text: 'If your site sets a CSP, the Pixel will silently fail until you allow its domains. This is a common cause of "I installed it and nothing happened".',
    },
    {
      t: 'table',
      head: ['Directive', 'Add this source', 'Why'],
      rows: [
        ['script-src', 'https://bzrcdn.openai.com', 'Load the Pixel SDK'],
        ['connect-src', 'https://bzr.openai.com', 'Send events'],
        ['connect-src', 'https://bzrcdn.openai.com', 'Fetch pixel configuration'],
        ['img-src', 'https://bzr.openai.com', 'Image-request fallback'],
      ],
      caption: 'Use a nonce or hash for the inline snippet. Do not add unsafe-inline just for this.',
    },

    { t: 'h2', id: 'verify', text: 'Step 6: verify it actually works' },
    {
      t: 'steps',
      items: [
        {
          title: 'Load a page with ?oppref=test appended',
          body: 'Open the browser console with debug on and confirm the Pixel initialises and fires page_viewed. Then check that a __oppref cookie has been set on your domain.',
        },
        {
          title: 'Complete a real conversion',
          body: 'Submit the form or place a test order and watch the console for the measure call. Confirm the event name and the amount are what you expect.',
        },
        {
          title: 'Navigate first, then convert',
          body: 'Land on the site, browse two or three pages, then convert. This is the test that catches a lost oppref, and it is the one people skip.',
        },
        {
          title: 'Check Ads Manager the next day',
          body: 'Conversions are not instant. Give it a day before concluding something is broken.',
        },
      ],
    },

    { t: 'h2', id: 'numbers-differ', text: 'Why your numbers will not match GA4' },
    {
      t: 'p',
      text: 'They will differ, and that is expected rather than a bug. Attribution windows differ, time zones and date boundaries differ, deduplication behaves differently, and OpenAI may include modelled conversions where a click could not be directly observed.',
    },
    {
      t: 'p',
      text: 'There is also a view-through metric to be careful with. View-through conversions use a fixed one-day window after an ad impression and are reported separately at campaign level. They are not included in the Conversions total, and bidding, CPA and optimisation all stay click-based. Quoting the two numbers together as though they were one is an easy way to overstate performance to yourself.',
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Pick one source of truth per decision',
      text: 'Use Ads Manager to judge and optimise ChatGPT campaigns, because that is what the bidding runs on. Use your own analytics or CRM to judge total business impact across every channel. Trying to reconcile them to the last conversion is work that never pays for itself.',
    },

    {
      t: 'faq',
      items: [
        {
          q: 'Can I install the OpenAI Pixel through Google Tag Manager?',
          a: 'Yes, as a custom HTML tag. Fire it on all pages as early as possible. Be aware that GTM itself loads asynchronously, so a conversion firing very early in a page load can be missed. For the highest-value events, hard-coding the snippet into the head is more reliable.',
        },
        {
          q: 'Do I need the Conversions API as well as the Pixel?',
          a: 'Not to get started. The Pixel alone works. Add the server-side API when the numbers matter enough that browser-side loss (ad blockers, failed requests, privacy settings) is costing you real optimisation quality, and use event_id to deduplicate.',
        },
        {
          q: 'What is automatic advanced matching, in plain terms?',
          a: 'When the click identifier is missing, the Pixel looks for customer information already being entered in your forms, hashes it in the browser with SHA-256, and sends the hash so the conversion can still be matched. Raw information is not sent. It is on by default for new pixels, and OpenAI enables it for existing web pixels on 17 August 2026. You can opt out under Tools, Conversions, Data Source, Edit pixel.',
        },
        {
          q: 'Should I turn automatic advanced matching off?',
          a: 'For most businesses, no. It improves measurement without sending raw data. But if you operate under strict consent requirements, or your legal position on hashed identifiers is unsettled, review it with whoever owns privacy for you before the date rather than discovering it afterwards.',
        },
        {
          q: 'Why is my conversion count zero when I know there were sales?',
          a: 'Work through it in this order: is the Pixel firing at all (console with debug on), is a CSP blocking it, is oppref surviving to the conversion page, and is the event name one that your campaign is configured to count. In practice a stripped query parameter is the most common cause.',
        },
      ],
    },

    { t: 'divider' },
    {
      t: 'p',
      text: 'None of this is difficult. It is just new, and the documentation is spread across several pages. Set it up once, test it properly with a real navigation path, and you will know whether ChatGPT ads work for you rather than guessing.',
    },
  ],
}
