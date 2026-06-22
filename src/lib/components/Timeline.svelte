<script lang="ts">
	import type { PhaseBand, TimelineItem } from '$lib/data/timeline';
	import { PHASE_LABELS, PHASE_COLORS } from '$lib/data/types';
	import TimelineNode from './TimelineNode.svelte';
	import EntryDetail from './EntryDetail.svelte';
	import { watched } from '$lib/stores/watched';
	import { firebaseEnabled } from '$lib/firebase';
	import { auth } from '$lib/stores/auth';
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n/messages';

	let { bands }: { bands: PhaseBand[] } = $props();
	let active = $state<TimelineItem | null>(null);

	const showProgress = $derived(firebaseEnabled && !!$auth.user);
	const isItemWatched = (item: TimelineItem) => item.entryIds.every((id) => $watched.has(id));

	function bandProgress(band: PhaseBand): { done: number; total: number; pct: number } {
		const done = band.items.filter(isItemWatched).length;
		const total = band.items.length;
		return { done, total, pct: total ? (done / total) * 100 : 0 };
	}
</script>

<div class="relative mx-auto max-w-5xl pb-8">
	<!-- Central spine -->
	<div
		class="absolute bottom-0 left-5 top-0 w-0.5 -translate-x-1/2 bg-border md:left-1/2"
		aria-hidden="true"
	></div>

	{#each bands as band (band.phase)}
		{@const p = bandProgress(band)}
		{@const color = PHASE_COLORS[band.phase]}
		<section>
			<!-- Phase milestone (extra breathing room marks the chapter) -->
			<div class="relative z-10 flex flex-col items-center py-16 first:pt-4 lg:py-24">
				<div
					class="w-[min(22rem,90%)] rounded-2xl border-2 bg-surface px-6 py-5 text-center shadow-xl"
					style="border-color: {color}"
				>
					<span
						class="block text-[0.7rem] font-semibold uppercase tracking-[0.35em]"
						style="color: {color}"
					>
						{$t('phase.label')} {band.phase}
					</span>
					<span class="mt-1 block text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
						{PHASE_LABELS[band.phase][$locale]}
					</span>
					{#if showProgress}
						<div class="mt-3 flex items-center gap-2">
							<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
								<div
									class="h-full rounded-full transition-[width] duration-300"
									style="width: {p.pct}%; background-color: {color}"
								></div>
							</div>
							<span class="text-xs tabular-nums text-muted-foreground">{p.done}/{p.total}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Leaves: uniform size, even spacing -->
			<ol class="space-y-6 lg:space-y-8">
				{#each band.items as item, i (item.key)}
					<li class="relative grid grid-cols-1 md:grid-cols-2">
						<!-- dot on the spine, vertically centered to the card -->
						<span
							class="absolute left-5 top-1/2 z-10 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 md:left-1/2 lg:size-4"
							style="border-color: {color}; background-color: {isItemWatched(item)
								? color
								: 'var(--color-background)'}"
							aria-hidden="true"
						></span>
						<div
							class="pl-12 md:px-10 {i % 2 === 0
								? 'md:col-start-1 md:justify-self-end'
								: 'md:col-start-2 md:justify-self-start'}"
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
</div>

<EntryDetail item={active} onclose={() => (active = null)} />
