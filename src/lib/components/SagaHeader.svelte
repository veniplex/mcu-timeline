<script lang="ts">
	let { name, phases }: { name: string; phases: number[] } = $props();
	const first = phases[0];
	const last = phases[phases.length - 1];
</script>

<div class="relative mb-4 mt-2 flex items-center gap-4" aria-label={name}>
	<div class="h-px flex-1 bg-border"></div>
	<div class="text-center">
		<p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
			Phases {first}–{last}
		</p>
		<h2 class="text-lg font-black tracking-tight sm:text-xl">{name}</h2>
	</div>
	<div class="h-px flex-1 bg-border"></div>
</div>
