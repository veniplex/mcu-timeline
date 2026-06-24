<script lang="ts">
  import { Star } from "lucide-svelte";
  import { githubStars, GITHUB_URL } from "$lib/stores/githubStars";
  import { locale } from "$lib/stores/locale";
  import { t } from "$lib/i18n/messages";

  const year = 2026;

  const starsLabel = $derived(
    $githubStars === null
      ? null
      : new Intl.NumberFormat($locale).format($githubStars),
  );
</script>

<footer class="mt-16 border-t border-border">
  <div
    class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 items-center"
  >
    <!-- Brand + source -->
    <div class="space-y-3">
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
      >
        <svg
          class="size-4 shrink-0 fill-foreground"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.53.1.72-.23.72-.5v-1.77c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.54-1.17-1.54-.95-.65.07-.64.07-.64 1.06.07 1.61 1.09 1.61 1.09.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.66-1.4-2.33-.27-4.78-1.17-4.78-5.18 0-1.15.41-2.08 1.08-2.82-.11-.27-.47-1.34.1-2.78 0 0 .88-.28 2.88 1.07a9.96 9.96 0 0 1 5.24 0c2-1.35 2.88-1.07 2.88-1.07.57 1.44.21 2.51.1 2.78.67.74 1.08 1.67 1.08 2.82 0 4.02-2.45 4.9-4.79 5.16.38.33.71.97.71 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z"
          />
        </svg>
        <span>{$t("footer.source")}</span>
        {#if starsLabel}
          <span
            class="inline-flex items-center gap-1 border-l border-border pl-2 text-muted-foreground"
          >
            <Star
              class="size-3.5 fill-[#e0a82e] text-[#e0a82e]"
              aria-hidden="true"
            />
            <span class="tabular-nums">{starsLabel}</span>
            <span class="sr-only">{$t("footer.stars")}</span>
          </span>
        {/if}
      </a>
      <p class="text-xs text-muted-foreground text-center">
        © {year} ·
        <a
          href="{GITHUB_URL}/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          class="underline-offset-2 hover:underline">{$t("footer.license")}</a
        >
      </p>
    </div>

    <!-- Legal / attribution -->
    <div
      class="max-w-xl space-y-2 text-xs leading-relaxed text-muted-foreground text-center"
    >
      <p>
        {$t("footer.dataBy", { tmdb: "TMDB" }).split("TMDB")[0]}<a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="underline-offset-2 hover:underline">TMDB</a
        >{$t("footer.dataBy", { tmdb: "TMDB" }).split("TMDB")[1]}
      </p>
      <p>{$t("footer.tmdbDisclaimer")}</p>
      <p>{$t("footer.fanProject")}</p>
    </div>
  </div>
</footer>
