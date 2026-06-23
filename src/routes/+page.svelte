<script lang="ts">
	import { Film, Tv, LayoutGrid, EyeOff, Clock, CalendarDays } from 'lucide-svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import { buildTimeline, isFullyWatched, type PhaseBand } from '$lib/data/timeline';
	import { sortMode } from '$lib/stores/sortMode';
	import { locale } from '$lib/stores/locale';
	import { watched } from '$lib/stores/watched';
	import { firebaseEnabled } from '$lib/firebase';
	import { auth } from '$lib/stores/auth';
	import { t } from '$lib/i18n/messages';

	type MediaFilter = 'all' | 'films' | 'series';
	let mediaFilter = $state<MediaFilter>('all');
	let hideWatched = $state(false);

	const signedIn = $derived(firebaseEnabled && !!$auth.user);

	const allBands = $derived(buildTimeline($sortMode, $locale));

	const bands = $derived.by<PhaseBand[]>(() => {
		return allBands
			.map((band) => ({
				phase: band.phase,
				items: band.items.filter((item) => {
					if (mediaFilter === 'films' && item.isSeries) return false;
					if (mediaFilter === 'series' && !item.isSeries) return false;
					if (hideWatched && signedIn && isFullyWatched(item, $watched))
						return false;
					return true;
				})
			}))
			.filter((band) => band.items.length > 0);
	});

	const totalItems = $derived(allBands.reduce((sum, band) => sum + band.items.length, 0));
	const totalWatched = $derived(
		allBands.reduce(
			(sum, band) => sum + band.items.filter((i) => isFullyWatched(i, $watched)).length,
			0
		)
	);

	const filters: { key: MediaFilter; label: () => string; icon: typeof Film }[] = [
		{ key: 'all', label: () => $t('filter.all'), icon: LayoutGrid },
		{ key: 'films', label: () => $t('filter.films'), icon: Film },
		{ key: 'series', label: () => $t('filter.series'), icon: Tv }
	];
</script>

<section class="mb-8">
	<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{$t('app.title')}</h1>
	<p class="mt-2 max-w-prose text-muted-foreground">{$t('app.tagline')}</p>

	{#if signedIn}
		<div class="mt-4 flex max-w-md items-center gap-3">
			<div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
				<div
					class="h-full rounded-full bg-accent transition-[width] duration-300"
					style="width: {totalItems ? (totalWatched / totalItems) * 100 : 0}%"
				></div>
			</div>
			<span class="shrink-0 text-sm tabular-nums text-muted-foreground">
				{$t('watched.progress', { done: totalWatched, total: totalItems })}
			</span>
		</div>
	{:else if firebaseEnabled}
		<p class="mt-3 text-sm text-muted-foreground">{$t('auth.trackPrompt')}</p>
	{/if}
</section>

<div class="mb-8 flex flex-wrap items-center gap-3">
	<!-- Sort -->
	<div
		class="flex items-center rounded-full border border-border bg-surface p-0.5 text-sm"
		role="group"
		aria-label={$t('sort.label')}
	>
		<button
			class="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors {$sortMode ===
			'chronological'
				? 'bg-primary text-on-primary'
				: 'text-muted-foreground hover:text-foreground'}"
			aria-pressed={$sortMode === 'chronological'}
			onclick={() => sortMode.set('chronological')}
		>
			<Clock class="size-4" aria-hidden="true" />
			<span>{$t('sort.chronological')}</span>
		</button>
		<button
			class="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors {$sortMode ===
			'release'
				? 'bg-primary text-on-primary'
				: 'text-muted-foreground hover:text-foreground'}"
			aria-pressed={$sortMode === 'release'}
			onclick={() => sortMode.set('release')}
		>
			<CalendarDays class="size-4" aria-hidden="true" />
			<span>{$t('sort.release')}</span>
		</button>
	</div>

	<!-- Media type -->
	<div class="flex items-center rounded-full border border-border bg-surface p-0.5 text-sm">
		{#each filters as f (f.key)}
			<button
				class="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors {mediaFilter ===
				f.key
					? 'bg-primary text-on-primary'
					: 'text-muted-foreground hover:text-foreground'}"
				aria-pressed={mediaFilter === f.key}
				onclick={() => (mediaFilter = f.key)}
			>
				<f.icon class="size-4" aria-hidden="true" />
				<span>{f.label()}</span>
			</button>
		{/each}
	</div>

	{#if signedIn}
		<button
			class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors {hideWatched
				? 'border-accent bg-accent text-on-accent'
				: 'border-border bg-surface text-muted-foreground hover:text-foreground'}"
			aria-pressed={hideWatched}
			onclick={() => (hideWatched = !hideWatched)}
		>
			<EyeOff class="size-4" aria-hidden="true" />
			<span>{$t('filter.hideWatched')}</span>
		</button>
	{/if}
</div>

{#if bands.length}
	<Timeline {bands} />
{:else}
	<div
		class="grid place-items-center rounded-xl border border-dashed border-border bg-surface/50 px-6 py-20 text-center"
	>
		<h2 class="text-lg font-semibold">{$t('empty.title')}</h2>
		<p class="mt-1 text-sm text-muted-foreground">{$t('empty.body')}</p>
	</div>
{/if}
