# Analytics

Everything acquisition-related lives in this folder so future developers (or
agencies) find it in one place.

| File | Purpose |
|---|---|
| `traffic-identification.js` | Browser-side capture of click IDs (gclid, fbclid, li_fat_id, ttclid, epik, msclkid, twclid, sclid, dclid, irclickid + generic sweep), UTMs, GA4 client/session IDs, our own 30-min session ID, first-touch + session-touch attribution, GA4-style channel grouping, referrer + landing page. Exports `getTrafficData()` / `initTraffic()`. |

## How it flows

1. `TrafficInit` (in `components/TrafficInit.tsx`) calls `initTraffic()` on every
   page view - this is what persists first-touch (localStorage, forever) and
   session-touch (sessionStorage, 30-min window).
2. Every lead form (`components/ContactLeadForm.tsx`, `components/PromoBanner.tsx`)
   attaches `getTrafficData()` to its submission.
3. The API (`app/api/leads/route.ts`) writes the lead to the `leads` table and the
   marketing snapshot to the `leads_marketing` table (see `lib/admin/db.ts`).

## Channel grouping rules (summary)

Direct only when there is **no** signal at all (no UTMs, no click IDs, no external
referrer). Otherwise: Paid Search / Paid Social / Paid Video / Display / Paid Other
(paid mediums or ad click IDs), Organic Search / Organic Social / Organic Video
(known engines/platforms), Email, Affiliates, Referral, else Unassigned.

## Future

A GTM/GA4 dataLayer implementation should be added here (e.g. `datalayer.js`)
so page/event pushes share the same source of truth.
