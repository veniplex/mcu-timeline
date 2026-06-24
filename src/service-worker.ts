/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

// `self` is a ServiceWorkerGlobalScope inside a service worker.
const sw = self as unknown as ServiceWorkerGlobalScope;

// One cache per deploy (version changes each build) so stale assets get evicted.
const CACHE = `mcu-cache-${version}`;

// App shell: framework bundles (`build`) + everything under static/ (`files`).
const PRECACHE = [...build, ...files];

sw.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => sw.skipWaiting()));
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			for (const key of await caches.keys()) {
				if (key !== CACHE) await caches.delete(key);
			}
			await sw.clients.claim();
		})()
	);
});

sw.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	// Only handle same-origin requests; let TMDB images, GitHub API, Firebase, etc.
	// hit the network normally.
	if (url.origin !== location.origin) return;

	// Precached build/static assets: cache-first (immutable, hashed).
	if (PRECACHE.includes(url.pathname)) {
		event.respondWith(caches.match(request).then((cached) => cached ?? fetch(request)));
		return;
	}

	// Navigations & everything else same-origin: network-first, fall back to cache
	// (offline app shell), then to the cached root as a last resort.
	event.respondWith(
		(async () => {
			try {
				const response = await fetch(request);
				if (response.ok && response.type === 'basic') {
					const cache = await caches.open(CACHE);
					cache.put(request, response.clone());
				}
				return response;
			} catch {
				const cached = await caches.match(request);
				if (cached) return cached;
				if (request.mode === 'navigate') {
					const shell = await caches.match('/');
					if (shell) return shell;
				}
				return new Response('Offline', { status: 503, statusText: 'Offline' });
			}
		})()
	);
});
