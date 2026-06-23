<script lang="ts">
	import { isFullyWatched, sagaOf, type PhaseBand, type TimelineItem } from '$lib/data/timeline';
	import { PHASE_COLORS, SAGAS } from '$lib/data/types';
	import TimelineNode from './TimelineNode.svelte';
	import PhaseHeader from './PhaseHeader.svelte';
	import SagaHeader from './SagaHeader.svelte';
	import EntryDetail from './EntryDetail.svelte';
	import { watched } from '$lib/stores/watched';
	import { firebaseEnabled } from '$lib/firebase';
	import { auth } from '$lib/stores/auth';
	import { locale } from '$lib/stores/locale';
	import { sortMode } from '$lib/stores/sortMode';
	import { reveal } from '$lib/actions/reveal';

	let { bands }: { bands: PhaseBand[] } = $props();
	let active = $state<TimelineItem | null>(null);

	const grouped = $derived($sortMode === 'chronological');
	const showProgress = $derived(firebaseEnabled && !!$auth.user);
	const isItemWatched = (item: TimelineItem) => isFullyWatched(item, $watched);

	function progress(items: TimelineItem[]) {
		const done = items.filter(isItemWatched).length;
		const total = items.length;
		return { done, total, pct: total ? (done / total) * 100 : 0 };
	}

	/** True when this band is the first phase of its saga in the current band list. */
	function isFirstOfSaga(band: PhaseBand, index: number): boolean {
		if (!grouped) return false;
		const saga = sagaOf(band.phase);
		return index === 0 || sagaOf(bands[index - 1].phase) !== saga;
	}
</script>

<div class="relative mx-auto mt-8 max-w-5xl pb-4">
	<!-- One continuous spine behind everything -->
	<div
		class="absolute bottom-0 left-5 w-0.5 -translate-x-1/2 bg-border md:left-1/2 {grouped
			? 'top-20'
			: 'top-2'}"
		aria-hidden="true"
	></div>

	{#each bands as band, bandIdx (band.phase + '-' + band.items[0]?.key)}
		{@const p = progress(band.items)}
		{@const color = grouped ? PHASE_COLORS[band.phase] : 'var(--color-primary)'}
		{@const sagaId = sagaOf(band.phase)}
		{@const saga = SAGAS[sagaId]}
		{@const sagaName = saga[$locale]}
		<section id={grouped ? `phase-${band.phase}` : undefined} class={grouped ? 'scroll-mt-24 pt-12 first:pt-0 lg:pt-16' : ''}>
			{#if grouped}
				{#if isFirstOfSaga(band, bandIdx)}
					<SagaHeader name={sagaName} phases={saga.phases} />
				{/if}
				<PhaseHeader
					phase={band.phase}
					{sagaName}
					{color}
					{showProgress}
					done={p.done}
					total={p.total}
					pct={p.pct}
				/>
			{/if}

			<ol class="space-y-6 lg:space-y-8 {grouped ? 'pt-12 lg:pt-16' : 'pt-2'}">
				{#each band.items as item, i (item.key)}
					{#if !grouped && item.year !== band.items[i - 1]?.year}
						<!-- year marker on the spine (release view) -->
						<li class="relative flex justify-center py-1">
							<span
								class="relative z-10 rounded-full border border-border bg-surface px-3 py-1 text-sm font-bold tabular-nums shadow-md"
							>
								{item.year}
							</span>
						</li>
					{/if}
					<li
						class="relative grid grid-cols-1 md:grid-cols-2"
						use:reveal={{ from: i % 2 === 0 ? 'left' : 'right', delay: Math.min(i, 4) * 40 }}
					>
						<span
							class="absolute left-5 top-1/2 z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 md:left-1/2 lg:size-4"
							style="border-color: {color}; background-color: {isItemWatched(item)
								? color
								: 'var(--color-background)'}"
							aria-hidden="true"
						></span>
						<div
							class="flex pl-12 md:px-10 {i % 2 === 0
								? 'md:col-start-1 md:justify-end'
								: 'md:col-start-2 md:justify-start'}"
						>
							<div class="w-full max-w-sm lg:max-w-md">
								<TimelineNode {item} {color} onopen={(it) => (active = it)} />
							</div>
						</div>
					</li>
				{/each}
			</ol>
		</section>
	{/each}

	<!-- End marker -->
	<div class="relative flex justify-center pt-14 lg:pt-20">
		<div class="relative z-10 rounded-2xl border border-dashed border-border bg-surface px-6 py-4 text-center">
			<span class="text-sm font-semibold text-muted-foreground">To be continued…</span>
		</div>
	</div>
</div>

<EntryDetail item={active} onclose={() => (active = null)} />
