# Handoff: Marrelay Website Redesign

## Overview
A complete website redesign for Marrelay, a 6-person digital studio offering web development, data analytics, social media, SEO/ads, and engineering services. This is a high-fidelity design ready for implementation as a production codebase.

The design showcases a cinematic hero section, service cards, pricing tiers, lead generation form, and responsive mobile navigation. Built with semantic HTML, custom CSS, and vanilla JavaScript for scroll reveal, form validation, and mobile interactions.

## About the Design Files
The bundled HTML/CSS/JS files are **design references and working prototypes**. The task is to **recreate this design in your target codebase** (Next.js, React, Vue, Remix, etc.) using its established patterns, component libraries, and build tools - not to copy the HTML directly.

The prototypes show exact intended appearance, typography, spacing, interaction behavior, and responsive breakpoints. Reference them for visual fidelity and interaction timing.

## Fidelity
**High-fidelity (hifi)**: Pixel-perfect mockups with final colors, typography, spacing, interactions, and animations. Recreate the UI pixel-perfectly using your codebase's design system and component libraries.

---

## Key Files
- `Marrelay Reimagined v2.html` - Main homepage with hero, services, pricing, and lead form
- `marrelay.css` - Complete design tokens and component styles
- `site.js` - Scroll reveal, form validation, mobile nav, FAQ accordion
- `assets/` - Logo mark and placeholder images
- Service pages: `web-development.html`, `data-analytics.html`, `social.html`, `seo-ads.html`, `engineering.html`

---

## Design System

### Color Palette
All colors use oklch for consistency and accessibility:

**Neutrals:**
- `--paper: #FBF6EC` - Light cream background
- `--paper-2: #F4EDDD` - Slightly darker cream
- `--paper-3: #EBE3D0` - Cream accent
- `--ink: #1A1A1E` - Dark charcoal text
- `--ink-2: #2B2B30` - Medium dark text
- `--ink-mut: #6E6A62` - Muted text
- `--ink-soft: #A39E94` - Soft text

**Rules & Borders:**
- `--rule: #E2D9C4` - Light border
- `--rule-strong: #C9BEA3` - Stronger border

**Service Accents** (one per service):
- `--terra: #E07A5F` - Web dev (warm orange-red)
- `--terra-soft: #F2BFA8` - Web dev light
- `--sage: #6B9080` - Data (muted green)
- `--sage-soft: #B7CDC0` - Data light
- `--butter: #F2CC8F` - Social (warm gold)
- `--butter-soft: #F9E5BD` - Social light
- `--peri: #8390C8` - SEO/Ads (soft blue)
- `--peri-soft: #BFC6E2` - SEO/Ads light
- `--plum: #8B5A8C` - Engineering (plum)
- `--plum-soft: #C9A9CB` - Engineering light

**Brand:**
- `--brand: #ED1C24` - Marrelay brand red
- `--brand-soft: #FBD9DA` - Brand light

### Typography
- **Display**: Instrument Serif + Fraunces (serif, italic for emphasis)
- **Body**: DM Sans (clean, modern sans-serif)
- **Mono**: JetBrains Mono (code, labels, timestamps)
- **Brand Font**: Poppins (logo, special callouts)

Font sizes follow a clamp scale for responsiveness:
- Headlines: `clamp(40px, 5vw, 84px)`
- Body text: 17px base, scales with context
- Labels: 11–12px monospace

### Spacing & Layout
- Container max-width: 1280px
- Horizontal padding: 32px (desktop), 20px (mobile ≤720px)
- Gap scale: 12px, 18px, 24px, 32px, 40px, 48px, 60px
- Border radius: 8px (small), 14px (medium), 20–26px (large), 999px (pills)
- Shadows: `4px 4px 0 var(--ink)`, `6px 6px 0`, `8px 8px 0` (hard drop shadows)

---

## Screens / Views

### 1. Homepage (Marrelay Reimagined v2.html)

#### Hero Section (Cinematic Dark)
- **Background**: Dark charcoal (`#0A0A0C`) with optional video background
- **Video layer**: 1.05–1.16x scale, slight pan/zoom animation (luxKen)
- **Scrim**: Radial + linear gradients for depth
- **Vignette**: Subtle edge darkening
- **Grain overlay**: SVG-based noise texture at low opacity
- **Frame corners**: Minimal decorative corner brackets (20px on desktop, 16px mobile)

