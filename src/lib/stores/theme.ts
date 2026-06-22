import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

function initial(): Theme {
	if (!browser) return 'dark';
	const stored = localStorage.getItem('theme');
	if (stored === 'light' || stored === 'dark') return stored;
	return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function createTheme() {
	const { subscribe, set, update } = writable<Theme>(initial());

	function apply(value: Theme) {
		if (!browser) return;
		document.documentElement.classList.toggle('dark', value === 'dark');
		localStorage.setItem('theme', value);
	}

	return {
		subscribe,
		set(value: Theme) {
			apply(value);
			set(value);
		},
		toggle() {
			update((v) => {
				const next: Theme = v === 'dark' ? 'light' : 'dark';
				apply(next);
				return next;
			});
		}
	};
}

export const theme = createTheme();
