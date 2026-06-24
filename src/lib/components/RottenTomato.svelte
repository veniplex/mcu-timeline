<script lang="ts">
  /**
   * Rotten Tomatoes Tomatometer icon. RT shows a fresh red tomato at ≥60% and a
   * green "rotten" splat below 60% (see rottentomatoes.com/about). Pass a score
   * to pick automatically, or omit for the neutral fresh tomato (plain links).
   */
  let {
    score = null,
    class: cls = "size-4",
  }: { score?: number | string | null; class?: string } = $props();

  const fresh = $derived(score == null || Number(score) >= 60);
</script>

{#if fresh}
  <!-- Fresh tomato -->
  <svg class={cls} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 6.6C10.8 4 8.2 3 6.1 3.9c.1 2.1 1.9 3.4 3.9 3.4M12 6.6c1.1-2.6 3.7-3.6 5.8-2.7-.1 2.1-1.9 3.4-3.9 3.4M12 6.9c.3-1.8 1.4-3.3 2.9-4.1"
      fill="none"
      stroke="#4e9f3d"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle cx="12" cy="14" r="8" fill="#FA320A" />
    <path
      d="M8.4 11.2c-.7.6-1.1 1.6-1.1 2.8"
      fill="none"
      stroke="#fff"
      stroke-opacity="0.55"
      stroke-width="1.4"
      stroke-linecap="round"
    />
  </svg>
{:else}
  <!-- Rotten green splat -->
  <svg class={cls} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 2.3l1.7 2.9 3-1.1-.6 3.3 3.3 1-2.5 2.3 2.5 2.3-3.3 1 .6 3.3-3-1.1L12 21.7l-1.7-3-3 1.1.6-3.3-3.3-1 2.5-2.3-2.5-2.3 3.3-1-.6-3.3 3 1.1z"
      fill="#00ad4f"
    />
    <circle cx="9.6" cy="11.4" r="1.1" fill="#0b7a3b" />
    <circle cx="13.8" cy="13.8" r="1.1" fill="#0b7a3b" />
  </svg>
{/if}
