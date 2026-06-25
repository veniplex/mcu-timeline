<script lang="ts">
  import { Info, X } from "lucide-svelte";
  import { bannerDismissed } from "$lib/stores/banner";
  import { GITHUB_URL } from "$lib/stores/githubStars";
  import { t } from "$lib/i18n/messages";
</script>

{#if !$bannerDismissed}
  <div
    class="border-b border-accent/25 bg-accent/10 text-foreground"
    role="region"
    aria-label={$t("banner.text")}
  >
    <div
      class="mx-auto flex max-w-7xl items-start gap-3 px-4 py-2.5 text-sm sm:px-6"
    >
      <Info
        class="mt-0.5 size-4 shrink-0 text-accent"
        aria-hidden="true"
      />
      <p class="min-w-0 flex-1 text-muted-foreground">
        <span class="text-foreground">{$t("banner.text")}</span>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-accent underline-offset-2 hover:underline"
        >
          {$t("banner.cta")}
        </a>
      </p>
      <button
        class="-mr-1 shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={$t("banner.dismiss")}
        onclick={() => bannerDismissed.dismiss()}
      >
        <X class="size-4" aria-hidden="true" />
      </button>
    </div>
  </div>
{/if}
