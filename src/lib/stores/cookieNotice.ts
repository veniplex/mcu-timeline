import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'cookie-notice-dismissed';

function initial(): boolean {
	if (!browser) return false;
	return localStorage.getItem(STORAGE_KEY) === '1';
}

function createCookieNotice() {
	const { subscribe, set } = writable<boolean>(initial());

	return {
		subscribe,
		accept() {
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

/** Whether the visitor has dismissed the cookie/privacy notice. Persisted. */
export const cookieNoticeDismissed = createCookieNotice();
