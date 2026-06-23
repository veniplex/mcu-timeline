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
const RATINGS_PATH = resolve(here, '../src/lib/data/ratings.json');

async function fetchRating(title: string, year: number, type: 'movie' | 'series'): Promise<Ratings | null> {
	const url = new URL('https://www.omdbapi.com/');
	url.searchParams.set('t', title);
	url.searchParams.set('y', String(year));
	url.searchParams.set('type', type);
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

	const result: Record<string, Ratings> = { ...existing };
	let updated = 0;
	let skipped = 0;

	// Deduplicate: one rating per unique tmdbId (multiple chronology entries share a show)
	const seen = new Set<string>();

	for (const entry of chronology) {
		const titleKey = `${entry.query.title}:${entry.query.year}`;
		if (seen.has(titleKey)) { skipped++; continue; }
		seen.add(titleKey);

		process.stdout.write(`• ${entry.id} … `);
		try {
			const type = entry.query.type === 'movie' ? 'movie' : 'series';
			const ratings = await fetchRating(entry.query.title, entry.query.year, type);
			if (ratings) {
				result[entry.id] = ratings;
				updated++;
				console.log(`ok (imdb=${ratings.imdb ?? '–'} rt=${ratings.rt ?? '–'}%)`);
			} else {
				console.log('no data');
			}
			// OMDb free tier: 1000 req/day, ~1 req/sec is safe
			await new Promise(r => setTimeout(r, 250));
		} catch (err) {
			console.log(`FAILED: ${(err as Error).message}`);
		}
	}

	await writeFile(RATINGS_PATH, JSON.stringify(result, null, 2));
	console.log(`\nDone. Updated ${updated} entries, skipped ${skipped} duplicates.`);
}

main().catch(e => { console.error(e); process.exit(1); });
