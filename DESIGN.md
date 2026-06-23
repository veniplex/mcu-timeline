---
name: MCU Timeline
description: A curated, chronological guide to the Marvel Cinematic Universe
colors:
  crimson-primary: "#b11313"
  crimson-primary-dark: "#d11f1f"
  gold-accent: "#b8860b"
  gold-accent-dark: "#e0a82e"
  void-background: "#0f172a"
  void-surface: "#14182b"
  void-surface-raised: "#1c2235"
  ink-light: "#0f172a"
  ink-muted-light: "#4b5563"
  parchment-background: "#f7f7fb"
  parchment-surface: "#ffffff"
  cloud-muted: "#e9e9f1"
  slate-muted-dark: "#9aa3b2"
  phase-1-sapphire: "#5b9dff"
  phase-2-teal: "#1fb8a6"
  phase-3-violet: "#a673ff"
  phase-4-rose: "#ff5e8a"
  phase-5-amber: "#f5a524"
  phase-6-emerald: "#4ade80"
typography:
  display:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  "2xl": "64px"
components:
  button-primary:
    backgroundColor: "{colors.crimson-primary}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "8px 20px"
  button-primary-hover:
    backgroundColor: "{colors.crimson-primary-dark}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.crimson-primary}"
    rounded: "{rounded.full}"
    padding: "8px 20px"
  chip-filter:
    backgroundColor: "{colors.parchment-surface}"
    textColor: "{colors.ink-muted-light}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  chip-filter-active:
    backgroundColor: "{colors.crimson-primary}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  card-timeline-node:
    backgroundColor: "{colors.parchment-surface}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.lg}"
    padding: "16px"
  phase-header-full:
    backgroundColor: "{colors.parchment-surface}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.xl}"
    padding: "20px 24px"
  phase-header-pill:
    backgroundColor: "{colors.parchment-surface}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.full}"
    padding: "8px 20px"
---

# Design System: MCU Timeline

## 1. Overview

**Creative North Star: "The Cinematic Universe"**

This is a living map of an expanding universe — each phase a new era, each title a coordinate in something vast. The design doesn't perform importance; it reflects it. Deep-space backgrounds in dark mode. Crisp, editorial clarity in light mode. Phase colors are the primary identity device: six eras, six distinct palettes, each carrying the emotional register of what Marvel built in that chapter. No decorative chrome competes with the poster art.

The system is cinematic and restrained. Components earn their place by staying quiet so content leads. The crimson primary and gold accent are Marvel's own colors — authoritative, used sparingly. Phase milestone headers are the loudest element on the page; everything else recedes. The spine of the timeline is literal: a vertical line connecting everything, continuous, unbroken.

This system explicitly rejects generic SaaS grey and fan-wiki information overload. No muted neutrals-for-safety, no navbar-everything. No table-of-everything. Curated, designed, every pixel earns its place.

**Key Characteristics:**
- Phase identity colors are the primary brand differentiator — six distinct eras, each with a named hue
- Dark mode is the cinematic default; light mode is editorial clarity
- Tonal depth: surfaces layer from background → surface → raised — no drop shadows
- Typography uses Barlow Condensed for display/headings and Barlow for body/UI — width contrast, not typeface contrast
- Poster art and backdrop images do the visual heavy lifting
- The timeline spine is a structural element, not a decoration

## 2. Colors: The Infinity Reel Palette

A dual-register palette: rich deep navy void in dark, editorial off-white in light. Crimson and gold anchor the Marvel identity. Six phase accent colors each carry one era.

### Primary
- **Void Crimson** (`#b11313` light / `#d11f1f` dark): The Marvel identity color. Used on primary CTA buttons, the watched-state dot when filled, phase progress bars, focus rings. Saturated enough to read as "Marvel" without quoting their exact brand.
- **Antique Gold** (`#b8860b` light / `#e0a82e` dark): The secondary accent. Used on TMDB links, ring focus in dark mode, "fully watched" accent states. Warm counterpoint to crimson.

### Secondary (Phase Identity)
- **Phase I Sapphire** (`#5b9dff`): The origin era. Iron Man, the birth of SHIELD. Blue — foundational, trustworthy.
- **Phase II Teal** (`#1fb8a6`): Expansion era. Cooler, more alien (Thor 2, GotG).
- **Phase III Violet** (`#a673ff`): The Infinity saga convergence. Purple — cosmic scale.
- **Phase IV Rose** (`#ff5e8a`): Post-Endgame reset. New energy, warmer, more personal.
- **Phase V Amber** (`#f5a524`): The Multiverse Saga escalation. Warning-hot.
- **Phase VI Emerald** (`#4ade80`): The payoff. Green — completion, new growth.

