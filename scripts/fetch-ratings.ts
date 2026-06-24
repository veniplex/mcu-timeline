/**
 * Fetch IMDB + Rotten Tomatoes ratings and write src/lib/data/ratings.json.
 *
 * Run:  node --env-file=.env scripts/fetch-ratings.ts
 * Requires: OMDB_API_KEY in .env  (free key at https://www.omdbapi.com/apikey.aspx)
 *
 * IMDb ratings come from IMDb's official, complete dataset
 * (https://datasets.imdbws.com/title.ratings.tsv.gz) keyed by IMDb id — OMDb's
 * per-episode `imdbRating` is patchy (often N/A), the dataset is 100% complete.
 * Episode IMDb ids are reused from the previous ratings.json when present, else
 * discovered via an OMDb episode lookup.
 *
 * Rotten Tomatoes (RT has no API):
 *  - movies : OMDb Ratings array, falling back to a scrape of the movie's RT page.
 *  - series : a scrape of the show's RT page (OMDb returns no RT for TV).
 *  - per-episode RT scores are not published by RT, so episodes carry IMDb only
 *    (the UI links to the RT episode page).
 *
 * Safe to re-run — merges with existing ratings.json so manual overrides survive.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { chronology, rtSlugOf } from '../src/lib/data/chronology.ts';
import type { EpisodeRating, Ratings } from '../src/lib/data/types.ts';

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
const IMDB_DATASET = 'https://datasets.imdbws.com/title.ratings.tsv.gz';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type CatalogEpisode = { season: number; number: number };
type CatalogEntry = { imdbId?: string | null; episodes?: CatalogEpisode[] };

/** Download IMDb's official ratings dataset → Map<tconst, averageRating>. */
async function loadImdbDataset(): Promise<Map<string, string>> {
	process.stdout.write('Downloading IMDb ratings dataset … ');
	const res = await fetch(IMDB_DATASET);
	if (!res.ok) throw new Error(`IMDb dataset ${res.status}`);
	const tsv = gunzipSync(Buffer.from(await res.arrayBuffer())).toString('utf8');
	const map = new Map<string, string>();
	let first = true;
	for (const line of tsv.split('\n')) {
		if (first) {
			first = false;
			continue;
		}
		const a = line.indexOf('\t');
		if (a < 0) continue;
		const b = line.indexOf('\t', a + 1);
		map.set(line.slice(0, a), line.slice(a + 1, b < 0 ? undefined : b));
	}
	console.log(`ok (${map.size.toLocaleString()} titles)`);
	return map;
}

async function omdb(params: Record<string, string>): Promise<Record<string, unknown> | null> {
	const url = new URL('https://www.omdbapi.com/');
	for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
	url.searchParams.set('apikey', API_KEY!);
	const res = await fetch(url);
	if (!res.ok) return null;
	const data = (await res.json()) as Record<string, unknown>;
	return data.Response === 'False' ? null : data;
}

function rtFromOmdb(data: Record<string, unknown>): string | undefined {
	const entry = Array.isArray(data.Ratings)
		? (data.Ratings as { Source: string; Value: string }[]).find(
				(r) => r.Source === 'Rotten Tomatoes'
			)
		: undefined;
	return entry ? entry.Value.replace('%', '') : undefined;
}

/** Scrape the Tomatometer (critics score) off a Rotten Tomatoes page. */
async function scrapeRt(slug: string): Promise<string | undefined> {
	const res = await fetch(`https://www.rottentomatoes.com/${slug}`, {
		headers: { 'user-agent': 'Mozilla/5.0' }
	});
	if (!res.ok) return undefined;
	const html = await res.text();
	const block = html.match(/"criticsScore":\{[^}]*\}/);
	const score = block?.[0].match(/"score":"(\d{1,3})"/);
	return score ? score[1] : undefined;
}

async function main() {
	const imdbData = await loadImdbDataset();

	let existing: Record<string, Ratings> = {};
	try {
		existing = JSON.parse(await readFile(RATINGS_PATH, 'utf8'));
	} catch {
		/* fresh start */
	}

	let catalog: Record<string, CatalogEntry> = {};
	try {
		catalog = JSON.parse(await readFile(CATALOG_PATH, 'utf8'));
	} catch {
		console.warn('catalog.en.json not found — run fetch-tmdb first.');
	}

	const result: Record<string, Ratings> = { ...existing };
	const showRt = new Map<string, string | undefined>(); // rtSlug → tomatometer

	let updated = 0;
	let epWithImdb = 0;
	let epTotal = 0;

	for (const entry of chronology) {
		const imdbId = catalog[entry.id]?.imdbId ?? null;
		const isSeries = entry.query.type === 'tv';
		const slug = rtSlugOf(entry);
		process.stdout.write(`• ${entry.id} … `);
		try {
			const ratings: Ratings = {};

			// --- IMDb (show/movie level), authoritative dataset ---
			if (imdbId) ratings.imdb = imdbData.get(imdbId);

			// --- Rotten Tomatoes ---
			if (slug) {
				if (showRt.has(slug)) {
					ratings.rt = showRt.get(slug);
				} else {
					let rt: string | undefined;
					if (!isSeries && imdbId) rt = rtFromOmdb((await omdb({ i: imdbId })) ?? {});
					if (!rt) rt = await scrapeRt(slug); // series, or movie OMDb gap
					showRt.set(slug, rt);
					ratings.rt = rt;
					await sleep(300);
				}
			} else if (!isSeries && imdbId) {
				ratings.rt = rtFromOmdb((await omdb({ i: imdbId })) ?? {});
				await sleep(250);
			}

			// --- Per-episode IMDb rating (dataset) + episode IMDb id ---
			if (isSeries && imdbId) {
				const eps = catalog[entry.id]?.episodes ?? [];
				const prevEps = existing[entry.id]?.episodes ?? {};
				const epMap: Record<string, EpisodeRating> = {};
				for (const ep of eps) {
					epTotal++;
					const key = `${ep.season}-${ep.number}`;
					// Reuse a known episode IMDb id; else discover it via OMDb.
					let epId = prevEps[key]?.imdbId;
					if (!epId) {
						const data = await omdb({
							i: imdbId,
							Season: String(ep.season),
							Episode: String(ep.number)
						});
						await sleep(250);
						epId = typeof data?.imdbID === 'string' ? data.imdbID : undefined;
					}
					if (!epId) continue;
					const epImdb = imdbData.get(epId);
					if (epImdb) epWithImdb++;
					epMap[key] = { imdb: epImdb, imdbId: epId };
				}
				if (Object.keys(epMap).length) ratings.episodes = epMap;
			}

			if (ratings.imdb || ratings.rt || ratings.episodes) {
				result[entry.id] = { ...result[entry.id], ...ratings };
				updated++;
				const ec = ratings.episodes ? Object.keys(ratings.episodes).length : 0;
				console.log(
					`ok (imdb=${ratings.imdb ?? '–'} rt=${ratings.rt ?? '–'}${ec ? ` eps=${ec}` : ''})`
				);
			} else {
				console.log('no data');
			}
		} catch (err) {
			console.log(`FAILED: ${(err as Error).message}`);
		}
	}

	await writeFile(RATINGS_PATH, JSON.stringify(result, null, 2));
	console.log(`\nDone. Updated ${updated} entries. Episodes with IMDb: ${epWithImdb}/${epTotal}.`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
