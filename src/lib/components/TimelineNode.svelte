<script lang="ts">
	import { Check, Film, Tv, Clock } from 'lucide-svelte';
	import { posterUrl } from '$lib/tmdb';
	import type { TimelineItem } from '$lib/data/timeline';
	import { watched, setWatchedMany } from '$lib/stores/watched';
	import { firebaseEnabled } from '$lib/firebase';
	import { auth } from '$lib/stores/auth';
	import { t } from '$lib/i18n/messages';

	let {
		item,
		color,
		onopen
	}: { item: TimelineItem; color: string; onopen: (item: TimelineItem) => void } = $props();

	const isWatched = $derived(item.entryIds.every((id) => $watched.has(id)));
	const isPartial = $derived(!isWatched && item.entryIds.some((id) => $watched.has(id)));
	const canTrack = $derived(firebaseEnabled && !!$auth.user);
	const poster = $derived(posterUrl(item.poster, 'w342'));

	function toggle(e: MouseEvent) {
		e.stopPropagation();
		setWatchedMany(item.entryIds, !isWatched);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onopen(item);
		}
	}
</script>

<div
	class="group relative flex h-28 w-full cursor-pointer overflow-hidden rounded-xl border bg-surface text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:h-32 lg:h-40 {isWatched
		? 'border-accent'
		: 'border-border'}"
	style="border-left: 4px solid {isWatched ? 'var(--color-accent)' : color}"
	role="button"
	tabindex="0"
	aria-label={item.title}
	onclick={() => onopen(item)}
	onkeydown={onKey}
>
	<div class="relative h-full shrink-0 bg-muted" style="aspect-ratio: 2/3">
		{#if poster}
			<img
				src={poster}
				alt=""
				loading="lazy"
				class="h-full w-full object-cover {isWatched ? '' : 'opacity-95'}"
			/>
		{:else}
			<div class="grid h-full w-full place-items-center text-muted-foreground">
				{#if item.isSeries}<Tv class="size-6" />{:else}<Film class="size-6" />{/if}
			</div>
		{/if}
		{#if isWatched}
			<span
				class="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-accent text-on-accent"
			>
				<Check class="size-3.5" aria-hidden="true" />
			</span>
		{/if}
	</div>

	<div class="flex min-w-0 flex-1 flex-col gap-1 p-3 lg:p-4">
		<h3 class="line-clamp-2 text-sm font-semibold leading-tight lg:text-base">{item.title}</h3>
		<div
			class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground tabular-nums lg:text-sm"
		>
			{#if item.year}<span>{item.year}</span>{/if}
			{#if item.isSeries}
				<span class="inline-flex items-center gap-1"
					><Tv class="size-3.5" />{item.episodeCount} ep</span
				>
			{:else if item.runtime}
				<span class="inline-flex items-center gap-1"
					><Clock class="size-3.5" />{item.runtime}m</span
				>
			{/if}
		</div>
		{#if item.eraTag}
			<span class="mt-auto w-fit rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
				>{item.eraTag}</span
			>
		{/if}

		{#if canTrack}
			<button
				class="absolute right-2 top-2 grid size-7 place-items-center rounded-full border transition-colors lg:size-8 {isWatched
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
	</div>
</div>
