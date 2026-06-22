<script lang="ts">
	import { X, Check, Film, Tv, ExternalLink } from 'lucide-svelte';
	import { backdropUrl, posterUrl, tmdbPageUrl } from '$lib/tmdb';
	import type { TimelineItem } from '$lib/data/timeline';
	import { PHASE_LABELS } from '$lib/data/types';
	import { watched, setWatchedMany } from '$lib/stores/watched';
	import { firebaseEnabled } from '$lib/firebase';
	import { auth } from '$lib/stores/auth';
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n/messages';

	let { item, onclose }: { item: TimelineItem | null; onclose: () => void } = $props();

	const isWatched = $derived(!!item && item.entryIds.every((id) => $watched.has(id)));
	const canTrack = $derived(firebaseEnabled && !!$auth.user);

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={onKey} />

{#if item}
	<div class="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
		<button
			class="absolute inset-0 cursor-default bg-black/60"
			aria-label="Close"
			onclick={onclose}
		></button>
		<div
			class="relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-surface shadow-2xl sm:rounded-2xl"
			role="dialog"
			aria-modal="true"
			aria-label={item.title}
			tabindex="-1"
		>
			<div class="relative">
				{#if backdropUrl(item.backdrop)}
					<img
						src={backdropUrl(item.backdrop)}
						alt=""
						class="aspect-video w-full object-cover"
						width="1280"
						height="720"
					/>
				{:else if posterUrl(item.poster, 'w500')}
					<img
						src={posterUrl(item.poster, 'w500')}
						alt=""
						class="aspect-video w-full object-cover"
					/>
				{:else}
					<div class="grid aspect-video w-full place-items-center bg-muted text-muted-foreground">
						{#if item.isSeries}<Tv class="size-10" />{:else}<Film class="size-10" />{/if}
					</div>
				{/if}
				<div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent"></div>
				<button
					class="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/50 text-white"
					aria-label="Close"
					onclick={onclose}
				>
					<X class="size-5" aria-hidden="true" />
				</button>
			</div>

			<div class="space-y-4 p-5 sm:p-6">
				<div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
					<span class="rounded-full bg-primary px-2 py-0.5 font-medium text-on-primary">
						{$t('phase.label')} {item.phase} · {PHASE_LABELS[item.phase][$locale]}
					</span>
					{#if item.eraTag}<span class="rounded-full bg-muted px-2 py-0.5">{item.eraTag}</span>{/if}
					{#if item.year}<span class="tabular-nums">{item.year}</span>{/if}
					{#if item.runtime}<span class="tabular-nums">{item.runtime}m</span>{/if}
				</div>

				<h2 class="text-2xl font-bold tracking-tight">{item.title}</h2>
				{#if item.overview}
					<p class="text-sm leading-relaxed text-muted-foreground">{item.overview}</p>
				{/if}

				<div class="flex flex-wrap items-center gap-3">
					{#if canTrack}
						<button
							class="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors {isWatched
								? 'border-accent bg-accent text-on-accent'
								: 'border-border hover:bg-muted'}"
							aria-pressed={isWatched}
							onclick={() => setWatchedMany(item!.entryIds, !isWatched)}
						>
							<Check class="size-4" aria-hidden="true" />
							{isWatched ? $t('watched.unmark') : $t('watched.mark')}
						</button>
					{/if}
					<a
						href={tmdbPageUrl(item.isSeries ? 'tv' : 'movie', item.tmdbId)}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-muted"
					>
						{$t('detail.viewTmdb')} <ExternalLink class="size-4" aria-hidden="true" />
					</a>
				</div>

				{#if item.isSeries && item.episodes.length}
					<div>
						<h3 class="mb-2 text-sm font-semibold">
							{item.episodeCount} {$t('detail.episodes')}
						</h3>
						<ol class="divide-y divide-border rounded-lg border border-border">
							{#each item.episodes as ep (ep.number + ep.title)}
								<li class="flex items-baseline gap-3 px-3 py-2 text-sm">
									<span class="w-6 shrink-0 tabular-nums text-muted-foreground">{ep.number}</span>
									<span class="flex-1">{ep.title}</span>
									{#if ep.airDate}
										<span class="shrink-0 text-xs tabular-nums text-muted-foreground">
											{ep.airDate}
										</span>
									{/if}
								</li>
							{/each}
						</ol>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
