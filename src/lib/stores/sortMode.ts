import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type SortMode = 'chronological' | 'release';

function initial(): SortMode {
	if (!browser) return 'chronological';
	const stored = localStorage.getItem('sortMode');
	return stored === 'release' ? 'release' : 'chronological';
}

function createSortMode() {
	const { subscribe, set, update } = writable<SortMode>(initial());

	function persist(value: SortMode) {
		if (browser) localStorage.setItem('sortMode', value);
	}

	return {
		subscribe,
		set(value: SortMode) {
			persist(value);
			set(value);
		},
		toggle() {
			update((v) => {
				const next: SortMode = v === 'chronological' ? 'release' : 'chronological';
				persist(next);
				return next;
			});
		}
	};
}

export const sortMode = createSortMode();
