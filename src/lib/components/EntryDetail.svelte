<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import {
    X,
    Check,
    Film,
    Tv,
    ExternalLink,
    Star,
    Database,
    CalendarClock,
  } from "lucide-svelte";
  import RottenTomato from "./RottenTomato.svelte";
  import {
    backdropUrl,
    posterUrl,
    tmdbPageUrl,
    imdbUrl,
    rtUrl,
    rtEpisodeUrl,
    providerLogoUrl,
  } from "$lib/tmdb";
  import {
    episodeKey,
    itemUnits,
    isFullyWatched,
    watchedUnitCount,
    itemWatchedDate,
    formatWatchedDate,
    sagaOf,
    type TimelineItem,
  } from "$lib/data/timeline";
  import { SAGAS } from "$lib/data/types";
  import {
    watched,
    watchedAt,
    setWatchedMany,
    toggleWatched,
  } from "$lib/stores/watched";
  import { firebaseEnabled } from "$lib/firebase";
  import { auth } from "$lib/stores/auth";
  import { locale } from "$lib/stores/locale";
  import { t } from "$lib/i18n/messages";

  let { item, onclose }: { item: TimelineItem | null; onclose: () => void } =
    $props();

  const isWatched = $derived(!!item && isFullyWatched(item, $watched));
  const watchedDate = $derived(
    item && isWatched ? itemWatchedDate(item, $watchedAt) : null,
  );
  const canTrack = $derived(firebaseEnabled && !!$auth.user);

  // Scroll lock: prevent body scroll while modal is open
  $effect(() => {
    if (!browser) return;
    if (item) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    };
  });

  // Group episodes by season for display
  const seasons = $derived.by(() => {
    if (!item?.isSeries) return [];
    const map = new Map<number, typeof item.episodes>();
    for (const ep of item.episodes) {
      const list = map.get(ep.season) ?? [];
      list.push(ep);
      map.set(ep.season, list);
    }
    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([season, episodes]) => ({ season, episodes }));
  });

  const sagaName = $derived(item ? SAGAS[sagaOf(item.phase)][$locale] : "");

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") onclose();
  }
</script>

<svelte:window onkeydown={onKey} />

