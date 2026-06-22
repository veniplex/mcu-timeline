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

const orderOf = new Map(chronology.map((e) => [e.id, e.order]));

/** Sort a single phase's items by the active mode, merging release-view seasons. */
function orderPhaseItems(items: TimelineItem[], sort: SortMode): TimelineItem[] {
	if (sort === 'chronological') {
		return [...items].sort(
			(a, b) => orderOf.get(a.entryIds[0])! - orderOf.get(b.entryIds[0])!
		);
	}
	const sorted = [...items].sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
	// Merge adjacent same-series seasons (nothing else released between them).
	const merged: TimelineItem[] = [];
	for (const item of sorted) {
		const prev = merged[merged.length - 1];
		if (prev && prev.isSeries && item.isSeries && prev.tmdbId === item.tmdbId) {
			merged[merged.length - 1] = mergeSeriesSeasons(prev, item);
		} else {
			merged.push(item);
		}
	}
	return merged;
}

/**
 * Build the timeline view model for the active sort + locale.
 *
 * Phase is the dominant grouping: bands are emitted strictly Phase 1 → 6, so
 * every item precedes all items of any later phase. Within a phase, order is by
 * the active sort — curated in-universe `order` (chronological) or release/air
 * date (release, with adjacent same-series seasons merged into one block).
 */
export function buildTimeline(sort: SortMode, locale: Locale): PhaseBand[] {
	const byPhase = new Map<Phase, TimelineItem[]>();
	for (const entry of chronology) {
		const item = toItem(entry.id, locale);
		if (!item) continue;
		const list = byPhase.get(item.phase) ?? [];
		list.push(item);
		byPhase.set(item.phase, list);
	}

	return [...byPhase.keys()]
		.sort((a, b) => a - b)
		.map((phase) => ({ phase, items: orderPhaseItems(byPhase.get(phase)!, sort) }));
}

export const TOTAL_ENTRIES = chronology.length;
