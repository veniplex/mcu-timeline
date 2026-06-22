import { chronology } from './chronology';
import type { CatalogItem, Phase } from './types';
import catalogEn from './catalog.en.json';
import catalogDe from './catalog.de.json';
import type { Locale } from '$lib/stores/locale';
import type { SortMode } from '$lib/stores/sortMode';

const catalogs: Record<Locale, Record<string, CatalogItem>> = {
	en: catalogEn as Record<string, CatalogItem>,
	de: catalogDe as Record<string, CatalogItem>
};

/** One renderable timeline item — a movie, a season-block, or several merged
 * seasons of the same series (release-sort only). */
export interface TimelineItem {
	key: string;
	/** Underlying chronology entry ids this item covers (for watched aggregation). */
	entryIds: string[];
	tmdbId: number;
	isSeries: boolean;
	phase: Phase;
	title: string;
	overview: string;
	releaseDate: string;
	year: number | null;
	runtime: number | null;
	poster: string | null;
	backdrop: string | null;
	eraTag?: string;
	/** Season numbers covered (series only). */
	seasons: number[];
	episodes: { number: number; title: string; airDate: string | null }[];
	episodeCount: number;
}

export interface PhaseBand {
	phase: Phase;
	items: TimelineItem[];
}

function yearOf(date: string): number | null {
	const y = parseInt(date.slice(0, 4), 10);
	return Number.isFinite(y) ? y : null;
}

/** Build a single TimelineItem from one chronology entry. */
function toItem(entryId: string, locale: Locale): TimelineItem | null {
	const entry = chronology.find((e) => e.id === entryId);
	const item = catalogs[locale][entryId] ?? catalogs.en[entryId];
	if (!entry || !item) return null;
	const isSeries = item.tmdbType === 'tv';
	return {
		key: entry.id,
		entryIds: [entry.id],
		tmdbId: item.tmdbId,
		isSeries,
		phase: entry.phase,
		title: item.title,
		overview: item.overview,
		releaseDate: item.releaseDate,
		year: yearOf(item.releaseDate),
		runtime: item.runtime,
		poster: item.poster,
		backdrop: item.backdrop,
		eraTag: entry.eraTag,
		seasons: item.season != null ? [item.season] : [],
		episodes: item.episodes ?? [],
		episodeCount: item.episodes?.length ?? 0
	};
}

function mergeSeriesSeasons(a: TimelineItem, b: TimelineItem): TimelineItem {
	return {
		...a,
		key: `${a.key}+${b.key}`,
		entryIds: [...a.entryIds, ...b.entryIds],
		seasons: [...a.seasons, ...b.seasons],
		episodes: [...a.episodes, ...b.episodes],
		episodeCount: a.episodeCount + b.episodeCount
		// title/poster/releaseDate kept from the earlier season (a)
	};
}

/** Group an already-ordered item list into consecutive same-phase bands. */
function toBands(items: TimelineItem[]): PhaseBand[] {
	const bands: PhaseBand[] = [];
	for (const item of items) {
		const last = bands[bands.length - 1];
		if (last && last.phase === item.phase) last.items.push(item);
		else bands.push({ phase: item.phase, items: [item] });
	}
	return bands;
}

/**
 * Build the timeline view model for the active sort + locale.
 *
 * - chronological: entries in curated `order`; each season-block stands alone.
 * - release: entries sorted by release/air date; adjacent seasons of the SAME
 *   series merge into one block when nothing else releases between them.
 */
export function buildTimeline(sort: SortMode, locale: Locale): PhaseBand[] {
	let items = chronology
		.map((e) => toItem(e.id, locale))
		.filter((i): i is TimelineItem => i !== null);

	if (sort === 'chronological') {
		const orderOf = new Map(chronology.map((e) => [e.id, e.order]));
		items.sort((a, b) => (orderOf.get(a.entryIds[0])! - orderOf.get(b.entryIds[0])!));
	} else {
		items.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
		// Merge adjacent same-series seasons (nothing else released between them).
		const merged: TimelineItem[] = [];
		for (const item of items) {
			const prev = merged[merged.length - 1];
			if (prev && prev.isSeries && item.isSeries && prev.tmdbId === item.tmdbId) {
				merged[merged.length - 1] = mergeSeriesSeasons(prev, item);
			} else {
				merged.push(item);
			}
		}
		items = merged;
	}

	return toBands(items);
}

export const TOTAL_ENTRIES = chronology.length;
