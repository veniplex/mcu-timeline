import { chronology, categoryOf } from './chronology';
import type { Category, CatalogItem, Phase, Ratings } from './types';
import catalogEn from './catalog.en.json';
import catalogDe from './catalog.de.json';
import ratingsData from './ratings.json';
import type { Locale } from '$lib/stores/locale';
import type { SortMode } from '$lib/stores/sortMode';

export { sagaOf } from './types';

const ratings = ratingsData as Record<string, Ratings>;

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
	/** IMDb id (e.g. "tt0371746"); null when TMDB has no external id. */
	imdbId: string | null;
	/** Rotten Tomatoes path (e.g. "m/iron_man"); undefined → UI uses a search link. */
	rtSlug?: string;
	isSeries: boolean;
	phase: Phase;
	/** Production/source bucket (Marvel Studios, Netflix, legacy TV, …). */
	category: Category;
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
	episodes: { season: number; number: number; title: string; airDate: string | null }[];
	episodeCount: number;
	ratings?: Ratings;
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
		imdbId: item.imdbId ?? null,
		rtSlug: entry.rtSlug,
		isSeries,
		phase: entry.phase,
		category: categoryOf(entry.id),
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
		episodeCount: item.episodes?.length ?? 0,
		ratings: ratings[entry.id]
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

function mergeAdjacent(sorted: TimelineItem[]): TimelineItem[] {
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

/** Sort a single phase's items by the active mode, merging adjacent seasons. */
function orderPhaseItems(items: TimelineItem[], sort: SortMode): TimelineItem[] {
	if (sort === 'chronological') {
		const sorted = [...items].sort(
			(a, b) => orderOf.get(a.entryIds[0])! - orderOf.get(b.entryIds[0])!
		);
		return mergeAdjacent(sorted);
	}
	const sorted = [...items].sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
	return mergeAdjacent(sorted);
}

/**
 * Build the timeline view model for the active sort + locale.
 *
 * - chronological: Phase is the dominant grouping — bands are emitted strictly
 *   Phase 1 → 6, every item precedes all items of any later phase; within a
 *   phase, items follow the curated in-universe `order`.
 * - release: phases are irrelevant — a single flat band sorted globally by
 *   release/air date, with adjacent same-series seasons merged into one block.
 */
export function buildTimeline(sort: SortMode, locale: Locale): PhaseBand[] {
	const items = chronology
		.map((e) => toItem(e.id, locale))
		.filter((i): i is TimelineItem => i !== null);

	if (sort === 'release') {
		return [{ phase: 1, items: orderPhaseItems(items, 'release') }];
	}

	const byPhase = new Map<Phase, TimelineItem[]>();
	for (const item of items) {
		const list = byPhase.get(item.phase) ?? [];
		list.push(item);
		byPhase.set(item.phase, list);
	}
	return [...byPhase.keys()]
		.sort((a, b) => a - b)
		.map((phase) => ({ phase, items: orderPhaseItems(byPhase.get(phase)!, 'chronological') }));
}

export const TOTAL_ENTRIES = chronology.length;

/** Stable per-episode watched key (independent of sort/merge). */
export function episodeKey(tmdbId: number, season: number, episode: number): string {
	return `ep:${tmdbId}:${season}:${episode}`;
}

/** The watch units that define "fully watched": episode keys for a series with
 * episode data, otherwise the entry ids (movies, or series lacking episodes). */
export function itemUnits(item: TimelineItem): string[] {
	if (item.isSeries && item.episodes.length) {
		return item.episodes.map((e) => episodeKey(item.tmdbId, e.season, e.number));
	}
	return item.entryIds;
}

export function isFullyWatched(item: TimelineItem, set: Set<string>): boolean {
	const units = itemUnits(item);
	return units.length > 0 && units.every((u) => set.has(u));
}

export function watchedUnitCount(item: TimelineItem, set: Set<string>): number {
	return itemUnits(item).filter((u) => set.has(u)).length;
}
