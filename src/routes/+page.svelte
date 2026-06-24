<script lang="ts">
  import {
    Film,
    Tv,
    LayoutGrid,
    EyeOff,
    Clock,
    CalendarDays,
    ArrowUp,
    ListFilter,
    Check,
  } from "lucide-svelte";
  import { fly } from "svelte/transition";
  import { get } from "svelte/store";
  import Timeline from "$lib/components/Timeline.svelte";
  import {
    buildTimeline,
    isFullyWatched,
    itemUnits,
    watchedUnitCount,
    type PhaseBand,
  } from "$lib/data/timeline";
  import { PHASE_COLORS, SAGAS, CATEGORIES, type Category } from "$lib/data/types";
  import type { MessageKey } from "$lib/i18n/messages";
  import { filters, type MediaFilter } from "$lib/stores/filters";
  import { sortMode } from "$lib/stores/sortMode";
  import { locale } from "$lib/stores/locale";
  import { watched } from "$lib/stores/watched";
  import { firebaseEnabled } from "$lib/firebase";
  import { auth } from "$lib/stores/auth";
  import { t } from "$lib/i18n/messages";

  let scrollY = $state(0);

  function jumpToPhase(phase: number) {
    document
      .getElementById(`phase-${phase}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function backToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Filters live in a persisted store (localStorage + per-user Firestore sync).
  const mediaFilter = $derived($filters.media);
  const hideWatched = $derived($filters.hideWatched);
  const categoryOn = $derived($filters.categories);

  let catOpen = $state(false);
  const activeCount = $derived(CATEGORIES.filter((c) => categoryOn[c]).length);
  const allCategories = $derived(activeCount === CATEGORIES.length);
  const catKey = (c: Category) => `category.${c}` as MessageKey;
  const allCatsOn = () =>
    Object.fromEntries(CATEGORIES.map((c) => [c, true])) as Record<
      Category,
      boolean
    >;

  const setMedia = (m: MediaFilter) =>
    filters.update((s) => ({ ...s, media: m }));
  const toggleHideWatched = () =>
    filters.update((s) => ({ ...s, hideWatched: !s.hideWatched }));
  function toggleCategory(c: Category) {
    filters.update((s) => {
      const on = s.categories[c];
      // Never allow an empty selection — re-selecting the last one resets to all.
      if (on && CATEGORIES.filter((x) => s.categories[x]).length === 1) {
        return { ...s, categories: allCatsOn() };
      }
      return { ...s, categories: { ...s.categories, [c]: !on } };
    });
  }
  const resetCategories = () =>
    filters.update((s) => ({ ...s, categories: allCatsOn() }));

  const signedIn = $derived(firebaseEnabled && !!$auth.user);

  const allBands = $derived(buildTimeline($sortMode, $locale));

  const bands = $derived.by<PhaseBand[]>(() => {
    return allBands
      .map((band) => ({
        phase: band.phase,
        items: band.items.filter((item) => {
          if (mediaFilter === "films" && item.isSeries) return false;
          if (mediaFilter === "series" && !item.isSeries) return false;
          if (!categoryOn[item.category]) return false;
          if (hideWatched && signedIn && isFullyWatched(item, $watched))
            return false;
          return true;
        }),
      }))
      .filter((band) => band.items.length > 0);
  });

  // Progress counts watch UNITS (each series episode counts on its own; movies = 1).
  // Upcoming items can't be watched, so they're excluded from the totals.
  const totalItems = $derived(
    allBands.reduce(
      (sum, band) =>
        sum +
        band.items.reduce(
          (s, i) => s + (i.upcoming ? 0 : itemUnits(i).length),
          0,
        ),
      0,
    ),
  );
  const totalWatched = $derived(
    allBands.reduce(
      (sum, band) =>
        sum +
        band.items.reduce(
          (s, i) => s + (i.upcoming ? 0 : watchedUnitCount(i, $watched)),
          0,
        ),
      0,
    ),
  );
  const watchPct = $derived(totalItems ? (totalWatched / totalItems) * 100 : 0);

  // Filter-aware catalogue stats (counts what's currently displayed).
  const nf = $derived(new Intl.NumberFormat($locale));
  const stats = $derived.by(() => {
    const series = new Set<number>();
    let films = 0;
    let seasons = 0;
    let episodes = 0;
    let minutes = 0;
    for (const band of bands) {
      for (const it of band.items) {
        if (it.isSeries) {
          series.add(it.tmdbId);
          seasons += it.seasons.length || 1;
          episodes += it.episodeCount;
          if (it.runtime) minutes += it.episodeCount * it.runtime;
        } else {
          films++;
          if (it.runtime) minutes += it.runtime;
        }
      }
    }
    return { films, series: series.size, seasons, episodes, minutes };
  });

  // On sign-in, jump to the last watched item in the current timeline order.
  let scrolledForUid: string | null = null;
  $effect(() => {
    if (!signedIn) {
      scrolledForUid = null;
      return;
    }
    const uid = $auth.user?.uid ?? null;
    if (!uid || uid === scrolledForUid) return;
    scrolledForUid = uid; // one-shot per sign-in
    const timer = setTimeout(() => {
      const w = get(watched);
      let lastKey: string | null = null;
      for (const band of bands)
        for (const it of band.items)
          if (watchedUnitCount(it, w) > 0) lastKey = it.key;
      if (!lastKey) return;
      document
        .querySelector(`[data-item-key="${CSS.escape(lastKey)}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 800);
    return () => clearTimeout(timer);
  });

  const mediaFilters: {
    key: MediaFilter;
    label: () => string;
    icon: typeof Film;
  }[] = [
    { key: "all", label: () => $t("filter.all"), icon: LayoutGrid },
    { key: "films", label: () => $t("filter.films"), icon: Film },
    { key: "series", label: () => $t("filter.series"), icon: Tv },
  ];
</script>

<svelte:window
  bind:scrollY
  onclick={(e) => {
    if (!(e.target as Element).closest("[data-cat-dropdown]")) catOpen = false;
  }}
/>

<!-- Sticky progress bar — full-width strip that stays below the nav when scrolling -->
{#if signedIn}
  <div
    class="sticky top-15.5 z-30 -mx-4 bg-background/80 backdrop-blur-md sm:-mx-6"
    aria-label="Watch progress"
  >
    <div class="flex items-center gap-3 px-4 py-2 sm:px-6">
      <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          class="h-full rounded-full bg-accent transition-[width] duration-500"
          style="width: {watchPct}%"
        ></div>
      </div>
      <span class="shrink-0 text-xs tabular-nums text-muted-foreground">
        {$t("watched.progress", { done: totalWatched, total: totalItems })}
      </span>
    </div>
  </div>
{/if}

<!-- Filter row -->
<div class="mb-6 mt-8 flex flex-wrap items-center justify-center gap-3">
  <!-- Sort -->
  <div
    class="flex items-center rounded-full border border-border bg-surface p-0.5 text-sm"
    role="group"
    aria-label={$t("sort.label")}
  >
    <button
      class="flex items-center gap-1.5 rounded-full px-3 py-2 whitespace-nowrap transition-colors {$sortMode ===
      'chronological'
        ? 'bg-primary text-on-primary'
        : 'text-muted-foreground hover:text-foreground'}"
      aria-pressed={$sortMode === "chronological"}
      onclick={() => sortMode.set("chronological")}
    >
      <Clock class="size-4" aria-hidden="true" />
      <span>{$t("sort.chronological")}</span>
    </button>
    <button
      class="flex items-center gap-1.5 rounded-full px-3 py-2 whitespace-nowrap transition-colors {$sortMode ===
      'release'
        ? 'bg-primary text-on-primary'
        : 'text-muted-foreground hover:text-foreground'}"
      aria-pressed={$sortMode === "release"}
      onclick={() => sortMode.set("release")}
    >
      <CalendarDays class="size-4" aria-hidden="true" />
      <span>{$t("sort.release")}</span>
    </button>
  </div>

  <!-- Media type -->
  <div
    class="flex items-center rounded-full border border-border bg-surface p-0.5 text-sm"
  >
    {#each mediaFilters as f (f.key)}
      <button
        class="flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors {mediaFilter ===
        f.key
          ? 'bg-primary text-on-primary'
          : 'text-muted-foreground hover:text-foreground'}"
        aria-pressed={mediaFilter === f.key}
        onclick={() => setMedia(f.key)}
      >
        <f.icon class="size-4" aria-hidden="true" />
        <span>{f.label()}</span>
      </button>
    {/each}
  </div>

  <!-- Category -->
  <div class="relative" data-cat-dropdown>
    <button
      class="flex items-center gap-1.5 rounded-full border px-3 py-2.5 text-sm transition-colors {allCategories
        ? 'border-border bg-surface text-muted-foreground hover:text-foreground'
        : 'border-primary bg-primary text-on-primary'}"
      aria-haspopup="true"
      aria-expanded={catOpen}
      onclick={() => (catOpen = !catOpen)}
    >
      <ListFilter class="size-4" aria-hidden="true" />
      <span
        >{allCategories
          ? $t("filter.categories")
          : $t("filter.categoriesCount", { n: activeCount })}</span
      >
    </button>
    {#if catOpen}
      <div
        class="absolute left-1/2 z-30 mt-2 w-56 -translate-x-1/2 rounded-xl border border-border bg-surface p-1 shadow-lg"
        role="group"
        aria-label={$t("filter.categories")}
      >
        {#each CATEGORIES as c (c)}
          <button
            class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted {categoryOn[
              c
            ]
              ? 'text-foreground font-medium'
              : 'text-muted-foreground'}"
            aria-pressed={categoryOn[c]}
            onclick={() => toggleCategory(c)}
          >
            <span
              class="grid size-4 shrink-0 place-items-center rounded border transition-colors {categoryOn[
                c
              ]
                ? 'border-primary bg-primary text-on-primary'
                : 'border-border'}"
            >
              {#if categoryOn[c]}
                <Check class="size-3" aria-hidden="true" />
              {/if}
            </span>
            {$t(catKey(c))}
          </button>
        {/each}
        {#if !allCategories}
          <button
            class="mt-1 w-full rounded-lg border-t border-border px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
            onclick={resetCategories}
          >
            {$t("filter.allCategories")}
          </button>
        {/if}
      </div>
    {/if}
  </div>

  {#if signedIn}
    <button
      class="flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors {hideWatched
        ? 'border-accent bg-accent text-on-accent'
        : 'border-border bg-surface text-muted-foreground hover:text-foreground'}"
      aria-pressed={hideWatched}
      onclick={toggleHideWatched}
    >
      <EyeOff class="size-4" aria-hidden="true" />
      <span>{$t("filter.hideWatched")}</span>
    </button>
  {/if}
</div>

<!-- Filter-aware catalogue stats -->
<p
  class="-mt-3 mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-muted-foreground tabular-nums"
>
  {#each [{ n: stats.films, label: $t("stats.films") }, { n: stats.series, label: $t("stats.series") }, { n: stats.seasons, label: $t("stats.seasons") }, { n: stats.episodes, label: $t("stats.episodes") }, { n: stats.minutes, label: $t("stats.runtime") }] as stat, i (stat.label)}
    {#if i > 0}<span class="opacity-40" aria-hidden="true">·</span>{/if}
    <span
      ><span class="font-semibold text-foreground">{nf.format(stat.n)}</span>
      {stat.label}</span
    >
  {/each}
</p>

<!-- Phase navigation tab bar — only in story order mode -->
{#if $sortMode === "chronological"}
  <div class="overflow-hidden rounded-2xl border border-border bg-surface">
    <div class="grid grid-cols-2 divide-x divide-border">
      {#each Object.entries(SAGAS) as [sagaId, saga]}
        <div>
          <div
            class="border-b border-border px-4 py-2.5 text-center"
            style="background-color: color-mix(in srgb, {saga.color} 8%, var(--color-surface))"
          >
            <span
              class="text-sm font-semibold tracking-wide"
              style="font-family: var(--font-display); color: {saga.color}"
              >{saga[$locale]}</span
            >
          </div>
          <div class="flex gap-1 p-2">
            {#each saga.phases as phase}
              <button
                class="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition-colors hover:bg-muted sm:text-sm border"
                style="color: {PHASE_COLORS[phase]}"
                onclick={() => jumpToPhase(phase)}
              >
                <span class="hidden sm:inline">{$t("phase.label")} {phase}</span
                >
                <span class="sm:hidden">{phase}</span>
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

{#if bands.length}
  <Timeline {bands} />
{:else}
  <div
    class="grid place-items-center rounded-xl border border-dashed border-border bg-surface/50 px-6 py-20 text-center"
  >
    <h2 class="text-lg font-semibold">{$t("empty.title")}</h2>
    <p class="mt-1 text-sm text-muted-foreground">{$t("empty.body")}</p>
  </div>
{/if}

<!-- Back to top -->
{#if scrollY > 500}
  <button
    in:fly={{ y: 12, duration: 200 }}
    out:fly={{ y: 12, duration: 150 }}
    class="fixed z-40 grid size-14 place-items-center rounded-full border border-border bg-surface/80 backdrop-blur-md shadow-lg transition-colors hover:bg-muted"
    style="bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px)); right: calc(1.5rem + env(safe-area-inset-right, 0px))"
    aria-label="Back to top"
    onclick={backToTop}
  >
    <ArrowUp class="size-5 text-muted-foreground" aria-hidden="true" />
  </button>
{/if}
