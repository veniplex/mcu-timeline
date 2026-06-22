<script lang="ts">
	import type { PhaseBand, TimelineItem } from '$lib/data/timeline';
	import { PHASE_LABELS } from '$lib/data/types';
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
		class="absolute bottom-0 left-4 top-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/50 via-border to-primary/50 md:left-1/2"
		aria-hidden="true"
	></div>

	{#each bands as band (band.phase)}
		{@const p = bandProgress(band)}
		<section>
			<!-- Phase milestone -->
			<div class="relative z-10 flex flex-col items-center py-8 first:pt-2">
				<div
					class="w-[min(20rem,90%)] rounded-2xl border border-accent/40 bg-surface px-6 py-4 text-center shadow-lg ring-1 ring-black/5"
				>
					<span class="block text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent">
						{$t('phase.label')} {band.phase}
					</span>
					<span class="mt-0.5 block text-2xl font-black tracking-tight sm:text-3xl">
						{PHASE_LABELS[band.phase][$locale]}
					</span>
					{#if showProgress}
						<div class="mt-3 flex items-center gap-2">
							<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
								<div
									class="h-full rounded-full bg-accent transition-[width] duration-300"
									style="width: {p.pct}%"
								></div>
							</div>
							<span class="text-xs tabular-nums text-muted-foreground">{p.done}/{p.total}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Leaves -->
			<ol class="space-y-5 md:space-y-6">
				{#each band.items as item, i (item.key)}
					<li class="relative grid grid-cols-1 md:grid-cols-2">
						<!-- dot on the spine -->
						<span
							class="absolute left-4 top-6 z-10 size-3 -translate-x-1/2 rounded-full border-2 md:left-1/2 {isItemWatched(
								item
							)
								? 'border-accent bg-accent'
								: 'border-primary bg-background'}"
							aria-hidden="true"
						></span>
						<div
							class="pl-10 md:px-8 {i % 2 === 0
								? 'md:col-start-1 md:justify-self-end'
								: 'md:col-start-2 md:justify-self-start'}"
						>
							<div class="w-full max-w-sm">
								<TimelineNode {item} onopen={(it) => (active = it)} />
							</div>
						</div>
					</li>
				{/each}
			</ol>
		</section>
	{/each}
</div>

<EntryDetail item={active} onclose={() => (active = null)} />
