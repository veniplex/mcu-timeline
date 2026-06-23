<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import Nav from '$lib/components/Nav.svelte';
	import { initUserPrefs } from '$lib/stores/userPrefs';

	injectAnalytics();
	injectSpeedInsights();
	initUserPrefs();

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-dvh flex-col">
	<Nav />
	<main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
		{@render children()}
	</main>
</div>
