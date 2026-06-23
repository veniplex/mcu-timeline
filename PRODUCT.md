# Product

## Register

product

## Users

MCU fans planning or tracking a watchthrough of the entire Marvel Cinematic Universe. Primary goal: know what to watch next, in what order, and track what they've already seen. Secondary: casual explorers discovering titles and timelines without a specific sequence in mind.

Context: browsing at home, on a couch or desktop, in leisure mode. Not in a hurry. They want to feel the weight of the universe they're about to navigate.

## Product Purpose

A curated, chronological (or release-date) guide to the MCU. Every film, Disney+ series, legacy TV show, animated entry, and Sony tie-in — ordered correctly, tracked per-episode, with localized metadata from TMDB. Users sign in to track watched state; the site works without auth. Success = a user can open the site, know exactly where they are in the MCU, and close it feeling oriented rather than overwhelmed.

## Brand Personality

Bold · Vibrant · Energetic

Voice: confident, no filler. The MCU is a big deal — the design earns that scale without shouting. Phase colors give each era its own identity. The design has presence.

## Anti-references

- **Generic SaaS / grey dashboard**: no muted neutrals, no "app-shell grey", no utilitarian flatness. Must feel like it belongs to the MCU world.
- **Fan wiki / information overload**: not a raw data dump. Curated, designed, every element earns its place. Dense only where density serves the user.

## Design Principles

1. **The universe has weight** — spacing, color depth, and typography should communicate that this is a significant body of work, not a checklist.
2. **Phase identity** — each Marvel phase has a distinct color and feel; the UI makes that tangible, not just a label.
3. **Progress feels earned** — watched state should feel satisfying to accumulate; completion is a real achievement.
4. **Content leads** — posters, titles, and timelines are the product; chrome stays out of the way.
5. **Works cold** — a user with no account, no watch history, and no prior knowledge should still find it immediately useful and navigable.

## Accessibility & Inclusion

- WCAG AA minimum (contrast ≥4.5:1 for body, ≥3:1 for large text).
- Reduced motion respected (already in layout.css via `prefers-reduced-motion`).
- Keyboard navigable (focus-visible ring already defined).
- DE/EN bilingual — i18n is already wired via locale store.