**Hero Copy Section** (lux-inner):
- Top: Studio name + "Booking July" badge with pulsing dot
- Center: H1 title + lede + CTA buttons
- Bottom: Footer stats (5.0★, 17 startups shipped, 0 missed deadlines, remote-first locations)

**Title Layout**:
- Line 1: "A small studio"
- Line 2: "that ships [*big things*]" (italic)
- Font: Display serif, 48–122px, line-height 0.96

**CTA Buttons**:
- Primary: "Start a project" (cream bg, black text, hover→brand red)
- Secondary: "View selected work" (outline, text link underline on hover)

**Animations**:
- Staggered fade-up on load (d1–d4 delays: 0.1s, 0.28s, 0.46s, 0.62s)
- Video zoom loop (32s duration, ease-in-out, infinite)
- Scroll-triggered nav transparency (fade out until hero is fully scrolled past)

---

#### Announcement Bar
- Dark background (`--ink`)
- Small pill + bold text + link with arrow
- Copy: "New: We just launched a fixed-price startup sprint"

#### Navigation (Sticky)
- Light cream bg with blur backdrop, 72px height
- Logo (mark + name + "Digital studio" label) left
- Nav links center: Web, Data, Social, SEO & Ads, Engineering
- CTA right: Pricing (ghost button) + Book a call (primary button)
- **Mobile (≤980px)**: Hamburger toggle, slides in drawer from right
- **Over-hero state**: Nav bg goes transparent, text goes light

#### Trust Row
- Label + logo row (5 client logos, 2-column on mobile)
- Borders separate columns

#### Services Grid ("What We Do")
- 6-column layout (2-2-2) for 5 service cards
- **Column spans**: Web (2), Data (2), SEO (2), Social (3), Engineering (3)
- Mobile: 2-column, then 1-column ≤560px
- Each card: soft-colored bg, title (italic emphasis), description, feature tags, arrow icon

**Service Cards**:
1. Web: Terra soft bg, browser glyph art
2. Data: Sage soft bg, chart glyph art
3. SEO & Ads: Peri soft bg, search icon glyph
4. Social: Butter bg, chat/DM glyph
5. Engineering: Plum soft bg, CAD blueprint glyph

Hover: Slight lift + shadow bump

#### How We Work (4-step strip)
- Section bg: Paper-2 with top/bottom borders
- 4 steps in grid (4-col, 2-col ≤880px, 1-col ≤560px)
- Each step: Icon (54px square, colored bg), title, description, timing
- Colors: Butter, Sage-soft, Terra-soft, Peri-soft (left to right)

#### Proof Section ("Built by a startup, for startups")
- Left: Headline + stats (3 number cards)
- Right: Testimonial card (dark bg, 5-star, quote, author avatar)
- Stats: 17+ products, 4.9/5 rating, 28 days median launch
- Quote: Large display font, author initials + name/title

#### Pricing Section
- 3-column card grid (1 col ≤880px)
- **Sprint** (Starter): $2,400 flat, 14 days
- **Build** (Growth, featured): $8,400+, 4–6 weeks, "Most picked" tag
- **Retainer** (Scale): $3,800/mo, 3-month minimum
- Featured card: Dark bg, elevated scale (1.02x), bordered highlight

#### Lead Form (Embedded)
- Split layout: Copy left, form right
- Form fields: Name (required), Email (required), Service checkboxes (required), Message (optional)
- Submit: Dark button with arrow
- Success state: Checkmark icon + confirmation copy

#### Final CTA Section
- Dark bg (`--ink`) with light dot pattern overlay
- Large headline + copy right
- Button row (primary + ghost)
- Signoff: "Marrelay · 6-person crew · Locations"

#### Footer
- Dark bg, 4-column grid (brand, Services, Studio, Elsewhere)
- Links + copyright bottom

---

### 2. Service Pages (web-development.html, etc.)

Each service page follows the same template:

**Top Section**:
- Breadcrumb nav
- Service tag (colored, numbered 01–05)
- H1 title with service accent highlight
- Lede paragraph + CTA row
- Mini-stats (if applicable)

