import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { CATEGORIES, type Category } from '$lib/data/types';

export type MediaFilter = 'all' | 'films' | 'series';

export interface FilterState {
	media: MediaFilter;
	hideWatched: boolean;
	categories: Record<Category, boolean>;
}

const KEY = 'filters';

function allCats(value: boolean): Record<Category, boolean> {
	return Object.fromEntries(CATEGORIES.map((c) => [c, value])) as Record<Category, boolean>;
}

export function defaultFilters(): FilterState {
	return { media: 'all', hideWatched: false, categories: allCats(true) };
}

/** Coerce arbitrary (stored/remote) data into a valid FilterState. */
export function normalizeFilters(raw: unknown): FilterState {
	const base = defaultFilters();
	if (!raw || typeof raw !== 'object') return base;
	const s = raw as Partial<FilterState>;
	return {
		media: s.media === 'films' || s.media === 'series' ? s.media : 'all',
		hideWatched: !!s.hideWatched,
		// Start from "all on", overlay only known category keys.
		categories: { ...allCats(true), ...(s.categories ?? {}) }
	};
}

function initial(): FilterState {
	if (!browser) return defaultFilters();
	try {
		return normalizeFilters(JSON.parse(localStorage.getItem(KEY) ?? '{}'));
	} catch {
		return defaultFilters();
	}
}

const store = writable<FilterState>(initial());

if (browser) {
	store.subscribe((v) => {
		try {
			localStorage.setItem(KEY, JSON.stringify(v));
		} catch {
			// ignore quota / private-mode errors
		}
	});
}

export const filters = store;
