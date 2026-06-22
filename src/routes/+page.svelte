<script lang="ts">
	import { t } from '$lib/i18n/messages';
	import { sortMode } from '$lib/stores/sortMode';
</script>

<section class="mb-10">
	<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{$t('app.title')}</h1>
	<p class="mt-2 max-w-prose text-muted-foreground">{$t('app.tagline')}</p>
	<p class="mt-1 text-sm text-muted-foreground">
		{$t('sort.label')}: {$sortMode === 'chronological' ? $t('sort.chronological') : $t('sort.release')}
	</p>
</section>

<div
	class="grid place-items-center rounded-xl border border-dashed border-border bg-surface/50 px-6 py-20 text-center"
>
	<h2 class="text-lg font-semibold">{$t('empty.title')}</h2>
	<p class="mt-1 text-sm text-muted-foreground">{$t('empty.body')}</p>
</div>