### Neutral
- **Void** (`#0f172a`): Dark mode background. Deep navy, not black — space, not void.
- **Void Surface** (`#14182b`): Dark mode card and modal background. One step lighter than Void.
- **Void Raised** (`#1c2235`): Dark mode elevated surface. Used for hover states on cards.
- **Parchment** (`#f7f7fb`): Light mode background. Cool off-white, not warm — avoids cream/sand.
- **White Surface** (`#ffffff`): Light mode cards and modals.
- **Cloud Muted** (`#e9e9f1`): Light mode muted backgrounds, chips at rest.
- **Ink** (`#0f172a`): Body text in light mode.
- **Slate Muted** (`#9aa3b2`): Muted text in dark mode. Metadata, dates, runtime.
- **Charcoal Muted** (`#4b5563`): Muted text in light mode.

### Named Rules
**The Phase Color Rule.** Phase accent colors are used exclusively for phase-related UI: milestone header borders, spine dots, card left-accent borders. They are never repurposed for generic action states, links, or decorative fills.

**The One Crimson Rule.** Crimson primary appears on ≤15% of any given screen. It marks watched state, primary CTAs, and focus rings. Its rarity is what makes it register as "significant."

## 3. Typography

**Display Font:** Barlow Condensed (with `ui-sans-serif, system-ui, sans-serif` fallback) — phase headings, saga names, nav brand
**Body Font:** Barlow (with `ui-sans-serif, system-ui, sans-serif` fallback) — card titles, metadata, filters, all UI text

**Character:** Two widths of the same family — condensed display for dramatic chapter headings, regular for dense UI text. Barlow's slightly cinematic geometry suits the MCU context without being decorative. The width contrast creates hierarchy across the spine without resorting to a second typeface.

### Hierarchy
- **Display** (Barlow Condensed 700, `clamp(1.75rem, 4vw, 2.5rem)`, lh 1.1, ls -0.01em): Phase milestone labels. Condensed, commanding.
- **Headline** (Barlow Condensed 600, `clamp(1.25rem, 2.5vw, 1.75rem)`, lh 1.2): Saga headers, modal titles.
- **Title** (Barlow 600, `1rem`, lh 1.3): Card titles, season headers in detail modal.
- **Body** (Barlow 400, `0.875rem`, lh 1.6): Overviews, descriptions. Max 65ch.
- **Label** (Barlow 500, `0.75rem`, lh 1.4, ls 0.01em): Phase badge, metadata chips, year pills on spine. Tabular nums for dates/counts.

### Named Rules
**The Weight Rule.** Never use font-weight 300 (light). Barlow Light reads as uncertain at small sizes. The floor is 400; anything below is prohibited.

## 4. Elevation

This system uses tonal layering exclusively. No drop shadows. Depth is communicated by color: background (darkest) → surface (one step lighter) → raised surface (hover/modal). The absence of shadows keeps the system feeling like a polished digital publication, not a native app.

In dark mode: `#0f172a` → `#14182b` → `#1c2235`. In light mode: `#f7f7fb` → `#ffffff` → (white + `border-border` at 12% ink opacity for containment). Modals use a 60% black backdrop-overlay to reinforce their z-position.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. The only elevation signal is background color. If an element needs to feel "above" the page, its background changes — it does not gain a shadow.

## 5. Components

### Buttons
- **Shape:** Pill / fully rounded (`border-radius: 9999px`)
- **Primary:** Void Crimson background, white text, `padding: 8px 20px`. Font: 14px/500.
- **Hover:** One step darker crimson (`#a01010` light / `#c01a1a` dark). No transform — cinematic, not bouncy.
- **Focus:** 2px ring in Void Crimson (light) / Antique Gold (dark), 2px offset.
- **Ghost / Sort toggle item:** Transparent background. Text `muted-foreground` → `foreground` on hover. Active state: Primary background + on-primary text.

### Filter Chips (Sort + Media toggles)
- Grouped in a pill container with `border-border` border. Individual segments: transparent at rest, primary bg when active.
- Shape: Pill container with inner segments inheriting the `full` radius on extremes.
- **The Segment Pill Rule.** Filter chips live inside a parent pill border. They never have individual borders; containment comes from the parent only.

