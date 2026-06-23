/** Phases of the MCU. Each timeline entry belongs to exactly one. */
export type Phase = 1 | 2 | 3 | 4 | 5 | 6;

/** Distinct accent color per phase — marks each as its own chapter. */
export const PHASE_COLORS: Record<Phase, string> = {
	1: '#5b9dff', // blue
	2: '#1fb8a6', // teal
	3: '#a673ff', // purple
	4: '#ff5e8a', // pink
	5: '#f5a524', // amber
	6: '#4ade80' // green
};

export type SagaId = 1 | 2;

export const SAGAS: Record<SagaId, { en: string; de: string; phases: Phase[]; color: string }> = {
	1: { en: 'The Infinity Saga', de: 'Die Infinity-Saga', phases: [1, 2, 3], color: '#5b9dff' },
	2: { en: 'The Multiverse Saga', de: 'Die Multiversum-Saga', phases: [4, 5, 6], color: '#ff5e8a' }
};

/** Returns which saga a phase belongs to. */
export function sagaOf(phase: Phase): SagaId {
	return phase <= 3 ? 1 : 2;
}

export type EntryKind = 'movie' | 'series-block' | 'episode-range' | 'episode';

/** TMDB lookup descriptor — resolved to an id by the build script. */
export interface TmdbQuery {
	type: 'movie' | 'tv';
	title: string;
	year: number;
	/** For tv entries: which season this entry covers. */
	season?: number;
	/** Specific episode numbers (within `season`); omit for a whole-season block. */
	episodes?: number[];
	/** Pin the exact TMDB id, bypassing title search (avoids wrong matches for
	 * ambiguous titles like "Daredevil" or "The Punisher"). */
	tmdbId?: number;
}

/** One ordered slot on the curated chronology. */
export interface ChronologyEntry {
	id: string;
	/** Sparse in-universe sort index (step ~10 so inserts don't renumber). */
	order: number;
	phase: Phase;
	kind: EntryKind;
	query: TmdbQuery;
	/** Optional finer in-universe band label (e.g. "WWII", "post-Blip"). */
	eraTag?: string;
	/** Provenance of the ordering: official timeline vs fan consensus. */
	source: string;
	notes?: string;
	/** Rotten Tomatoes path (after rottentomatoes.com/), e.g. "m/iron_man" or
	 * "tv/loki". Hand-curated — RT has no public API. Omit to fall back to an RT
	 * search link. */
	rtSlug?: string;
}

/** IMDB + Rotten Tomatoes rating snapshot (populated by scripts/fetch-ratings.ts). */
export interface Ratings {
	imdb?: string; // e.g. "7.4"
	rt?: string; // e.g. "78" (percentage, without %)
}

/** Localized display payload, produced by the build script per entry id. */
export interface CatalogItem {
	id: string;
	tmdbId: number;
	/** IMDb id (e.g. "tt0371746"), from TMDB external_ids. Language-independent. */
	imdbId?: string | null;
	tmdbType: 'movie' | 'tv';
	title: string;
	overview: string;
	releaseDate: string; // ISO yyyy-mm-dd (movie release or season/episode air date)
	runtime: number | null; // minutes
	poster: string | null; // TMDB path, e.g. /abc.jpg
	backdrop: string | null;
	/** Season / episode context for tv entries. */
	season?: number;
	episodes?: { season: number; number: number; title: string; airDate: string | null }[];
}

export type Catalog = Record<string, CatalogItem>;
