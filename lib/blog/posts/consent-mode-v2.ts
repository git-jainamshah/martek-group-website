import type { Post } from '../types'

export const consentModeV2: Post = {
  slug: 'google-consent-mode-v2-in-3-steps',
  title: 'Google Consent Mode v2 in 3 Steps (GTM, Shopify, or Plain HTML)',
  cardTitle: 'Google Consent Mode v2 in 3 Steps',
  excerpt:
    'Most guides explain what Consent Mode is and stop there. This one shows you the exact tags, the exact order, and how to prove it works, for three different setups.',
  description:
    'A practical, no-jargon guide to implementing Google Consent Mode v2 in three steps, with the exact code and settings for Google Tag Manager, Shopify, and hardcoded sites.',
  category: 'Analytics',
  date: '2026-07-24',
  readMinutes: 11,
  author: { name: 'Marrelay', role: 'Digital studio, Toronto' },
  tags: ['Consent Mode v2', 'GTM', 'GA4', 'Privacy', 'Shopify'],
  seedViews: 320,
  blocks: [
    {
      t: 'lead',
      text: 'If you run ads or analytics for visitors in the EU or UK, Google now requires Consent Mode v2. Get it wrong and you quietly lose conversion data and remarketing audiences. Get it right and you keep measuring, legally, even when people decline cookies. Here is the whole thing in three steps.',
    },
    {
      t: 'callout',
      kind: 'note',
      title: 'Who this is for',
      text: 'Business owners and marketers who have a website, run Google Ads or GA4, and were told to "add consent mode" without being told how. You do not need to be a developer to follow this, but you will need access to your tag manager or site code.',
    },

    {
      t: 'brands',
      items: [
        { key: 'gtm', label: 'Tag Manager' },
        { key: 'ga4', label: 'Google Analytics 4' },
        { key: 'google-ads', label: 'Google Ads' },
        { key: 'onetrust', label: 'OneTrust' },
      ],
    },

    { t: 'h2', id: 'what-it-is', text: 'What Consent Mode actually does (in one minute)' },
    {
      t: 'p',
      text: 'A normal cookie banner blocks Google tags entirely until someone clicks accept. That keeps you compliant, but it means everyone who declines becomes invisible: no conversions, no audiences, big gaps in your reporting.',
    },
    {
      t: 'p',
      text: 'Consent Mode changes the deal. Instead of blocking the tags, your tags still load, but they load in a restricted state. When a visitor has not consented, Google receives no cookies and no identifiers, only anonymous, aggregated pings. Google then uses modelling to estimate the conversions you could not observe directly. You stay compliant and you keep a usable picture of performance.',
    },
    {
      t: 'p',
      text: 'Version 2 added two new signals on top of the original two. That is the entire difference, and it is why so many accounts started showing warnings.',
    },
    {
      t: 'table',
      caption: 'The four consent signals. The last two are what "v2" added.',
      head: ['Signal', 'Controls', 'Added in'],
      rows: [
        ['analytics_storage', 'Analytics cookies (GA4 measurement)', 'v1'],
        ['ad_storage', 'Advertising cookies (conversions, remarketing)', 'v1'],
        ['ad_user_data', 'Whether user data may be sent to Google for ads', 'v2'],
        ['ad_personalization', 'Whether data may be used for personalised ads / remarketing', 'v2'],
      ],
    },
    {
      t: 'figure',
      kind: 'consent-flow',
      caption: 'How a page load works with Consent Mode: defaults fire first, the banner collects a choice, then an update unlocks whatever was granted.',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'The single most common mistake',
      text: 'The default consent command must run BEFORE your Google tags load. If it runs after, the tags have already fired in an unknown state and the whole setup is meaningless. Order matters more than anything else in this guide.',
    },

    { t: 'h2', id: 'step-1', text: 'Step 1: Set your defaults (deny first)' },
    {
      t: 'p',
      text: 'Before any Google tag runs, you tell Google "assume no consent". This is the safe default and it is what regulators expect. You grant permissions later, only if the visitor agrees.',
    },
    {
      t: 'p',
      text: 'A common refinement: deny by default for EU/UK visitors, and grant by default elsewhere (if your legal advice allows implied consent in those regions). The `region` parameter does exactly that.',
    },
    {
      t: 'code',
      lang: 'html',
      caption: 'Place this in <head>, ABOVE your GTM or gtag snippet.',
      code: `<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // 1) Strictest default for regions that require opt-in
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    region: ['GB','AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR',
             'HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI',
             'ES','SE','IS','LI','NO','CH'],
    wait_for_update: 500
  });

  // 2) Default for everywhere else (adjust to your legal advice)
  gtag('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted'
  });

  // Optional but recommended: helps recover conversions via URL tagging
  gtag('set', 'url_passthrough', true);
  gtag('set', 'ads_data_redaction', true);
</script>`,
    },
    {
      t: 'p',
      text: 'Two settings worth understanding. `wait_for_update` tells Google to hold briefly (here 500ms) so a fast clicker does not get missed. `ads_data_redaction` strips ad identifiers while consent is denied, and `url_passthrough` passes click IDs through URLs so conversions can still be attributed without cookies.',
    },

    { t: 'h2', id: 'step-2', text: 'Step 2: Update consent when the visitor chooses' },
    {
      t: 'p',
      text: 'When someone interacts with your banner, you send an update with what they actually agreed to. Only send the signals that changed, and only ever in response to a real choice.',
    },
    {
      t: 'code',
      lang: 'javascript',
      caption: 'Call this from your banner\'s Accept / Reject handlers.',
      code: `// Visitor accepted everything
function consentAcceptAll() {
  gtag('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted'
  });
}

// Visitor accepted analytics only
function consentAnalyticsOnly() {
  gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
}

// Visitor rejected everything: send nothing, the deny defaults already stand.`,
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Remember the choice',
      text: 'Store the decision (a cookie or localStorage) and re-apply it as the default on the next visit, before tags load. Otherwise a returning visitor is treated as unknown every time and your data stays throttled.',
    },

    { t: 'h2', id: 'step-3', text: 'Step 3: Wire it up in your platform' },
    {
      t: 'p',
      text: 'The first two steps are the same everywhere. What changes is where you paste them. Here are the three setups we see most.',
    },

    { t: 'h3', text: 'A. Google Tag Manager' },
    {
      t: 'steps',
      items: [
        {
          title: 'Turn on consent support',
          body: 'In GTM, open Admin then Container Settings and tick "Enable consent overview". A small shield icon now appears on the Tags list so you can see each tag\'s consent settings at a glance.',
        },
        {
          title: 'Add the defaults before everything else',
          body: 'Create a Custom HTML tag containing the Step 1 code. Set its trigger to Consent Initialisation - All Pages (not All Pages). That trigger exists specifically to run before every other tag. This is the step people skip.',
        },
        {
          title: 'Fire the update from your banner',
          body: 'Most consent platforms (OneTrust, Cookiebot, CookieYes, Iubenda, Osano) have a native GTM template that handles the update for you. If you built your own banner, push a dataLayer event on click and use a Custom HTML tag with the Step 2 code, triggered by that event.',
        },
        {
          title: 'Check each tag\'s consent settings',
          body: 'Open a tag, go to Advanced Settings then Consent Settings. GA4 and Google Ads tags have built-in checks, so usually you leave them alone. For non-Google tags (Meta, LinkedIn, TikTok), set "Require additional consent" for the signals they need.',
        },
      ],
    },

    { t: 'h3', text: 'B. Shopify' },
    {
      t: 'steps',
      items: [
        {
          title: 'Prefer the native route',
          body: 'Shopify has a Customer Privacy API and a built-in cookie banner (Settings then Customer privacy). If you use Shopify\'s own Google & YouTube channel, consent signals are passed for you. This is the lowest-maintenance option and the one to choose if you have no developer.',
        },
        {
          title: 'If you use your own GTM',
          body: 'Add the Step 1 script to theme.liquid inside <head>, above the GTM snippet. Shopify themes render <head> in order, so position is everything here.',
        },
        {
          title: 'Hook Shopify\'s banner to the update',
          body: 'Subscribe to Shopify\'s visitorConsentCollected event and call your gtag update inside it, so the two systems agree instead of fighting.',
        },
      ],
    },
    {
      t: 'code',
      lang: 'javascript',
      caption: 'Bridging Shopify\'s consent banner to Consent Mode.',
      code: `document.addEventListener('visitorConsentCollected', (event) => {
  const c = event.detail;
  gtag('consent', 'update', {
    analytics_storage:  c.analyticsAllowed  ? 'granted' : 'denied',
    ad_storage:         c.marketingAllowed  ? 'granted' : 'denied',
    ad_user_data:       c.marketingAllowed  ? 'granted' : 'denied',
    ad_personalization: c.marketingAllowed  ? 'granted' : 'denied'
  });
});`,
    },

    { t: 'h3', text: 'C. Plain HTML / custom site (WordPress, Next.js, anything)' },
    {
      t: 'steps',
      items: [
        {
          title: 'Defaults go first, literally',
          body: 'Paste the Step 1 block as the very first <script> in <head>. Nothing Google-related may appear above it.',
        },
        {
          title: 'Then your gtag or GTM snippet',
          body: 'Immediately after. On WordPress, plugins often inject tags high in <head>, so use a plugin that lets you control priority, or add the defaults via a hook that runs earlier.',
        },
        {
          title: 'Banner calls the update',
          body: 'Whatever banner you use, its accept and reject handlers call the Step 2 functions. That is the entire integration.',
        },
      ],
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Framework gotcha',
      text: 'On React frameworks like Next.js, a script added with the default loading strategy can execute after your tags. Use a strategy that guarantees it runs before hydration (in Next.js, beforeInteractive) or inline it directly into the document head.',
    },

    { t: 'h2', id: 'verify', text: 'How to prove it actually works' },
    {
      t: 'p',
      text: 'This is the part almost every guide omits, and it is the only part that tells you whether you succeeded. Three checks, in increasing order of confidence.',
    },
    {
      t: 'ol',
      items: [
        'Google Tag Assistant: load your site in preview, click a tag, and open the Consent tab. You should see "On page load" showing denied, then "After update" reflecting the choice you made. If the before state is unknown rather than denied, your defaults are not running early enough.',
        'Browser console: type dataLayer in the console after loading the page. The very first entries should be your consent default commands, before any config or event calls. Order in that array is the proof.',
        'GA4 DebugView and Ads diagnostics: in GA4 admin, open DebugView and confirm events still arrive when you decline (they will be cookieless). In Google Ads, the conversion diagnostics panel stops showing the consent mode warning within a few days once signals arrive correctly.',
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'The 30-second sanity test',
      text: 'Open your site in an incognito window, decline the banner, then check your browser\'s cookie list. You should see no _ga or _gcl cookies at all. If you do, your tags are ignoring consent and something upstream is misconfigured.',
    },

    { t: 'h2', id: 'mistakes', text: 'Five mistakes we fix most often' },
    {
      t: 'ul',
      items: [
        'Defaults loading after GTM. The fix is always the Consent Initialisation trigger, never the All Pages trigger.',
        'Only implementing the two v1 signals. Without ad_user_data and ad_personalization you are on v1, and Google treats that as non-compliant for EEA ads.',
        'Sending an update on every page load regardless of choice. Updates should reflect a real, stored decision, not a hardcoded grant.',
        'Blocking tags AND using consent mode. If your banner also physically blocks the tags, they never load, so no modelling happens and you get the worst of both worlds.',
        'Forgetting non-Google tags. Meta and LinkedIn pixels are not covered by Google Consent Mode. They need their own consent gating.',
      ],
    },

    { t: 'h2', id: 'faq', text: 'Questions we get asked' },
    {
      t: 'faq',
      items: [
        {
          q: 'Do I need this if all my customers are in the US or Canada?',
          a: 'Strictly, Google requires it for EEA and UK traffic. But if even a small share of your visitors come from those regions, or you ever plan to advertise there, implementing it now costs an hour and prevents your audiences being disabled later. It also future-proofs you as North American privacy laws tighten.',
        },
        {
          q: 'Will I lose data?',
          a: 'You lose some observed data from people who decline, which you were losing anyway with a blocking banner. What you gain is modelled conversions filling much of that gap, plus continued visibility that you would otherwise not have at all.',
        },
        {
          q: 'Is basic or advanced mode better?',
          a: 'Basic blocks tags until consent. Advanced loads them in a restricted state and enables modelling. Advanced gives materially better data recovery, which is why almost everything above describes advanced. Choose basic only if your legal position requires zero pings before consent.',
        },
        {
          q: 'Does a consent platform do all this for me?',
          a: 'Mostly. Cookiebot, CookieYes and similar tools handle the defaults and updates through their GTM templates. You still need to confirm the defaults run on Consent Initialisation and that all four signals are being sent. Verify rather than assume.',
        },
      ],
    },

    { t: 'h2', id: 'wrap', text: 'The short version' },
    {
      t: 'p',
      text: 'Set deny-by-default before any Google tag loads. Update the signals when the visitor chooses, and remember that choice. Wire it into your platform in the right position, then verify with Tag Assistant that the before state reads denied. That is Consent Mode v2, and it takes an afternoon rather than a project.',
    },
  ],
}
