<script lang="ts">
	let { name }: { name: string; phases: number[] } = $props();
</script>

<div class="relative mb-4 mt-2 flex items-center gap-4" aria-label={name}>
	<div class="h-px flex-1 bg-muted-foreground/20"></div>
	<h2 class="text-lg font-black tracking-tight sm:text-xl">{name}</h2>
	<div class="h-px flex-1 bg-muted-foreground/20"></div>
</div>
