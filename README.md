# MCU Timeline

Interactive chronological timeline of the Marvel Cinematic Universe. Built with
SvelteKit + Svelte 5, TailwindCSS v4, Firebase (Auth + Firestore), TMDB data,
deployed on Vercel.

Features: chronological ↔ release-date sort, MCU Phase bands, EN/DE, dark/light,
Google/GitHub sign-in with per-user watched tracking.

## Setup

1. Copy `.env.example` → `.env` and fill in:
   - `TMDB_API_KEY` — TMDB v3 key (build-time only).
   - `PUBLIC_FIREBASE_*` — Firebase web app config.
2. `npm install`
3. `npm run build:data` — fetches TMDB metadata (EN + DE) into
   `src/lib/data/catalog.{en,de}.json`. Commit the output.
4. `npm run dev`

## Data model

- `src/lib/data/chronology.ts` — curated in-universe order. Each entry has a
  `phase`, a `query` (resolved to a TMDB id by the build script), and a `source`
  note. Edit here to refine ordering or add titles; re-run `npm run build:data`.
- `src/lib/data/timeline.ts` — view model: sorts by mode, merges adjacent
  same-series seasons in release view, groups consecutive entries into Phase bands.

## Firebase

- Enable Authentication → Google and GitHub providers.
- Add the deployed domain (and `localhost`) to Auth → Settings → Authorized domains.
- Deploy `firestore.rules` (watched-state is private per user).

## Deploy (Vercel)

- Set `TMDB_API_KEY` and all `PUBLIC_FIREBASE_*` as Vercel env vars.
- Build command `npm run build` (uses `@sveltejs/adapter-vercel`).
- Note: local `npm run build` fails on Windows with an `EPERM symlink` error
  from adapter-vercel — this is a Windows-only privilege issue; it builds fine on
  Vercel's Linux. Use `npm run dev` for local work.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run build:data` | Regenerate TMDB catalogs |
| `npm run check` | Typecheck + svelte-check |
| `npm run build` | Production build (Vercel) |