### Cards (Timeline Nodes)
- **Corner Style:** Gently rounded (16px / `rounded-lg`).
- **Background:** Surface (`#ffffff` light / `#14182b` dark). Hover: Raised Surface (`#f0f0f8` light / `#1c2235` dark).
- **Shadow Strategy:** None. Border at `rgba(15,23,42,0.12)` light / `rgba(255,255,255,0.08)` dark provides containment.
- **Left accent border:** 3px, colored with the item's phase color. This is the only decorative colored border in the system.
- **Internal Padding:** 16px (`spacing.md`).
- **Fixed height:** Cards are uniform height (`h-28 sm:h-32 lg:h-40`) so the spine alignment is always clean.

### Phase Header (Milestone)
- **Full (unstuck):** Centered, max-width `min(22rem,90%)`, rounded-2xl (20px), `padding: 20px 24px`. Colored top border (4px) in the phase's accent color. Background: surface.
- **Pill (stuck / scrolled past):** Slim `rounded-full`, `padding: 8px 20px`. Animated morph via IntersectionObserver.
- **The Milestone Rule.** Phase headers are the only full-bleed-width conceptual break. Nothing else on the page anchors to center and grows to that width.

### Progress Ring (Series Cards)
- SVG circle overlay at bottom-right of poster area. `R=9`, circumference `2πR`. Stroke-dashoffset drives fill as `C * (1 - done/total)`. Rotated -90° so fill starts at 12 o'clock.
- Uses phase color as stroke. Background ring at 20% opacity of the same color.

### Detail Modal
- `max-width: 42rem`, max-height `90dvh`, scroll inside. Rounded-2xl on desktop, rounded-top-2xl on mobile (sheet-style).
- Backdrop image or poster at top, aspect-video. Gradient fade to Surface at bottom of image.
- Episode list: `divide-y divide-border` rows, per-row check circle + title + air date + TMDB icon link.

### Navigation
- Sticky top-0, `height: 64px`. Background: `surface/80` with `backdrop-blur`. Border-bottom `border-border`.
- Logo: bold, Barlow Condensed 600. Lang toggle (EN/DE), theme toggle, auth buttons: icon-only, 36px hit areas.
- Auth: Two separate icon-only buttons (Google SVG + GitHub SVG). When signed in: avatar circle + dropdown sign-out.

### Year Pills (Release View)
- Centered on the spine. `border border-border bg-surface`, `rounded-full px-3 py-1`, `font-bold tabular-nums text-sm`. Shadow-md.

## 6. Do's and Don'ts

### Do:
- **Do** use phase accent colors only for phase-identity UI (header borders, spine dots, card left accents).
- **Do** keep body text at minimum `#4b5563` on white surfaces and `#9aa3b2` on `#14182b` — verify ≥4.5:1 contrast before shipping.
- **Do** let poster art carry the visual weight. Cards are display cases, not design features.
- **Do** keep the timeline spine continuous and unbroken — it is the structural backbone.
- **Do** use tonal background shifts (Raised Surface) to signal hover and elevation — never shadows.
- **Do** apply `text-wrap: balance` on milestone/display headings to prevent orphans.
- **Do** use tabular nums (`font-variant-numeric: tabular-nums`) for all dates, runtimes, and progress counts.
- **Do** respect `prefers-reduced-motion` — all transitions already have a 0.01ms override in the global CSS.

### Don't:
- **Don't** introduce grey-neutral backgrounds for "safety." This is not a SaaS product. Void (`#0f172a`) and Parchment (`#f7f7fb`) are the only neutrals for large backgrounds.
- **Don't** turn this into a fan wiki by piling on metadata. Each card shows: poster, title, phase accent, watched state. Nothing more at rest.
- **Don't** use `border-left` or `border-right` thicker than 1px as a colored accent anywhere except the card's designated left-phase-accent (3px, always phased-colored, never repurposed).
- **Don't** apply gradient text (`background-clip: text`). Single solid color only.
- **Don't** use glassmorphism as a default. Backdrop-filter is reserved for the sticky nav bg only.
- **Don't** add numbered section eyebrows ("01 / About") or tiny all-caps tracked labels above headings. Phase labels are the only label of this type, and they are full-color badges, not tracking eyebrows.
- **Don't** put phase accent colors on interactive states (hover, focus, active) outside of phase-themed components. Generic UI uses crimson/gold, not phase hues.
- **Don't** use font-weight 300. Minimum 400 throughout.
- **Don't** animate layout properties (width, height, padding). Transitions are `color`, `background-color`, `opacity`, `transform` only.
