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

export const PHASE_LABELS: Record<Phase, { en: string; de: string }> = {
	1: { en: 'Phase One', de: 'Phase Eins' },
	2: { en: 'Phase Two', de: 'Phase Zwei' },
	3: { en: 'Phase Three', de: 'Phase Drei' },
	4: { en: 'Phase Four', de: 'Phase Vier' },
	5: { en: 'Phase Five', de: 'Phase Fünf' },
	6: { en: 'Phase Six', de: 'Phase Sechs' }
};

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
}

/** Localized display payload, produced by the build script per entry id. */
export interface CatalogItem {
	id: string;
	tmdbId: number;
	tmdbType: 'movie' | 'tv';
	title: string;
	overview: string;
	releaseDate: string; // ISO yyyy-mm-dd (movie release or season/episode air date)
	runtime: number | null; // minutes
	poster: string | null; // TMDB path, e.g. /abc.jpg
	backdrop: string | null;
	/** Season / episode context for tv entries. */
	season?: number;
	episodes?: { number: number; title: string; airDate: string | null }[];
}

export type Catalog = Record<string, CatalogItem>;
