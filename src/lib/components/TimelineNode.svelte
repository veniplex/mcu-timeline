<script lang="ts">
	import { Check, Film, Tv, Clock } from 'lucide-svelte';
	import { posterUrl } from '$lib/tmdb';
	import type { TimelineItem } from '$lib/data/timeline';
	import { watched, setWatchedMany } from '$lib/stores/watched';
	import { firebaseEnabled } from '$lib/firebase';
	import { auth } from '$lib/stores/auth';
	import { t } from '$lib/i18n/messages';

	let { item, onopen }: { item: TimelineItem; onopen: (item: TimelineItem) => void } = $props();

	const isWatched = $derived(item.entryIds.every((id) => $watched.has(id)));
	const isPartial = $derived(!isWatched && item.entryIds.some((id) => $watched.has(id)));
	const canTrack = $derived(firebaseEnabled && !!$auth.user);

	const poster = $derived(posterUrl(item.poster));

	function toggle(e: MouseEvent) {
		e.stopPropagation();
		setWatchedMany(item.entryIds, !isWatched);
	}
</script>

<article
	class="group relative flex w-44 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-surface text-left transition-transform duration-200 hover:-translate-y-1 focus-within:-translate-y-1"
>
	<button
		class="block w-full cursor-pointer text-left"
		onclick={() => onopen(item)}
		aria-label={item.title}
	>
		<div class="relative aspect-[2/3] w-full bg-muted">
			{#if poster}
				<img
					src={poster}
					alt=""
					loading="lazy"
					width="342"
					height="513"
					class="h-full w-full object-cover transition-opacity duration-200 {isWatched
						? ''
						: 'opacity-95'}"
				/>
			{:else}
				<div class="grid h-full w-full place-items-center text-muted-foreground">
					{#if item.isSeries}<Tv class="size-8" />{:else}<Film class="size-8" />{/if}
				</div>
			{/if}
			{#if isWatched}
				<div
					class="absolute inset-0 ring-2 ring-inset ring-accent"
					aria-hidden="true"
				></div>
			{/if}
		</div>
	</button>

	<div class="flex flex-1 flex-col gap-1 p-2.5">
		<h3 class="line-clamp-2 text-sm font-semibold leading-tight">{item.title}</h3>
		<div class="mt-auto flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
			{#if item.isSeries}
				<Tv class="size-3.5" aria-hidden="true" />
				<span>{item.episodeCount} ep</span>
			{:else}
				<Film class="size-3.5" aria-hidden="true" />
				{#if item.runtime}
					<Clock class="size-3.5" aria-hidden="true" /><span>{item.runtime}m</span>
				{/if}
			{/if}
			{#if item.year}<span class="ml-auto">{item.year}</span>{/if}
		</div>
	</div>

	{#if canTrack}
		<button
			class="absolute right-2 top-2 grid size-8 place-items-center rounded-full border transition-colors {isWatched
				? 'border-accent bg-accent text-on-accent'
				: isPartial
					? 'border-accent bg-surface/90 text-accent'
					: 'border-border bg-surface/90 text-muted-foreground hover:text-foreground'}"
			aria-pressed={isWatched}
			aria-label={isWatched ? $t('watched.unmark') : $t('watched.mark')}
			onclick={toggle}
		>
			<Check class="size-4" aria-hidden="true" />
		</button>
	{/if}
</article>