{#if item}
  <div
    class="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
  >
    <!-- Backdrop -->
    <button
      transition:fade={{ duration: 200 }}
      class="absolute inset-0 cursor-default bg-black/60"
      aria-label="Close"
      onclick={onclose}
    ></button>

    <!--
			Modal panel: outer div is NOT scrollable — it clips to max-height.
			Image header (with close button) stays fixed. Only the content section scrolls.
		-->
    <div
      transition:fly={{ y: 24, duration: 320, opacity: 0 }}
      class="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-border bg-surface shadow-2xl sm:rounded-2xl"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      tabindex="-1"
    >
      <!-- Non-scrolling image header — close button lives here, always visible.
           Capped to a fraction of the viewport so short/landscape screens keep
           room for the (scrollable) content below. -->
      <div class="relative shrink-0">
        {#if backdropUrl(item.backdrop)}
          <img
            src={backdropUrl(item.backdrop)}
            alt=""
            class="max-h-[40dvh] aspect-video w-full object-cover"
            width="1280"
            height="720"
          />
        {:else if posterUrl(item.poster, "w500")}
          <img
            src={posterUrl(item.poster, "w500")}
            alt=""
            class="max-h-[40dvh] aspect-video w-full object-cover"
          />
        {:else}
          <div
            class="grid aspect-video w-full place-items-center bg-muted text-muted-foreground"
          >
            {#if item.isSeries}<Tv class="size-10" />{:else}<Film
                class="size-10"
              />{/if}
          </div>
        {/if}
        <div
          class="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-surface to-transparent"
        ></div>
        <!-- Close button: always visible, does not scroll -->
        <button
          class="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          aria-label="Close"
          onclick={onclose}
        >
          <X class="size-5" aria-hidden="true" />
        </button>
      </div>

      <!-- Scrollable content area — flex-1 + min-h-0 so it actually shrinks and
           scrolls inside the clipped panel (esp. short/landscape viewports). -->
      <div class="min-h-0 flex-1 overflow-y-auto">
        <div class="space-y-4 p-5 sm:p-6">
          <div
            class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
          >
            <span
              class="rounded-full bg-primary px-2 py-0.5 font-medium text-on-primary"
            >
              {$t("phase.label")}
              {item.phase}
            </span>
            <span class="rounded-full bg-muted px-2 py-0.5">{sagaName}</span>
            {#if item.upcoming}
              <span
                class="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 font-medium text-on-primary"
              >
                <CalendarClock class="size-3" aria-hidden="true" />
                {$t("status.upcoming")}
              </span>
            {/if}
            {#if item.eraTag}<span class="rounded-full bg-muted px-2 py-0.5"
                >{item.eraTag}</span
              >{/if}
            {#if item.year}<span class="tabular-nums">{item.year}</span>{/if}
            {#if item.runtime}<span class="tabular-nums">{item.runtime}m</span
              >{/if}
          </div>

          <h2
            class="text-2xl tracking-tight text-wrap-balance"
            style="font-family: var(--font-display); font-weight: 700"
          >
            {item.title}
          </h2>

          <!-- Ratings row -->
          {#if item.ratings?.imdb || item.ratings?.rt}
            <div class="flex flex-wrap items-center gap-3 text-sm">
              {#if item.ratings.imdb}
                <span class="flex items-center gap-1.5 font-medium">
                  <Star
                    class="size-4 fill-[#f5c518] text-[#f5c518]"
                    aria-hidden="true"
                  />
                  <span class="tabular-nums">{item.ratings.imdb}</span>
                  <span class="text-xs text-muted-foreground">IMDb</span>
                </span>
              {/if}
              {#if item.ratings.rt}
                <span class="flex items-center gap-1.5 font-medium">
                  <RottenTomato score={item.ratings.rt} class="size-4" />
                  <span class="tabular-nums">{item.ratings.rt}%</span>
                  <span class="text-xs text-muted-foreground">RT</span>
                </span>
              {/if}
            </div>
          {/if}

          {#if item.overview}
            <p class="selectable text-sm leading-relaxed text-muted-foreground">
              {item.overview}
            </p>
          {/if}

          <div class="flex flex-wrap items-center gap-3">
            {#if canTrack && !item.upcoming}
              <button
                class="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors {isWatched
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-border hover:bg-muted'}"
                aria-pressed={isWatched}
                onclick={() => setWatchedMany(itemUnits(item!), !isWatched)}
              >
                <Check class="size-4" aria-hidden="true" />
                {item.isSeries
                  ? `${watchedUnitCount(item, $watched)}/${itemUnits(item).length} ${$t("detail.episodes")}`
                  : isWatched
                    ? $t("watched.unmark")
                    : $t("watched.mark")}
              </button>
            {/if}
            <a
              href={tmdbPageUrl(
                item.isSeries ? "tv" : "movie",
                item.tmdbId,
                item.title,
              )}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Database class="size-4 text-[#01b4e4]" aria-hidden="true" />
              TMDB
              <ExternalLink
                class="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </a>
            {#if imdbUrl(item.imdbId)}
              <a
                href={imdbUrl(item.imdbId)}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Star
                  class="size-4 fill-[#f5c518] text-[#f5c518]"
                  aria-hidden="true"
                />
                IMDb
                <ExternalLink
                  class="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </a>
            {/if}
            <a
              href={rtUrl(item.rtSlug, item.title)}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <RottenTomato score={item.ratings?.rt ?? null} class="size-4" />
              Rotten Tomatoes
              <ExternalLink
                class="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </a>
          </div>

          {#if watchedDate}
            <p class="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check class="size-3.5 text-accent" aria-hidden="true" />
              {$t("watched.on", {
                date: formatWatchedDate(watchedDate, $locale),
              })}
            </p>
          {/if}

          <!-- Streaming providers (region-specific, via TMDB / JustWatch) -->
          {#if item.providers.length}
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-medium text-muted-foreground"
                >{$t("watch.providers")}</span
              >
              {#each item.providers as p (p.name)}
                {@const logo = providerLogoUrl(p.logo)}
                <svelte:element
                  this={item.watchLink ? "a" : "span"}
                  href={item.watchLink ?? undefined}
                  target={item.watchLink ? "_blank" : undefined}
                  rel={item.watchLink ? "noopener noreferrer" : undefined}
                  title={p.name}
                  class="block size-10 sm:size-14 overflow-hidden rounded-md border border-border bg-surface transition-transform hover:scale-105"
                >
                  {#if logo}
                    <img
                      src={logo}
                      alt={p.name}
                      class="size-10 sm:size-14 object-cover"
                      loading="lazy"
                    />
                  {:else}
                    <span
                      class="grid size-full place-items-center text-[10px] font-semibold text-muted-foreground"
                      >{p.name.charAt(0)}</span
                    >
                  {/if}
                </svelte:element>
              {/each}
            </div>
          {/if}

          {#if item.isSeries && seasons.length}
            <div class="space-y-4">
              {#each seasons as s (s.season)}
                <div>
                  <h3 class="mb-2 text-sm font-semibold">
                    {$t("detail.season")}
                    {s.season}
                    <span class="font-normal text-muted-foreground"
                      >· {s.episodes.length} {$t("detail.episodes")}</span
                    >
                  </h3>
                  <ol
                    class="divide-y divide-border rounded-lg border border-border"
                  >
                    {#each s.episodes as ep (ep.season + "-" + ep.number)}
                      {@const key = episodeKey(
                        item.tmdbId,
                        ep.season,
                        ep.number,
                      )}
                      {@const epWatched = $watched.has(key)}
                      <li class="flex items-center gap-3 px-3 py-2 text-sm">
                        {#if canTrack}
                          <button
                            class="grid size-6 shrink-0 place-items-center rounded-full border transition-colors {epWatched
                              ? 'border-accent bg-accent text-on-accent'
                              : 'border-border text-transparent hover:border-accent'}"
                            aria-pressed={epWatched}
                            aria-label={ep.title}
                            onclick={() => toggleWatched(key)}
                          >
                            <Check class="size-3.5" aria-hidden="true" />
                          </button>
                        {:else}
                          <span
                            class="w-6 shrink-0 tabular-nums text-muted-foreground"
                            >{ep.number}</span
                          >
                        {/if}
                        <span class="flex-1">{ep.number}. {ep.title}</span>
                        {#if ep.airDate}
                          <span
                            class="hidden shrink-0 text-xs tabular-nums text-muted-foreground sm:block"
                          >
                            {ep.airDate}
                          </span>
                        {/if}
                        <!-- Per-episode ratings / links -->
                        <span class="flex shrink-0 items-center gap-2">
                          {#if imdbUrl(ep.imdbId)}
                            <a
                              href={imdbUrl(ep.imdbId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                              aria-label="IMDb"
                            >
                              <Star
                                class="size-3.5 fill-[#f5c518] text-[#f5c518]"
                                aria-hidden="true"
                              />
                              {#if ep.imdb}<span class="tabular-nums"
                                  >{ep.imdb}</span
                                >{/if}
                            </a>
                          {/if}
                          {#if ep.rt && rtEpisodeUrl(item.rtSlug, ep.season, ep.number)}
                            <a
                              href={rtEpisodeUrl(
                                item.rtSlug,
                                ep.season,
                                ep.number,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                              aria-label="Rotten Tomatoes"
                            >
                              <RottenTomato score={ep.rt} class="size-3.5" />
                              <span class="tabular-nums">{ep.rt}%</span>
                            </a>
                          {/if}
                        </span>
                      </li>
                    {/each}
                  </ol>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
