import { readable } from 'svelte/store';
import { browser } from '$app/environment';

export const GITHUB_REPO = 'veniplex/mcu-timeline';
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

const CACHE_KEY = 'gh-stars';
const TTL = 6 * 60 * 60 * 1000; // 6h — GitHub's unauthenticated API is rate-limited (60/h)

/**
 * Live stargazer count for the repo. Reads a short-lived localStorage cache
 * first (so it shows instantly and survives the 60-req/h limit), then refreshes
 * in the background. `null` until known / on failure — the UI hides it then.
 */
export const githubStars = readable<number | null>(readCache(), (set) => {
	if (!browser) return;

	const cached = readCache();
	if (cached !== null) set(cached);

	const fresh = readFresh();
	if (cached !== null && fresh) return; // cache still valid, skip the network

	fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
		headers: { Accept: 'application/vnd.github+json' }
	})
		.then((r) => (r.ok ? r.json() : null))
		.then((data) => {
			const count = typeof data?.stargazers_count === 'number' ? data.stargazers_count : null;
			if (count !== null) {
				set(count);
				try {
					localStorage.setItem(CACHE_KEY, JSON.stringify({ count, at: Date.now() }));
				} catch {
					/* ignore quota / private-mode errors */
				}
			}
		})
		.catch(() => {
			/* offline or rate-limited — keep whatever the cache gave us */
		});
});

function readCache(): number | null {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const { count } = JSON.parse(raw);
		return typeof count === 'number' ? count : null;
	} catch {
		return null;
	}
}

function readFresh(): boolean {
	if (!browser) return false;
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return false;
		const { at } = JSON.parse(raw);
		return typeof at === 'number' && Date.now() - at < TTL;
	} catch {
		return false;
	}
}
