# Marrelay — dataLayer Measurement Plan (v1, for review)

> Draft for sign-off. **No tracking code is written yet.** Once you approve (or tweak) this, I'll implement it. Everything lives in the **`analytics/`** folder, alongside the existing `traffic-identification.js`.

---

## 1. Goals

1. A clean, GTM-ready `window.dataLayer` with a **rich, consistent event schema**.
2. The **full lead-gen funnel** from first touch → engaged → intent → lead, with drop-off visible at every step.
3. A **parallel GA4 Ecommerce funnel** so leads can be reported by **revenue / conversion value** (X in pipeline generated), and per-service value.
4. **Hashed PII** attached to conversions client-side (SHA-256), so Google Ads / Meta enhanced conversions work **without you handling raw PII from Toronto**.
5. **First-touch + session acquisition persisted in first-party cookies**, plus a stable **session_id** and **user_type (new/returning)** on every event.
6. Events that **fire accurately** — deduped, once-per-trigger, SPA-route-aware.

---

## 2. File architecture (all in `analytics/`)

| File | Responsibility |
|---|---|
| `traffic-identification.js` *(exists)* | Acquisition + GA4 client/session IDs. Extended to **also write cookies**. |
| `datalayer.js` *(new)* | `dlPush(event, params)` — ensures `window.dataLayer`, injects **base params** (§4), stamps `event_id`, dedupes. |
| `identity.js` *(new)* | `client_id`, `session_id`, `ga_session_number`, `user_type` (new/returning), `user_id` (hashed), visit-count — read from GA4 cookies + our cookies. |
| `hash.js` *(new)* | SHA-256 via Web Crypto; normalizes email/phone/name before hashing. |
| `service-catalog.js` *(new)* | Service → item map, currency, and **conversion value** logic (§9). |
| `events.js` *(new)* | Named helpers: `trackLead()`, `trackEcom()`, `trackNav()`, `trackCta()`, etc. |
| `AutoTrack.tsx` *(new, client)* | Mounts global listeners (page_view, scroll, engagement, clicks). Rendered once in `LayoutWrapper`. |
| `MEASUREMENT_PLAN.md` | This document. |

Forms (`ContactLeadForm`, `home/LeadForm`, `PromoBanner`) get a few lines each to fire funnel + ecommerce events. Nav/CTA/social get lightweight `data-dl-*` attributes so the global click listener can label them.

---

## 3. Identity & session model (on every event)

| Param | Source | Notes |
|---|---|---|
| `client_id` | GA4 `_ga` cookie (existing `ga4ClientId()`); fallback own UUID cookie `mk_cid` | Stable device ID. |
| `session_id` | GA4 `_ga_XXXX` cookie session id (existing `ga4SessionId()`) | The GA4 session id, as requested. |
| `mk_session_id` | Our own 30-min-window UUID (existing) | Redundant, survives even if GA cookie missing. |
| `ga_session_number` | `_ga_XXXX` cookie | Session count for this device. |
| `user_type` | `new` on first-ever visit, else `returning` | Derived from a persistent `mk_seen` cookie + GA session number. |
| `user_pseudo_id` | = `client_id` | For joins. |
| `user_id` | Hashed email (only **after** a lead) | Cross-device stitching for known users. |

All persisted in **first-party cookies** (§10) so the server (e.g. `/api/leads`) can also read acquisition + IDs.

---

## 4. Base parameters (merged into **every** dataLayer event)

```
event, event_id (uuid), event_time (ISO)
page_location, page_path, page_title, page_referrer
client_id, session_id, mk_session_id, ga_session_number, user_type
consent_analytics, consent_ads            // see §6
// acquisition (from traffic-identification.js)
first_source, first_medium, first_campaign, first_channel_group, first_touch_at
session_source, session_medium, session_campaign, session_channel_group
gclid, fbclid, li_fat_id, msclkid, ttclid … (whichever present)
landing_page, referrer_url
// device
language, viewport, device_type (mobile/tablet/desktop)
```

---

## 5. PII hashing (client-side, SHA-256)

On lead conversion we attach a `user_data` object with **hashed** values only (never raw) — normalized first (email → lowercased/trimmed; phone → E.164 digits; names → lowercased/trimmed):

```
user_data: {
  sha256_email, sha256_phone_number,
  sha256_first_name, sha256_last_name,
  sha256_region, sha256_country          // from company location fields when present
}
```

Keys are named to drop straight into **Google Ads Enhanced Conversions** and **Meta CAPI**. `user_id` is also set to `sha256_email`. Raw PII still flows to your own DB via `/api/leads` (first-party, unchanged) — only the dataLayer gets hashes.

---

## 6. Consent — LOCKED

Scope is the **dataLayer only**. GTM owns tag firing / consent gating; we do **not** build Consent Mode, a banner, or any backend/platform forwarding.

