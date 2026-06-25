<script lang="ts">
  import { cookieNoticeDismissed } from "$lib/stores/cookieNotice";
  import { t } from "$lib/i18n/messages";
</script>

{#if !$cookieNoticeDismissed}
  <div
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md"
    role="region"
    aria-label={$t("cookie.accept")}
  >
    <div
      class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6"
    >
      <p class="text-xs text-muted-foreground">
        {$t("cookie.text")}
        <a
          href="/privacy"
          class="font-medium text-foreground underline-offset-2 hover:underline"
        >
          {$t("cookie.link")}
        </a>
      </p>
      <button
        class="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        onclick={() => cookieNoticeDismissed.accept()}
      >
        {$t("cookie.accept")}
      </button>
    </div>
  </div>
{/if}
