<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n/messages';

	let {
		phase,
		sagaName,
		color,
		showProgress,
		done,
		total,
		pct
	}: {
		phase: number;
		sagaName: string;
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
			rootMargin: '-76px 0px 0px 0px',
			threshold: 0
		});
		io.observe(sentinel);
		return () => io.disconnect();
	});
</script>

<!-- sentinel: when it scrolls under the nav, the header is "stuck" -->
<div bind:this={sentinel} class="h-px w-px" aria-hidden="true"></div>

<div class="sticky top-[72px] z-30 flex justify-center">
	<div
		class="border-2 bg-surface/95 backdrop-blur {stuck ? 'shadow-md' : 'shadow-xl'}"
		style="
			border-color: {color};
			border-radius: {stuck ? '9999px' : '1rem'};
			width: min(22rem, 90vw);
			padding: {stuck ? '0.35rem 1.25rem' : '1.25rem 1.5rem'};
			transition: border-radius 350ms cubic-bezier(0.22,1,0.36,1),
			            padding 350ms cubic-bezier(0.22,1,0.36,1);
			animation: phaseEnter 500ms cubic-bezier(0.22,1,0.36,1) both;
		"
	>
		<div style="display:grid">
			<!-- Full card: just the phase number, big + bold. Saga shown by SagaHeader banner above. -->
			<div
				class="text-center"
				style="
					grid-area: 1/1;
					opacity: {stuck ? 0 : 1};
					transition: opacity {stuck ? '150ms' : '200ms 150ms'};
					pointer-events: {stuck ? 'none' : 'auto'};
					visibility: {stuck ? 'hidden' : 'visible'};
				"
			>
				<div class="flex items-center justify-center gap-1.5">
					<span class="size-2 shrink-0 rounded-full" style="background-color: {color}"></span>
				</div>
				<span class="mt-2 block text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
					{$t('phase.label')} {phase}
				</span>
				{#if showProgress}
					<div class="mt-3 flex items-center gap-2">
						<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
							<div
								class="h-full rounded-full transition-[width] duration-300"
								style="width: {pct}%; background-color: {color}"
							></div>
						</div>
						<span class="text-xs tabular-nums text-muted-foreground">{done}/{total}</span>
					</div>
				{/if}
			</div>

			<!-- Compact sticky pill: saga name (small) stacked above phase (bold) -->
			<div
				class="flex flex-col items-center justify-center gap-0"
				style="
					grid-area: 1/1;
					opacity: {stuck ? 1 : 0};
					transition: opacity {stuck ? '200ms 150ms' : '150ms'};
					pointer-events: {stuck ? 'auto' : 'none'};
					visibility: {stuck ? 'visible' : 'hidden'};
				"
			>
				<span class="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
					{sagaName}
				</span>
				<div class="flex items-center gap-1.5">
					<span class="size-1.5 shrink-0 rounded-full" style="background-color: {color}"></span>
					<span class="text-sm font-bold tracking-tight">{$t('phase.label')} {phase}</span>
					{#if showProgress}
						<span class="text-xs tabular-nums text-muted-foreground opacity-70">· {done}/{total}</span>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
