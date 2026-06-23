/**
 * Build-time TMDB enrichment.
 *
 * Reads the curated chronology, resolves each entry to a TMDB id by search,
 * fetches metadata in en-US and de-DE (+ episode lists for tv season-blocks),
 * and writes src/lib/data/catalog.en.json and catalog.de.json.
 *
 * Run:  node --env-file=.env scripts/fetch-tmdb.ts
 * (Node 24 runs TypeScript directly and loads .env via --env-file.)
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { chronology } from '../src/lib/data/chronology.ts';
import type { Catalog, CatalogItem, ChronologyEntry } from '../src/lib/data/types.ts';

const API_KEY = process.env.TMDB_API_KEY;
if (!API_KEY) {
	console.error('TMDB_API_KEY missing. Run with: node --env-file=.env scripts/fetch-tmdb.ts');
	process.exit(1);
}

const BASE = 'https://api.themoviedb.org/3';
const here = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(here, '../src/lib/data');

type Lang = 'en-US' | 'de-DE';

async function tmdb(path: string, params: Record<string, string> = {}) {
	const url = new URL(BASE + path);
	url.searchParams.set('api_key', API_KEY!);
	for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`TMDB ${res.status} for ${path}`);
	return res.json();
}

async function resolveId(entry: ChronologyEntry): Promise<number | null> {
	const { type, title, year, tmdbId } = entry.query;
	// Pinned id wins — bypass search entirely for ambiguous titles.
	if (tmdbId) return tmdbId;
	const params: Record<string, string> = { query: title, language: 'en-US' };
	if (type === 'movie') params.year = String(year);
	else params.first_air_date_year = String(year);
	const data = await tmdb(`/search/${type}`, params);
	const first = data.results?.[0];
	if (!first) {
		console.warn(`  ! no TMDB match for "${title}" (${year})`);
		return null;
	}
	return first.id as number;
}

/** Language-independent IMDb id via TMDB external_ids. */
async function fetchImdbId(type: 'movie' | 'tv', tmdbId: number): Promise<string | null> {
	try {
		const data = await tmdb(`/${type}/${tmdbId}/external_ids`);
		return (data.imdb_id as string) || null;
	} catch {
		return null;
	}
}

async function buildItem(
	entry: ChronologyEntry,
	tmdbId: number,
	imdbId: string | null,
	lang: Lang
): Promise<CatalogItem> {
	const { type, season } = entry.query;

	if (type === 'movie') {
		const m = await tmdb(`/movie/${tmdbId}`, { language: lang });
		return {
			id: entry.id,
			tmdbId,
			imdbId,
			tmdbType: 'movie',
			title: m.title || m.original_title,
			overview: m.overview ?? '',
			releaseDate: m.release_date ?? '',
			runtime: m.runtime ?? null,
			poster: m.poster_path ?? null,
			backdrop: m.backdrop_path ?? null
		};
	}

	// tv season-block
	const show = await tmdb(`/tv/${tmdbId}`, { language: lang });
	const seasonNo = season ?? 1;
	const s = await tmdb(`/tv/${tmdbId}/season/${seasonNo}`, { language: lang });
	const episodes = (s.episodes ?? []).map((e: any) => ({
		season: seasonNo,
		number: e.episode_number,
		title: e.name ?? '',
		airDate: e.air_date ?? null
	}));
	const releaseDate = s.air_date || episodes[0]?.airDate || show.first_air_date || '';
	return {
		id: entry.id,
		tmdbId,
		imdbId,
		tmdbType: 'tv',
		title: show.name || show.original_name,
		overview: s.overview || show.overview || '',
		releaseDate,
		runtime: show.episode_run_time?.[0] ?? null,
		poster: s.poster_path ?? show.poster_path ?? null,
		backdrop: show.backdrop_path ?? null,
		season: seasonNo,
		episodes
	};
}

async function main() {
	const en: Catalog = {};
	const de: Catalog = {};
	let resolved = 0;

	for (const entry of chronology) {
		process.stdout.write(`• ${entry.id} … `);
		try {
			const id = await resolveId(entry);
			if (id == null) {
				console.log('skipped');
				continue;
			}
			const imdbId = await fetchImdbId(entry.query.type, id);
			en[entry.id] = await buildItem(entry, id, imdbId, 'en-US');
			de[entry.id] = await buildItem(entry, id, imdbId, 'de-DE');
			// de overview/title can be empty on TMDB — fall back to en.
			if (!de[entry.id].overview) de[entry.id].overview = en[entry.id].overview;
			if (!de[entry.id].title) de[entry.id].title = en[entry.id].title;
			resolved++;
			// Log resolved title so wrong matches are easy to spot in the run output.
			console.log(`ok (tmdb ${id}, imdb ${imdbId ?? '–'}) → "${en[entry.id].title}"`);
		} catch (err) {
			console.log(`FAILED: ${(err as Error).message}`);
		}
	}

	await writeFile(resolve(DATA_DIR, 'catalog.en.json'), JSON.stringify(en, null, 2));
	await writeFile(resolve(DATA_DIR, 'catalog.de.json'), JSON.stringify(de, null, 2));
	console.log(`\nDone. Resolved ${resolved}/${chronology.length} entries.`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
