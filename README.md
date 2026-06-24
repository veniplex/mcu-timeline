<div align="center">

# MCU Timeline

**Explore the Marvel Cinematic Universe in the right order.**

An interactive, chronological timeline of every MCU film, series and special —
across all six Phases — with watched-tracking, release-date sorting, and rich
detail pages. Live at **[mcu.guide](https://www.mcu.guide)**.

[![Stars](https://img.shields.io/github/stars/veniplex/mcu-timeline?style=flat&logo=github&color=e0a82e)](https://github.com/veniplex/mcu-timeline/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-b11313.svg)](./LICENSE)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-Svelte%205-ff3e00?logo=svelte&logoColor=white)](https://kit.svelte.dev)

</div>

---

## About

MCU Timeline turns Marvel's sprawling, out-of-order release history into a single
readable thread. Pick **Story Order** to follow events as they happen in-universe,
or **Release date** to relive them as they hit screens. Everything is grouped into
the canonical Marvel Studios **Phase bands** (1–6) and the two **Sagas** (Infinity
& Multiverse), each with its own accent colour.

It is a **non-commercial, open-source fan project** — see [Legal](#legal).

## Features

- 🎬 **Complete catalogue** — the full theatrical slate (Phases 1–6), every Marvel
  Studios Disney+ series & special, the entire legacy Marvel Television run
  (Agents of S.H.I.E.L.D. S1–7, the Netflix Defenders Saga, Inhumans, Runaways,
  Cloak & Dagger, Helstrom), the animated slate (What If…?, X-Men ’97, and more),
  and the loosely-connected Sony tie-ins.
- 🧭 **Two sort modes** — curated in-universe **chronological** order (hybrid of
  Marvel's official timeline + fan consensus, with a per-entry `source` note) or
  global **release-date** order, which merges consecutive same-series seasons into
  single blocks.
- 🟦 **Phase & Saga bands** — a continuous vertical spine with alternating
  left/right cards, milestone Phase headers, and per-Phase accent colours.
- ✅ **Watched tracking** — sign in with Google or GitHub to mark films, whole
  series, or individual episodes as watched; progress syncs to Firestore and
  shows as a sticky progress bar and per-Phase rings.
- ⭐ **Ratings & deep links** — IMDb and Rotten Tomatoes scores on every card, with
  direct **TMDB / IMDb / Rotten Tomatoes** links on each detail page.
- 🌍 **Bilingual** — English & German UI and localized TMDB content.
- 🌗 **Dark / light** themes, persisted per user.
- 📱 **Installable PWA** — add to home screen, works offline (cached app shell),
  standalone display, branded icons.
- ⚡ **Fast & static** — data is fetched at build time into JSON; the runtime ships
  no API keys and hits no metadata API.

## Tech stack

| Area      | Choice |
|-----------|--------|
| Framework | [SvelteKit](https://kit.svelte.dev) + [Svelte 5](https://svelte.dev) (runes) |
| Styling   | [TailwindCSS v4](https://tailwindcss.com) (CSS-first config via `@theme` / `@custom-variant`) |
| Auth & DB | [Firebase](https://firebase.google.com) Authentication (Google / GitHub) + Firestore |
| Data      | [TMDB](https://www.themoviedb.org) (metadata, posters), [OMDb](https://www.omdbapi.com) (IMDb / RT ratings) |
| Icons     | [lucide-svelte](https://lucide.dev) |
| Hosting   | [Vercel](https://vercel.com) (`@sveltejs/adapter-vercel`) + Analytics & Speed Insights |

## Getting started

> Requires **Node 24+** (the data scripts run TypeScript directly via `--env-file`).

```bash
git clone https://github.com/veniplex/mcu-timeline.git
cd mcu-timeline
npm install
cp .env.example .env        # then fill in the keys below
npm run build:data          # fetch TMDB metadata → catalog.{en,de}.json
npm run build:ratings       # fetch IMDb/RT ratings → ratings.json
npm run dev
```

### Environment variables (`.env`)

| Key | Purpose |
|-----|---------|
| `TMDB_API_KEY` | TMDB v3 key — **build-time only**, never shipped to the client. |
| `OMDB_API_KEY` | OMDb key for IMDb/RT ratings ([free key](https://www.omdbapi.com/apikey.aspx)). |
| `PUBLIC_FIREBASE_*` | Firebase web-app config (API key, auth domain, project id, …). |

## How the data works

The catalogue is **generated at build time** and committed as JSON, so the running
app never needs an API key and stays fully static.

1. **`src/lib/data/chronology.ts`** — the hand-curated source of truth. Each entry
   declares its `phase`, a `query` (resolved to a TMDB id), an `order` (sparse, so
   inserts don't renumber), a `source` note, and optionally a pinned `tmdbId`
   (for ambiguous titles like *Daredevil*) and a Rotten Tomatoes `rtSlug`.
2. **`npm run build:data`** (`scripts/fetch-tmdb.ts`) — resolves each entry against
   TMDB (or its pinned id), pulls EN + DE metadata, season/episode lists, and the
   real **IMDb id** (via `external_ids`), and writes `catalog.{en,de}.json`. It logs
   the resolved title for every entry so wrong matches are easy to spot.
3. **`npm run build:ratings`** (`scripts/fetch-ratings.ts`) — looks up IMDb & RT
   scores on OMDb **by IMDb id** (exact) and writes `ratings.json`, propagating one
   show-level rating to all of its seasons.
4. **`src/lib/data/timeline.ts`** — the view model: sorts by the active mode, merges
   adjacent same-series seasons in release view, groups entries into Phase bands,
   and surfaces the IMDb id + RT slug onto each item.

To add or re-order a title, edit `chronology.ts` and re-run the two data scripts.

## PWA

The app ships a web manifest (`static/manifest.webmanifest`) and a service worker
(`src/service-worker.ts`, auto-registered by SvelteKit) that precaches the app
shell for offline use. Branded `any` + `maskable` icons are generated from
`static/favicon.svg`. On a production build it is installable on desktop and
mobile and launches in standalone display mode.

## Firebase setup

- Enable **Authentication → Google and GitHub** providers.
- Add your deployed domain (and `localhost`) under **Auth → Settings → Authorized
  domains**.
- Deploy `firestore.rules` — watched-state is private per user
  (`users/{uid}/watched/{entryId}`), preferences live at `users/{uid}`.

## Deploy (Vercel)

- Set `TMDB_API_KEY`, `OMDB_API_KEY` and all `PUBLIC_FIREBASE_*` as Vercel env vars.
- Build command: `npm run build` (uses `@sveltejs/adapter-vercel`).
- **Windows note:** local `npm run build` fails with an `EPERM symlink` error from
  adapter-vercel — a Windows privilege quirk, not a code issue. It builds fine on
  Vercel's Linux; use `npm run dev` for local work.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run build:data` | Regenerate TMDB catalogs (EN + DE) + IMDb ids |
| `npm run build:ratings` | Regenerate IMDb / Rotten Tomatoes ratings |
| `npm run check` | Typecheck + svelte-check |
| `npm run build` | Production build (Vercel) |

## Contributing

Issues and PRs are welcome — especially chronology corrections, missing titles,
and translations. Run `npm run check` before opening a PR.

### Fixing or extending the chronology

The whole timeline is driven by one hand-curated file:
**[`src/lib/data/chronology.ts`](src/lib/data/chronology.ts)**. You don't need to
touch any component to change what's shown or in what order.

**No setup? Just open an issue.** Pick the right template at
[**New issue**](https://github.com/veniplex/mcu-timeline/issues/new/choose):

- 🕓 **Chronology correction** — a title is in the wrong place or the wrong Phase.
- ➕ **Missing title** — a film/series/special that should be listed isn't.
- 🐞 **Bug report** — something's broken in the app.

Each template asks for the one thing that actually settles these debates: a
**source** (Marvel's official timeline / the timeline book / a primary interview).

**Sending a PR?** Edit `chronology.ts` directly:

1. **Add or move an entry.** Each entry is one object:
   ```ts
   {
     id: 'unique-kebab-id',           // stable; used as the watched-tracking key
     order: 215,                      // sort index — pick a value BETWEEN neighbours
     phase: 3,                        // 1–6, the canonical Marvel Studios Phase
     kind: 'movie',                   // or 'series-block'
     query: { type: 'movie', title: 'Exact TMDB Title', year: 2016 },
     source: 'Official timeline (2016, ~1 week after Civil War)',
     rtSlug: 'm/black_panther'        // optional Rotten Tomatoes path
   }
   ```
   - `order` is **sparse on purpose** (steps of ~10). To slot a title between two
     others, pick any number in the gap (e.g. `215` between `210` and `220`) — no
     renumbering needed.
   - For an ambiguous TV title (multiple *Daredevil*s, etc.) pin the exact match
     with `query.tmdbId` so the build script doesn't grab the wrong show.
   - `source` is **required in spirit** — a one-line provenance note is what makes
     a re-ordering reviewable.
2. **Set its category** (optional). New titles default to **Marvel Studios**. If
   the entry is Netflix / legacy ABC-Hulu-Freeform TV / animated / Sony, add its
   `id` to the matching list in `CATEGORY_BY_ID` at the top of the same file.
3. **Regenerate the data** so metadata, posters, IMDb ids and ratings are filled
   in (needs `TMDB_API_KEY` + `OMDB_API_KEY` in `.env`):
   ```bash
   npm run build:data      # logs the resolved TMDB title per entry — check matches
   npm run build:ratings
   ```
   No API keys handy? Open a PR editing only `chronology.ts` and note it in the
   description — a maintainer will run the scripts.
4. **Verify** with `npm run check`, then open the PR describing what moved and why,
   with your source.

## Legal

This is an **open-source, non-commercial fan project**. It is **not affiliated
with, endorsed, sponsored, or approved by** The Walt Disney Company, Marvel
Studios, Netflix, Sony Pictures, or any of their subsidiaries. *Marvel*,
*Marvel Cinematic Universe*, all character names, titles, and related logos are
trademarks of their respective owners.

Film and series metadata, posters and backdrops are provided by
**[The Movie Database (TMDB)](https://www.themoviedb.org)**. *This product uses the
TMDB API but is not endorsed or certified by TMDB.* Ratings are sourced from
**IMDb** and **Rotten Tomatoes** via the **OMDb API**. All such data and imagery
remain the property of their respective owners.

## License

This project's own source code is released under the **[MIT License](./LICENSE)**.
© 2026 veniplex.
