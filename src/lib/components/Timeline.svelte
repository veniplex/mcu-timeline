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

<div class="relative mt-8 pb-4">
	<!-- One continuous spine behind everything -->
	<div
		class="absolute bottom-0 left-5 w-px -translate-x-1/2 md:left-1/2 md:w-0.5 {grouped ? 'top-20' : 'top-2'}"
		style={grouped
			? `background: linear-gradient(to bottom, ${PHASE_COLORS[1]}99, ${PHASE_COLORS[2]}99, ${PHASE_COLORS[3]}99, ${PHASE_COLORS[4]}99, ${PHASE_COLORS[5]}99, ${PHASE_COLORS[6]}99)`
			: 'background-color: var(--color-border)'}
		aria-hidden="true"
	></div>

	{#each bands as band, bandIdx (band.phase + '-' + band.items[0]?.key)}
		{@const p = progress(band.items)}
		{@const color = grouped ? PHASE_COLORS[band.phase] : 'var(--color-muted-foreground)'}
		{@const sagaId = sagaOf(band.phase)}
		{@const saga = SAGAS[sagaId]}
		{@const sagaName = saga[$locale]}
		<section id={grouped ? `phase-${band.phase}` : undefined} class={grouped ? 'scroll-mt-24 pt-16 first:pt-0 lg:pt-24' : ''}>
			{#if grouped}
				{#if isFirstOfSaga(band, bandIdx)}
					<SagaHeader name={sagaName} phases={saga.phases} color={saga.color} />
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

			<ol class="space-y-8 lg:space-y-12 {grouped ? 'pt-14 lg:pt-20' : 'pt-2'}">
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
							class="flex pl-12 {i % 2 === 0
								? 'md:col-start-1 md:pl-0 md:pr-10 lg:pr-14'
								: 'md:col-start-2 md:pl-10 lg:pl-14 md:pr-0'}"
						>
							<div class="w-full">
								<TimelineNode {item} {color} onopen={(it) => (active = it)} />
							</div>
						</div>
					</li>
				{/each}
			</ol>
		</section>
	{/each}

	<!-- End marker — tinted with Phase 6 color to feel like a continuation of the final phase -->
	<div class="relative flex justify-center pt-14 lg:pt-20">
		<div
			class="relative z-10 rounded-2xl border px-6 py-4 text-center"
			style="border-color: color-mix(in srgb, {PHASE_COLORS[6]} 35%, transparent); background-color: color-mix(in srgb, {PHASE_COLORS[6]} 5%, var(--color-surface))"
		>
			<span class="text-sm font-semibold" style="color: color-mix(in srgb, {PHASE_COLORS[6]} 70%, var(--color-muted-foreground))">To be continued…</span>
		</div>
	</div>
</div>

<EntryDetail item={active} onclose={() => (active = null)} />
