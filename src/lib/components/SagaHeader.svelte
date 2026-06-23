<script lang="ts">
  let {
    name,
    color = "var(--color-muted-foreground)",
  }: { name: string; phases: number[]; color?: string } = $props();
</script>

<div class="relative -mb-8 mt-16 flex items-center gap-4" aria-label={name}>
  <!-- <div class="h-0.5 flex-1" style="background-color: color-mix(in srgb, {color} 50%, transparent)"></div> -->
  <h2
    class="relative z-10 whitespace-nowrap text-2xl sm:text-3xl flex-1 text-center"
    style="font-family: var(--font-display); font-weight: 700; letter-spacing: 0.01em; color: {color}; background: var(--color-background); padding: 0 1.25rem"
  >
    {name}
  </h2>
  <!-- <div
    class="h-0.5 flex-1"
    style="background-color: color-mix(in srgb, {color} 50%, transparent)"
  ></div> -->
</div>
