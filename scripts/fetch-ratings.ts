/**
 * Fetch IMDB + Rotten Tomatoes ratings via OMDb API and write src/lib/data/ratings.json.
 *
 * Run:  node --env-file=.env scripts/fetch-ratings.ts
 * Requires: OMDB_API_KEY in .env  (free key at https://www.omdbapi.com/apikey.aspx)
 *
 * Keyed by chronology entry id (same as catalog keys).
 * Safe to re-run — merges with existing ratings.json so manual overrides are preserved.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { chronology } from '../src/lib/data/chronology.ts';
import type { Ratings } from '../src/lib/data/types.ts';

const API_KEY = process.env.OMDB_API_KEY;
if (!API_KEY) {
	console.error('OMDB_API_KEY missing. Run with: node --env-file=.env scripts/fetch-ratings.ts');
	console.error('Get a free key at https://www.omdbapi.com/apikey.aspx');
	process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(here, '../src/lib/data');
const RATINGS_PATH = resolve(DATA_DIR, 'ratings.json');
const CATALOG_PATH = resolve(DATA_DIR, 'catalog.en.json');

async function fetchRating(
	title: string,
	year: number,
	type: 'movie' | 'series',
	imdbId?: string | null
): Promise<Ratings | null> {
	const url = new URL('https://www.omdbapi.com/');
	// Prefer an exact lookup by IMDb id (avoids title-prefix mismatches like
	// "Marvel's Daredevil" vs OMDb's "Daredevil"); fall back to title+year.
	if (imdbId) {
		url.searchParams.set('i', imdbId);
	} else {
		url.searchParams.set('t', title);
		url.searchParams.set('y', String(year));
		url.searchParams.set('type', type);
	}
	url.searchParams.set('apikey', API_KEY!);

	const res = await fetch(url);
	if (!res.ok) return null;
	const data = await res.json() as Record<string, unknown>;
	if (data.Response === 'False') return null;

	const imdb = typeof data.imdbRating === 'string' && data.imdbRating !== 'N/A'
		? data.imdbRating
		: undefined;

	const rtEntry = Array.isArray(data.Ratings)
		? (data.Ratings as { Source: string; Value: string }[]).find(r => r.Source === 'Rotten Tomatoes')
		: undefined;
	const rt = rtEntry ? rtEntry.Value.replace('%', '') : undefined;

	if (!imdb && !rt) return null;
	return { imdb, rt };
}

async function main() {
	// Load existing ratings to merge (preserves manual overrides)
	let existing: Record<string, Ratings> = {};
	try {
		existing = JSON.parse(await readFile(RATINGS_PATH, 'utf8'));
	} catch {
		// fresh start
	}

	// IMDb ids from the catalog (written by fetch-tmdb) — for exact OMDb lookups.
	let catalog: Record<string, { imdbId?: string | null }> = {};
	try {
		catalog = JSON.parse(await readFile(CATALOG_PATH, 'utf8'));
	} catch {
		console.warn('catalog.en.json not found — run fetch-tmdb first for exact IMDb-id lookups.');
	}

	const result: Record<string, Ratings> = { ...existing };
	let updated = 0;

	// Fetch once per unique show, keyed by imdbId (falls back to title:year), then
	// apply the show-level rating to every entry that shares it (all seasons).
	const cache = new Map<string, Ratings | null>();

	for (const entry of chronology) {
		const imdbId = catalog[entry.id]?.imdbId ?? null;
		const cacheKey = imdbId ?? `${entry.query.title}:${entry.query.year}`;
		process.stdout.write(`• ${entry.id} … `);
		try {
			let ratings: Ratings | null;
			if (cache.has(cacheKey)) {
				ratings = cache.get(cacheKey)!;
			} else {
				const type = entry.query.type === 'movie' ? 'movie' : 'series';
				ratings = await fetchRating(entry.query.title, entry.query.year, type, imdbId);
				cache.set(cacheKey, ratings);
				// OMDb free tier: 1000 req/day, ~1 req/sec is safe
				await new Promise(r => setTimeout(r, 250));
			}
			if (ratings) {
				result[entry.id] = ratings;
				updated++;
				console.log(`ok (imdb=${ratings.imdb ?? '–'} rt=${ratings.rt ?? '–'}%)`);
			} else {
				console.log('no data');
			}
		} catch (err) {
			console.log(`FAILED: ${(err as Error).message}`);
		}
	}

	await writeFile(RATINGS_PATH, JSON.stringify(result, null, 2));
	console.log(`\nDone. Updated ${updated} entries.`);
}

main().catch(e => { console.error(e); process.exit(1); });
