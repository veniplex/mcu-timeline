<script lang="ts">
	import type { PhaseBand, TimelineItem } from '$lib/data/timeline';
	import { PHASE_LABELS, PHASE_COLORS } from '$lib/data/types';
	import TimelineNode from './TimelineNode.svelte';
	import PhaseHeader from './PhaseHeader.svelte';
	import EntryDetail from './EntryDetail.svelte';
	import { watched } from '$lib/stores/watched';
	import { firebaseEnabled } from '$lib/firebase';
	import { auth } from '$lib/stores/auth';
	import { locale } from '$lib/stores/locale';
	import { sortMode } from '$lib/stores/sortMode';
	import { t } from '$lib/i18n/messages';

	let { bands }: { bands: PhaseBand[] } = $props();
	let active = $state<TimelineItem | null>(null);

	const grouped = $derived($sortMode === 'chronological');
	const showProgress = $derived(firebaseEnabled && !!$auth.user);
	const isItemWatched = (item: TimelineItem) => item.entryIds.every((id) => $watched.has(id));

	function progress(items: TimelineItem[]) {
		const done = items.filter(isItemWatched).length;
		const total = items.length;
		return { done, total, pct: total ? (done / total) * 100 : 0 };
	}
</script>

<div class="relative mx-auto max-w-5xl pb-4">
	{#each bands as band (band.phase + '-' + band.items[0]?.key)}
		{@const p = progress(band.items)}
		{@const color = grouped ? PHASE_COLORS[band.phase] : 'var(--color-primary)'}
		<section class={grouped ? 'pt-12 first:pt-2 lg:pt-16' : ''}>
			{#if grouped}
				<PhaseHeader
					phase={band.phase}
					label={PHASE_LABELS[band.phase][$locale]}
					{color}
					{showProgress}
					done={p.done}
					total={p.total}
					pct={p.pct}
				/>
			{/if}

			<!-- Leaves on a centered spine -->
			<ol class="relative space-y-6 lg:space-y-8 {grouped ? 'pt-12 lg:pt-16' : 'pt-2'}">
				<div
					class="absolute bottom-0 left-5 top-0 w-0.5 -translate-x-1/2 bg-border md:left-1/2"
					aria-hidden="true"
				></div>
				{#each band.items as item, i (item.key)}
					<li class="relative grid grid-cols-1 md:grid-cols-2">
						<span
							class="absolute left-5 top-1/2 z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 md:left-1/2 lg:size-4"
							style="border-color: {grouped
								? PHASE_COLORS[band.phase]
								: 'var(--color-primary)'}; background-color: {isItemWatched(item)
								? grouped
									? PHASE_COLORS[band.phase]
									: 'var(--color-primary)'
								: 'var(--color-background)'}"
							aria-hidden="true"
						></span>
						<div
							class="flex pl-12 md:px-10 {i % 2 === 0
								? 'md:col-start-1 md:justify-end'
								: 'md:col-start-2 md:justify-start'}"
						>
							<div class="w-full max-w-sm lg:max-w-md">
								<TimelineNode {item} color={grouped ? PHASE_COLORS[band.phase] : 'var(--color-primary)'} onopen={(it) => (active = it)} />
							</div>
						</div>
					</li>
				{/each}
			</ol>
		</section>
	{/each}

	<!-- End marker -->
	<div class="flex justify-center pt-14 lg:pt-20">
		<div
			class="rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-4 text-center"
		>
			<span class="text-sm font-semibold text-muted-foreground">{$t('timeline.end')}</span>
		</div>
	</div>
</div>

<EntryDetail item={active} onclose={() => (active = null)} />