- Every event carries a **`consent` param** (`true`/`false`, from the form's consent box) so your GTM tags can trigger/except on it — "no consent → your tag doesn't fire."
- **Hashed PII (`user_data`) is always present** on the conversion events so your GTM tags can read it. This is safe because **the lead forms require the consent checkbox to submit** — a `generate_lead`/`purchase` cannot fire without `consent === true`, so hashed PII is inherently post-consent.
- No raw PII ever enters the dataLayer — hashes only.

## Decisions — LOCKED
- **Currency:** CAD.
- **Value:** budget-tier midpoint, split across selected services (§9).
- **Consent:** as above (dataLayer only; GTM gates firing).
- **Ecommerce:** `purchase` fires in parallel with `generate_lead`.

---

## 7. Engagement & navigation events

| Event | Trigger | Key params |
|---|---|---|
| `page_view` | SPA route change (Next `usePathname`) + first load | page_path, page_title, page_referrer |
| `scroll_depth` | 25 / 50 / 75 / 90 % reached (once each) | percent_scrolled |
| `engaged_visit` | GA4-style: ≥10s active **or** ≥2 pageviews **or** a conversion | engagement_time_msec, trigger_reason |
| `user_active` (heartbeat) | every 15s of active time (optional, capped) | engagement_time_msec |
| `navigation_click` | header / footer / mobile nav link | nav_label, nav_url, nav_group, nav_location |
| `menu_open` | mobile menu / Services / Case Studies dropdown opened | menu_name |
| `cta_click` | primary/ghost buttons ("Book a discovery call", etc.) | cta_text, cta_destination, cta_location, cta_type |
| `link_click` / `outbound_click` | any `<a>`; `outbound=true` if external | link_url, link_text, link_domain, outbound |
| `social_click` | footer social icons | platform |
| `case_study_interaction` | interactive widgets (motor explode, dashboard toggle, before/after) | widget, action, value |
| `form_view` | a lead form scrolls into view (once) | form_id, form_type, form_location |
| `search`? | n/a (no site search) | — |

---

## 8. Lead-gen conversion funnel

Ordered funnel, each step a distinct event so drop-off is measurable:

1. `view_service` — service or case-study page view *(page_view + `funnel_step:'service_view'`, `service`)*
2. `form_view` — lead form enters viewport
3. `form_start` — first interaction (focus) with any field *(once per form)*
4. `form_error` — validation blocks submit *(params: `error_fields[]`)*
5. **`generate_lead`** — successful submit *(GA4 recommended conversion)*
   - params: `value`, `currency`, `lead_type` (contact / home / promo-banner), `services[]`, `budget`, `timeline`, `lead_id`/`public_id` (if API returns it), `company_country/region/remote`, full acquisition, **`user_data` (hashed)**, `user_id`.

`generate_lead` is the primary GA4 conversion. The ecommerce `purchase` (below) fires **in parallel** for revenue reporting.

---

## 9. GA4 Ecommerce funnel (revenue / conversion value)

Services are modeled as **items** so GA4 Monetization reports light up and you can attach **conversion value** per product.

**Item catalog** (`service-catalog.js`, editable):

| item_id | item_name | item_category |
|---|---|---|
| web | Web Development | Service |
| data | Data & Analytics | Service |
| social | Social | Service |
| seo | SEO & Ads | Service |
| engineering | Engineering & CAD | Service |

**Conversion value** — proposed: derive from the lead's **budget tier midpoint** (best signal we collect), split across selected services:

| budget | value (CAD) |
|---|---|
| `<5k` | 2,500 |
| `5-15k` | 10,000 |
| `15-40k` | 27,500 |
| `40k+` | 50,000 |
| `unsure` / none | 3,000 (default est.) |

`item.price` = value ÷ number of selected services; `quantity` = 1. *(All numbers configurable — see decisions.)*

**Ecommerce events:**

| Event | Trigger | items / value |
|---|---|---|
| `view_item_list` | services shown (home "What we do", `/services`) | items = all services, `item_list_name` |
| `select_item` | click a service card | the clicked service item |
| `view_item` | a `/services/*` page view | that one service (price = its est. value) |
| `add_to_cart` | user ticks service chip(s) in contact form | selected service items |
| `begin_checkout` | `form_start` on contact form | selected items + running `value` |
| `add_shipping_info`* | not used | — |
| **`purchase`** | successful lead submit | `transaction_id` = lead `public_id`, `value`, `currency`, `items[]`, plus hashed `user_data` |

`purchase` uses the lead as the "transaction" so revenue = **pipeline value generated**. This is a deliberate modeling choice (common for lead-gen); `generate_lead` remains the clean conversion, `purchase` is the revenue lens. Both fire.

---

## 10. Cookies (first-party, so server can read acquisition)

| Cookie | Contains | Lifetime |
|---|---|---|
| `mk_first_touch` | compact first-touch acquisition (source/medium/campaign/channel/landing/ts) | 400 days |
| `mk_session_touch` | session acquisition | session / 30-min window |
| `mk_session_id` | our session UUID | 30-min window |
| `mk_cid` | fallback client id (if GA absent) | 400 days |
| `mk_user_type` | new / returning | 400 days |
| `mk_visits` | visit counter | 400 days |

Compact-encoded to stay well under the 4KB cookie limit. `/api/leads` will read these server-side to double-stamp attribution on the stored lead (belt-and-suspenders with the JS `traffic` payload it already gets).

---

## 11. Accuracy & QA

- One `dlPush()` chokepoint → guarantees `window.dataLayer` exists and base params are always present.
- **Dedup:** `event_id` (UUID) on every event; scroll thresholds, `form_start`, `engaged_visit`, `generate_lead`/`purchase` each fire **once** per their scope.
- **SPA-aware:** `page_view` fires on route change; we push a **custom** `page_view` (recommend GTM trigger on the custom event, not the built-in History listener, to avoid double counts).
- QA: a `?dl_debug=1` console logger + a documented checklist; I'll verify each event fires once with correct params in the build smoke test before deploy.

---

## 12. Decisions I need from you (the rest I'll default sensibly)

1. **Currency** — CAD assumed (Toronto). OK?
2. **Conversion value basis** — budget-tier midpoints (above), or fixed per-service values, or flat value per lead?
3. **Consent gating** — fire analytics for all, attach hashed PII/ads only on consented submits (proposed). Add Google **Consent Mode v2** now, or later?
4. **Ecommerce `purchase` mirror** — you asked for revenue events, so I'll include `purchase` alongside `generate_lead`. Confirm you're OK using GA4 `purchase` for leads.
