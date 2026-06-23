<script lang="ts">
	import { X, Check, Film, Tv, ExternalLink } from 'lucide-svelte';
	import { backdropUrl, posterUrl, tmdbPageUrl, tmdbEpisodeUrl } from '$lib/tmdb';
	import {
		episodeKey,
		itemUnits,
		isFullyWatched,
		watchedUnitCount,
		type TimelineItem
	} from '$lib/data/timeline';
	import { PHASE_LABELS } from '$lib/data/types';
	import { watched, setWatchedMany, toggleWatched } from '$lib/stores/watched';
	import { firebaseEnabled } from '$lib/firebase';
	import { auth } from '$lib/stores/auth';
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n/messages';

	let { item, onclose }: { item: TimelineItem | null; onclose: () => void } = $props();

	const isWatched = $derived(!!item && isFullyWatched(item, $watched));
	const canTrack = $derived(firebaseEnabled && !!$auth.user);

	// group episodes by season for display
	const seasons = $derived.by(() => {
		if (!item?.isSeries) return [];
		const map = new Map<number, typeof item.episodes>();
		for (const ep of item.episodes) {
			const list = map.get(ep.season) ?? [];
			list.push(ep);
			map.set(ep.season, list);
		}
		return [...map.entries()]
			.sort((a, b) => a[0] - b[0])
			.map(([season, episodes]) => ({ season, episodes }));
	});

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
							onclick={() => setWatchedMany(itemUnits(item!), !isWatched)}
						>
							<Check class="size-4" aria-hidden="true" />
							{item.isSeries
								? `${watchedUnitCount(item, $watched)}/${itemUnits(item).length} ${$t('detail.episodes')}`
								: isWatched
									? $t('watched.unmark')
									: $t('watched.mark')}
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

				{#if item.isSeries && seasons.length}
					<div class="space-y-4">
						{#each seasons as s (s.season)}
							<div>
								<h3 class="mb-2 text-sm font-semibold">
									{$t('detail.season')}
									{s.season}
									<span class="font-normal text-muted-foreground">· {s.episodes.length} {$t('detail.episodes')}</span>
								</h3>
								<ol class="divide-y divide-border rounded-lg border border-border">
									{#each s.episodes as ep (ep.season + '-' + ep.number)}
										{@const key = episodeKey(item.tmdbId, ep.season, ep.number)}
										{@const epWatched = $watched.has(key)}
										<li class="flex items-center gap-3 px-3 py-2 text-sm">
											{#if canTrack}
												<button
													class="grid size-6 shrink-0 place-items-center rounded-full border transition-colors {epWatched
														? 'border-accent bg-accent text-on-accent'
														: 'border-border text-transparent hover:border-accent'}"
													aria-pressed={epWatched}
													aria-label={ep.title}
													onclick={() => toggleWatched(key)}
												>
													<Check class="size-3.5" aria-hidden="true" />
												</button>
											{:else}
												<span class="w-6 shrink-0 tabular-nums text-muted-foreground">{ep.number}</span>
											{/if}
											<span class="flex-1">{ep.number}. {ep.title}</span>
											{#if ep.airDate}
												<span class="hidden shrink-0 text-xs tabular-nums text-muted-foreground sm:block">
													{ep.airDate}
												</span>
											{/if}
											<a
												href={tmdbEpisodeUrl(item.tmdbId, ep.season, ep.number)}
												target="_blank"
												rel="noopener noreferrer"
												class="shrink-0 text-muted-foreground hover:text-accent"
												aria-label="TMDB"
											>
												<ExternalLink class="size-4" aria-hidden="true" />
											</a>
										</li>
									{/each}
								</ol>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
