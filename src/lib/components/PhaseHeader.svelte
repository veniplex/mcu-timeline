<script lang="ts">
  import { onMount } from "svelte";
  import { t } from "$lib/i18n/messages";

  let {
    phase,
    sagaName,
    color,
    showProgress,
    done,
    total,
    pct,
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
      rootMargin: "-76px 0px 0px 0px",
      threshold: 0,
    });
    io.observe(sentinel);
    return () => io.disconnect();
  });
</script>

<!-- sentinel: when it scrolls under the nav, the header is "stuck" -->
<div bind:this={sentinel} class="h-px w-px" aria-hidden="true"></div>

<div
  class="sticky z-20 flex justify-center mt-16 {showProgress
    ? 'top-24'
    : 'top-16'}"
>
  <div
    class="border-2 bg-surface/80 backdrop-blur-md rounded-full {stuck
      ? 'shadow-md'
      : 'shadow-lg'}"
    style="
			border-color: {color};
			width: min(22rem, 90vw);
			padding: {stuck ? '0' : '1rem 1.5rem'};
			transition: border-radius 350ms cubic-bezier(0.22,1,0.36,1),
			            padding 350ms cubic-bezier(0.22,1,0.36,1);
			animation: phaseEnter 500ms cubic-bezier(0.22,1,0.36,1) both;
		"
  >
    <div style="display:grid">
      <!-- Full card: phase label + number -->
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
        <span
          class="block text-2xl sm:text-3xl font-semibold"
          style="font-family: var(--font-display); letter-spacing: -0.02em"
        >
          {$t("phase.label")}{" "}{phase}
        </span>
        {#if showProgress}
          <div class="mt-2 flex items-center gap-2">
            <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full transition-[width] duration-300"
                style="width: {pct}%; background-color: {color}"
              ></div>
            </div>
            <span class="text-sm tabular-nums text-muted-foreground"
              >{done}/{total}</span
            >
          </div>
        {/if}
      </div>

      <!-- Compact sticky pill -->
      <div
        class="flex flex-col items-center justify-center gap-0.5"
        style="
					grid-area: 1/1;
					opacity: {stuck ? 1 : 0};
					transition: opacity {stuck ? '200ms 150ms' : '150ms'};
					pointer-events: {stuck ? 'auto' : 'none'};
					visibility: {stuck ? 'visible' : 'hidden'};
				"
      >
        <span
          class="text-base font-semibold uppercase tracking-[0.12em] text-muted-foreground"
        >
          {sagaName}
        </span>
        <div class="flex items-center gap-1.5">
          <!-- <span
            class="size-1.5 shrink-0 rounded-full"
            style="background-color: {color}"
          ></span> -->
          <span
            class="text-base font-semibold tracking-tight"
            style="font-family: var(--font-display)"
            >{$t("phase.label")} {phase}</span
          >
          {#if showProgress}
            <span class="text-sm tabular-nums text-muted-foreground opacity-70"
              >· {done}/{total}</span
            >
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
