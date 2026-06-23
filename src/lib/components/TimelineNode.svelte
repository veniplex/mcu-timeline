<script lang="ts">
  import { Check, Film, Tv, Clock, Star } from "lucide-svelte";
  import { posterUrl } from "$lib/tmdb";
  import {
    isFullyWatched,
    watchedUnitCount,
    itemUnits,
    type TimelineItem,
  } from "$lib/data/timeline";
  import { watched, setWatchedMany } from "$lib/stores/watched";
  import { firebaseEnabled } from "$lib/firebase";
  import { auth } from "$lib/stores/auth";
  import { t } from "$lib/i18n/messages";

  let {
    item,
    color,
    onopen,
  }: {
    item: TimelineItem;
    color: string;
    onopen: (item: TimelineItem) => void;
  } = $props();

  const isWatched = $derived(isFullyWatched(item, $watched));
  const done = $derived(watchedUnitCount(item, $watched));
  const total = $derived(itemUnits(item).length);
  const isPartial = $derived(done > 0 && !isWatched);
  const canTrack = $derived(firebaseEnabled && !!$auth.user);
  const poster = $derived(posterUrl(item.poster, "w342"));

  // Show the arc-progress ring only when there is partial or full progress on a series
  const showRing = $derived(item.isSeries && total > 1 && done > 0);

  // Season label: "S1", "S1–3", etc.
  const seasonLabel = $derived.by(() => {
    if (!item.isSeries || item.seasons.length === 0) return null;
    if (item.seasons.length === 1) return `S${item.seasons[0]}`;
    const min = Math.min(...item.seasons);
    const max = Math.max(...item.seasons);
    return `S${min}–${max}`;
  });

  // Ring geometry
  const R = 9;
  const C = 2 * Math.PI * R;
  const dashoffset = $derived(C * (1 - (total ? done / total : 0)));

  function toggle(e: MouseEvent) {
    e.stopPropagation();
    setWatchedMany(itemUnits(item), !isWatched);
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onopen(item);
    }
  }
</script>

<div
  class="group relative flex h-40 w-full cursor-pointer overflow-hidden rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-(--card-hover-bg) sm:h-52 lg:h-64 {isWatched
    ? 'border-accent/50'
    : 'border-border'}"
  style="
		--card-bg: color-mix(in srgb, {isWatched
    ? 'var(--color-accent)'
    : color} 10%, var(--color-surface));
		--card-hover-bg: color-mix(in srgb, {isWatched
    ? 'var(--color-accent)'
    : color} 18%, var(--color-surface));
		background-color: var(--card-bg);
	"
  role="button"
  tabindex="0"
  aria-label={item.title}
  onclick={() => onopen(item)}
  onkeydown={onKey}
>
  <div class="relative h-full shrink-0 bg-muted" style="aspect-ratio: 2/3">
    {#if poster}
      <img
        src={poster}
        alt=""
        loading="lazy"
        class="h-full w-full object-cover {isWatched ? '' : 'opacity-95'}"
      />
    {:else}
      <div class="grid h-full w-full place-items-center text-muted-foreground">
        {#if item.isSeries}<Tv class="size-6" />{:else}<Film
            class="size-6"
          />{/if}
      </div>
    {/if}
  </div>

  <div class="flex min-w-0 flex-1 flex-col gap-1 p-3 lg:p-4">
    <h3
      class="line-clamp-2 text-sm font-bold leading-tight lg:text-base xl:text-lg"
    >
      {item.title}
    </h3>
    <div
      class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground tabular-nums lg:text-sm"
    >
      {#if item.year}<span>{item.year}</span>{/if}
      {#if item.isSeries}
        <span class="inline-flex shrink-0 items-center gap-1 whitespace-nowrap">
          <Tv class="size-3.5 shrink-0" />
          {#if seasonLabel}<span>{seasonLabel}</span>{/if}
          <span>{item.episodeCount} ep</span>
        </span>
      {:else if item.runtime}
        <span class="inline-flex items-center gap-1">
          <Clock class="size-3.5" />{item.runtime}m
        </span>
      {/if}
    </div>

    <!-- Ratings badges -->
    {#if item.ratings?.imdb || item.ratings?.rt}
      <div
        class="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground"
      >
        {#if item.ratings?.imdb}
          <span class="inline-flex items-center gap-1">
            <Star
              class="size-3 fill-[#f5c518] text-[#f5c518]"
              aria-hidden="true"
            />
            <span class="tabular-nums font-medium">{item.ratings.imdb}</span>
          </span>
        {/if}
        {#if item.ratings?.rt}
          <span class="inline-flex items-center gap-1">
            <span aria-hidden="true" class="leading-none">🍅</span>
            <span class="tabular-nums font-medium">{item.ratings.rt}%</span>
          </span>
        {/if}
      </div>
    {/if}

    {#if item.overview}
      <p
        class="mt-1 line-clamp-3 text-xs leading-snug text-muted-foreground max-lg:hidden lg:text-sm"
      >
        {item.overview}
      </p>
    {/if}

    {#if item.eraTag}
      <span
        class="mt-auto w-fit rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
      >
        {item.eraTag}
      </span>
    {/if}

    {#if canTrack}
      {#if showRing}
        <!-- Series with progress: arc ring fills with episodes watched -->
        <button
          class="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full bg-surface/90 lg:size-9"
          aria-pressed={isWatched}
          aria-label="{done}/{total} {$t('detail.episodes')}"
          title="{done}/{total}"
          onclick={toggle}
        >
          <svg viewBox="0 0 24 24" class="size-8 -rotate-90 lg:size-9">
            <circle
              cx="12"
              cy="12"
              r={R}
              fill="none"
              stroke="var(--color-muted)"
              stroke-width="3"
            />
            <circle
              cx="12"
              cy="12"
              r={R}
              fill="none"
              stroke="var(--color-accent)"
              stroke-width="3"
              stroke-linecap="round"
              stroke-dasharray={C}
              stroke-dashoffset={dashoffset}
              style="transition: stroke-dashoffset 400ms cubic-bezier(0.22, 1, 0.36, 1)"
            />
          </svg>
          {#if isWatched}
            <Check class="absolute size-4 text-accent" aria-hidden="true" />
          {/if}
        </button>
      {:else}
        <!-- Movie or series with no progress: plain check toggle (consistent) -->
        <button
          class="absolute bottom-2 right-2 grid size-7 place-items-center rounded-full border transition-colors lg:size-8 {isWatched
            ? 'border-accent bg-accent text-on-accent'
            : 'border-border bg-surface/90 text-muted-foreground hover:text-foreground'}"
          aria-pressed={isWatched}
          aria-label={isWatched ? $t("watched.unmark") : $t("watched.mark")}
          onclick={toggle}
        >
          <Check class="size-4" aria-hidden="true" />
        </button>
      {/if}
    {/if}
  </div>
</div>
