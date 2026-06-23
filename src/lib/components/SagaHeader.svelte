<script lang="ts">
	let { name, color = 'var(--color-muted-foreground)' }: { name: string; phases: number[]; color?: string } = $props();
</script>

<div class="relative mb-4 mt-2 flex items-center gap-4" aria-label={name}>
	<div class="h-px flex-1" style="background-color: color-mix(in srgb, {color} 30%, transparent)"></div>
	<h2 class="text-lg sm:text-xl text-wrap-balance" style="font-family: var(--font-display); font-weight: 700; letter-spacing: 0.01em; color: {color}">{name}</h2>
	<div class="h-px flex-1" style="background-color: color-mix(in srgb, {color} 30%, transparent)"></div>
</div>