**Hero Stage**:
- Aspect-ratio 1:1 square, right side of content
- Colored soft bg, border, shadow, dot grid overlay
- Floating card badges (positioned absolutely, with animations)

**Body Sections** (alternating white/paper-2 bg):
- `sec-head`: Title + intro copy (2-col grid ≤860px)
- `deliverables`: 3-column card grid (services offered)
- `flow`: 4-step horizontal flow/process (border-divided columns)
- `casestudy`: Split card (image left, dark body right with stats)
- `gallery`: 3-column image grid (case study images)

**Sections**:
1. Deliverables (services this team offers)
2. How It Works (4-step process)
3. Case Study (featured project)
4. Gallery (project images)
5. Pricing (service-specific 3-card grid)

---

## Interactions & Behavior

### Scroll Reveal
- Elements with `[data-reveal]` fade in + slide up as they enter viewport
- Stagger variant `[data-reveal-stagger]` staggers children with 70ms delays
- Threshold: 12%, root margin: `-8% bottom`
- Respects `prefers-reduced-motion`

### Mobile Navigation
- Hamburger toggle at ≤980px
- Drawer slides from right (103% → 0 transform)
- Backdrop blur behind, click-to-close
- Links animate in staggered (delays 60–310ms)
- Escape key closes

### FAQ Accordion
- Click `.faq-item .q` to toggle open state
- Only one item open at a time per list
- `.a` section grows/shrinks with `max-height` transition

### Lead Form
- **Validation**: On submit, check required fields
- Email format check: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Multi-select chips: `[data-multi]` allows multiple; radio behavior otherwise
- Success state: `form.classList.add('done')` hides body, shows success message
- Personalizes success copy with submitter's first name
- Live validation clear: input/change events remove `.invalid` class

### Chip Toggle
- Label click toggles checkbox, syncs `.checked` class to visual
- Unchecked: light bg, muted text
- Checked: dark bg, light text, colored dot

### Service Prefill
- Query string `?service=web` checks matching chip in forms

### Hero Video
- Muted + preload for autoplay
- Waits for `loadeddata`/`canplay` before setting opacity
- Catches autoplay rejections gracefully

### Hover States
- Buttons: Bg color shift, arrow translate
- Card tiles: `-3px -3px` translate + shadow bump
- Links: Underline animates in (scaleX origin:left)
- Nav links: Underline appears on hover (cubic-bezier easing)

### Animations
All respect `@media (prefers-reduced-motion: no-preference)`:

- **Hero**: 
  - Globe rotation (140s linear infinite)
  - Particle drift (bottom to top, 86vh travel)
  - Beacon pulse (box-shadow spread)
  - Scroll indicator wheel (1.7s ease-in-out)

- **Lux Hero**:
  - Video pan/zoom loop (32s ease-in-out)
  - Beacon pulse (2.6s)
  - Entrance stagger (0.1–0.62s delay)

---

## State Management

**Form State**:
- `.lead-form.done` - Form submitted, show success message
- `.field.invalid` - Validation failed, show error message
- `.chips input:checked` - Selected chip toggle
- `.faq-item.open` - FAQ accordion open

**Navigation State**:
- `body.m-open` - Mobile menu open
- `body.over-hero` - Scrolled into hero section (nav style changes)
- `drawer.setAttribute('aria-hidden', 'false')` - Menu visible

**Reveal State**:
- `[data-reveal].in` - Element has scrolled into view, add class to trigger animation

---

## Design Tokens

### Spacing Scale (in pixels)
- 6, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 38, 40, 44, 48, 54, 60, 64, 72, 80, 88, 96

### Border Radius
- 6px (small inputs, chips)
- 8px (highlights, small cards)
- 10px (nav pill, sticky notes)
- 12px–14px (medium buttons, form inputs)
- 18–26px (large cards, media frames)
- 999px (fully rounded: pills, circles)

### Typography Scale
Display serif (Instrument Serif + Fraunces):
- 46–128px (hero titles, clamp formula)
- 22–84px (section titles, clamp formula)
- 32–46px (card titles, clamp formula)

