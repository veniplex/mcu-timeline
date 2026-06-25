<script lang="ts">
  import { GITHUB_URL } from "$lib/stores/githubStars";
  import { t } from "$lib/i18n/messages";
  import { locale } from "$lib/stores/locale";
  import GithubPill from "./GithubPill.svelte";

  const year = 2026;
</script>

<footer class="mt-16 border-t border-border">
  <div
    class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 items-center"
  >
    <!-- Brand + source — the pill lives in the nav on ≥sm; here on small screens.
         Required by the license: a visible, clickable link to the project on
         every page. -->
    <div class="flex flex-col items-center gap-3">
      <GithubPill class="inline-flex sm:hidden" />
      <!-- <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm font-medium underline-offset-2 hover:underline"
      >
        {$t("footer.builtBy")}
      </a> -->
      <p class="text-xs text-muted-foreground text-center">
        © {year} ·
        <a
          href="{GITHUB_URL}/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          class="underline-offset-2 hover:underline">{$t("footer.license")}</a
        >
        ·
        <a href="/privacy" class="underline-offset-2 hover:underline"
          >{$t("footer.privacy")}</a
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
