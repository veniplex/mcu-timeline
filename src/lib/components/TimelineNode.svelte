<script lang="ts">
	import { Check, Film, Tv, Clock, ExternalLink } from 'lucide-svelte';
	import { posterUrl, tmdbPageUrl } from '$lib/tmdb';
	import type { TimelineItem } from '$lib/data/timeline';
	import { watched, setWatchedMany } from '$lib/stores/watched';
	import { firebaseEnabled } from '$lib/firebase';
	import { auth } from '$lib/stores/auth';
	import { t } from '$lib/i18n/messages';

	let { item, onopen }: { item: TimelineItem; onopen: (item: TimelineItem) => void } = $props();

	const isWatched = $derived(item.entryIds.every((id) => $watched.has(id)));
	const isPartial = $derived(!isWatched && item.entryIds.some((id) => $watched.has(id)));
	const canTrack = $derived(firebaseEnabled && !!$auth.user);
	const poster = $derived(posterUrl(item.poster, 'w185'));

	function toggle(e: MouseEvent) {
		e.stopPropagation();
		setWatchedMany(item.entryIds, !isWatched);
	}
</script>

<article
	class="flex w-full overflow-hidden rounded-xl border bg-surface text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:-translate-y-0.5 {isWatched
		? 'border-accent'
		: 'border-border'}"
>
	<button
		class="relative block w-20 shrink-0 cursor-pointer bg-muted sm:w-24"
		onclick={() => onopen(item)}
		aria-label={item.title}
	>
		<div class="aspect-[2/3] w-full">
			{#if poster}
				<img
					src={poster}
					alt=""
					loading="lazy"
					width="185"
					height="278"
					class="h-full w-full object-cover {isWatched ? '' : 'opacity-95'}"
				/>
			{:else}
				<div class="grid h-full w-full place-items-center text-muted-foreground">
					{#if item.isSeries}<Tv class="size-6" />{:else}<Film class="size-6" />{/if}
				</div>
			{/if}
			{#if isWatched}
				<span class="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-accent text-on-accent">
					<Check class="size-3.5" aria-hidden="true" />
				</span>
			{/if}
		</div>
	</button>

	<div class="flex min-w-0 flex-1 flex-col gap-1 p-3">
		<button
			class="cursor-pointer text-left"
			onclick={() => onopen(item)}
			aria-label={item.title}
		>
			<h3 class="line-clamp-2 text-sm font-semibold leading-tight">{item.title}</h3>
		</button>

		<div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground tabular-nums">
			{#if item.year}<span>{item.year}</span>{/if}
			{#if item.isSeries}
				<span class="inline-flex items-center gap-1"><Tv class="size-3.5" />{item.episodeCount} ep</span>
			{:else if item.runtime}
				<span class="inline-flex items-center gap-1"><Clock class="size-3.5" />{item.runtime}m</span>
			{/if}
			{#if item.eraTag}<span class="rounded bg-muted px-1.5 py-0.5">{item.eraTag}</span>{/if}
		</div>

		<div class="mt-auto flex items-center gap-2 pt-1">
			<a
				href={tmdbPageUrl(item.isSeries ? 'tv' : 'movie', item.tmdbId)}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
				onclick={(e) => e.stopPropagation()}
			>
				TMDB <ExternalLink class="size-3" aria-hidden="true" />
			</a>
			{#if canTrack}
				<button
					class="ml-auto inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors {isWatched
						? 'border-accent bg-accent text-on-accent'
						: isPartial
							? 'border-accent text-accent'
							: 'border-border text-muted-foreground hover:text-foreground'}"
					aria-pressed={isWatched}
					aria-label={isWatched ? $t('watched.unmark') : $t('watched.mark')}
					onclick={toggle}
				>
					<Check class="size-3.5" aria-hidden="true" />
				</button>
			{/if}
		</div>
	</div>
</article>