Body (DM Sans):
- 17px base
- 15–19px (lede paragraphs)
- 14–15.5px (body text)
- 13–14.5px (small text)
- 11–12px (mono labels)

### Shadows
```
box-shadow: 4px 4px 0 var(--ink);   /* small cards */
box-shadow: 6px 6px 0 var(--ink);   /* medium cards */
box-shadow: 8px 8px 0 var(--ink);   /* large cards, featured */
```

### Z-Index Scale
- 2–6: Component layers (decorative)
- 50: Sticky nav
- 190–210: Mobile nav backdrop/drawer

---

## Responsive Breakpoints

- **Desktop**: ≥981px - Full nav + desktop layouts
- **Tablet**: 720–980px - 2-column grids, nav collapses at 980px
- **Mobile**: ≤719px - 1-column layouts, 20px padding

Key breakpoints in CSS:
- `@media (max-width: 980px)` - Nav collapses
- `@media (max-width: 880px)` - 2-col grids → 1-col, text scales down
- `@media (max-width: 720px)` - 2-col → 1-col, tight padding
- `@media (max-width: 560px)` - Single column everything

---

## Assets

**Required**:
- `assets/martek-mark.png` - Logo mark (40×40px, SVG or PNG)

**Used in Prototypes** (drop your own images):
- `assets/hero-loop.mp4` - Background video for hero (optional, falls back to scrim)
- `assets/` - Service page images for gallery/case studies (image-slot placeholders)

The design uses `<image-slot>` web component for drag-drop image uploads. Component already bundled in `image-slot.js`.

---

## External Dependencies

- **Google Fonts**: Instrument Serif, Fraunces, DM Sans, JetBrains Mono, Poppins (loaded via link tag)
- **image-slot.js**: Drop-zone component for user images (vanilla web component, no build required)

When adapting to your codebase, consider:
- Swap Google Fonts for your own font strategy (Tailwind/Fonts module, local fonts, etc.)
- Replace `<image-slot>` with your image upload / asset management pattern
- Use your design token system (CSS variables, Tailwind config, etc.) to map the palette

---

## Implementation Notes

### CSS Architecture
- CSS variables for all tokens (colors, fonts, spacing)
- Utility-first where it makes sense (spacing, display), component-focused for cards/buttons
- No CSS frameworks - vanilla CSS + Flexbox/Grid
- Media queries scoped per component

### JavaScript Approach
- Vanilla JS (no frameworks in prototype)
- Self-invoking function to avoid global scope pollution
- IntersectionObserver for scroll reveal
- Event delegation for form validation
- Graceful degradation (if JS fails, structure still readable)

When implementing in a framework:
- Port scroll reveal to framework hooks (useEffect + IntersectionObserver in React)
- Move form validation to framework state (React Hook Form, Formik, etc.)
- Use framework router for navigation + service prefill from query params
- Keep animation timing and easing exact

---

## Copy & Content

All headlines, body copy, pricing, and CTAs are in the HTML. Reference the prototypes for exact wording:
- Messaging tone: casual, honest, startup-friendly ("Hand-built, mostly by humans, occasionally with help from a robot")
- Button labels are action-oriented ("Start a project", "Book a discovery call")
- Pricing tiers have specific messaging per tier (Sprint/Build/Retainer)
- Service descriptions emphasize outcomes ("earn their pixels", "someone reads", etc.)

---

## Quality Checklist

Before shipping:
- [ ] Typography matches all font sizes, weights, line-heights
- [ ] Colors match exact hex/oklch values
- [ ] Spacing and layout match (margin/padding, gap, grid columns)
- [ ] Hover states and transitions work (250–350ms easing)
- [ ] Form validation and submission work end-to-end
- [ ] Mobile nav hamburger + drawer works at ≤980px
- [ ] Scroll reveal triggers at correct scroll depth
- [ ] All links navigate correctly
- [ ] Images load (replace image-slot placeholders)
- [ ] Video background works (optional, graceful fallback if not included)
- [ ] Responsive layouts tested on all breakpoints
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Accessibility: ARIA labels, semantic HTML, color contrast

---

## Questions?

This handoff is self-contained. If you need clarification on a specific component, color, or interaction, reference the prototype files directly or ask the product team.

Good luck shipping!
