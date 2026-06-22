import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Locale = 'en' | 'de';
export const LOCALES: Locale[] = ['en', 'de'];

function initial(): Locale {
	if (!browser) return 'en';
	const stored = localStorage.getItem('locale');
	if (stored === 'en' || stored === 'de') return stored;
	return navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en';
}

function createLocale() {
	const { subscribe, set } = writable<Locale>(initial());

	function apply(value: Locale) {
		if (!browser) return;
		document.documentElement.lang = value;
		localStorage.setItem('locale', value);
	}

	return {
		subscribe,
		set(value: Locale) {
			apply(value);
			set(value);
		}
	};
}

export const locale = createLocale();
