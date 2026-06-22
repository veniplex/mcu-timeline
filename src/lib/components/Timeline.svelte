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

	function bandProgress(band: PhaseBand): { done: number; total: number } {
		let done = 0;
		for (const item of band.items) {
			if (item.entryIds.every((id) => $watched.has(id))) done++;
		}
		return { done, total: band.items.length };
	}
</script>

<div class="space-y-12">
	{#each bands as band (band.phase + '-' + band.items[0].key)}
		{@const p = bandProgress(band)}
		<section>
			<div
				class="sticky top-16 z-30 -mx-4 mb-5 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6"
			>
				<span class="size-2.5 rounded-full bg-primary" aria-hidden="true"></span>
				<h2 class="text-lg font-bold tracking-tight">
					{$t('phase.label')} {band.phase}
					<span class="font-normal text-muted-foreground">· {PHASE_LABELS[band.phase][$locale]}</span>
				</h2>
				{#if showProgress}
					<div class="ml-auto flex items-center gap-2">
						<span class="text-xs tabular-nums text-muted-foreground">{p.done}/{p.total}</span>
						<div class="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
							<div
								class="h-full rounded-full bg-accent transition-[width] duration-300"
								style="width: {p.total ? (p.done / p.total) * 100 : 0}%"
							></div>
						</div>
					</div>
				{/if}
			</div>

			<div class="relative pl-4">
				<div class="absolute bottom-2 left-0 top-2 w-px bg-border" aria-hidden="true"></div>
				<div class="flex flex-wrap gap-4">
					{#each band.items as item (item.key)}
						<TimelineNode {item} onopen={(i) => (active = i)} />
					{/each}
				</div>
			</div>
		</section>
	{/each}
</div>

<EntryDetail item={active} onclose={() => (active = null)} />
