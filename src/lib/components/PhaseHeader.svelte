<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n/messages';

	let {
		phase,
		label,
		color,
		showProgress,
		done,
		total,
		pct
	}: {
		phase: number;
		label: string;
		color: string;
		showProgress: boolean;
		done: number;
		total: number;
		pct: number;
	} = $props();

	let stuck = $state(false);
	let sentinel: HTMLElement;

	onMount(() => {
		const io = new IntersectionObserver(([e]) => (stuck = !e.isIntersecting), {
			rootMargin: '-64px 0px 0px 0px',
			threshold: 0
		});
		io.observe(sentinel);
		return () => io.disconnect();
	});
</script>

<!-- sentinel: when it scrolls under the nav, the header is "stuck" -->
<div bind:this={sentinel} class="h-px w-px" aria-hidden="true"></div>

<div class="sticky top-14 z-30 flex justify-center">
	<div
		class="overflow-hidden border-2 bg-surface/95 text-center shadow-xl backdrop-blur transition-all duration-300 {stuck
			? 'flex items-center gap-3 rounded-full px-5 py-2'
			: 'w-[min(22rem,90%)] rounded-2xl px-6 py-5'}"
		style="border-color: {color}"
	>
		<span
			class="font-semibold uppercase tracking-[0.35em] transition-all {stuck
				? 'text-[0.65rem]'
				: 'block text-[0.7rem]'}"
			style="color: {color}"
		>
			{$t('phase.label')}
			{phase}
		</span>
		<span
			class="font-black tracking-tight transition-all {stuck
				? 'text-base'
				: 'mt-1 block text-2xl sm:text-3xl lg:text-4xl'}"
		>
			{label}
		</span>
		{#if showProgress && !stuck}
			<div class="mt-3 flex items-center gap-2">
				<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
					<div
						class="h-full rounded-full transition-[width] duration-300"
						style="width: {pct}%; background-color: {color}"
					></div>
				</div>
				<span class="text-xs tabular-nums text-muted-foreground">{done}/{total}</span>
			</div>
		{:else if showProgress && stuck}
			<span class="text-xs tabular-nums text-muted-foreground">{done}/{total}</span>
		{/if}
	</div>
</div>
