import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'early-banner-dismissed';

function initial(): boolean {
	if (!browser) return false;
	return localStorage.getItem(STORAGE_KEY) === '1';
}

function createBannerDismissed() {
	const { subscribe, set } = writable<boolean>(initial());

	return {
		subscribe,
		dismiss() {
			if (browser) {
				try {
					localStorage.setItem(STORAGE_KEY, '1');
				} catch {
					/* ignore quota / private-mode errors */
				}
			}
			set(true);
		}
	};
}

/** Whether the visitor has dismissed the early-project notice banner. Persisted. */
export const bannerDismissed = createBannerDismissed();
