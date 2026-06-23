<script lang="ts">
	import { Sun, Moon, Clapperboard } from 'lucide-svelte';
	import { theme } from '$lib/stores/theme';
	import { locale, LOCALES } from '$lib/stores/locale';
	import { t } from '$lib/i18n/messages';
	import AuthButton from './AuthButton.svelte';
</script>

<header
	class="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md"
>
	<nav class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
		<a href="/" class="mr-auto flex items-center gap-2 tracking-tight" style="font-family: var(--font-display); font-weight: 600; letter-spacing: 0.01em">
			<Clapperboard class="size-5 text-primary" aria-hidden="true" />
			<span>{$t('app.title')}</span>
		</a>

		<!-- Language -->
		<div
			class="flex items-center rounded-full border border-border bg-surface p-0.5 text-sm font-medium"
			role="group"
			aria-label={$t('lang.label')}
		>
			{#each LOCALES as l (l)}
				<button
					class="rounded-full px-2.5 py-1.5 uppercase transition-colors {$locale === l
						? 'bg-primary text-on-primary'
						: 'text-muted-foreground hover:text-foreground'}"
					aria-pressed={$locale === l}
					onclick={() => locale.set(l)}
				>
					{l}
				</button>
			{/each}
		</div>

		<!-- Theme -->
		<button
			class="rounded-full border border-border bg-surface p-2 text-muted-foreground transition-colors hover:text-foreground"
			aria-label={$t('theme.toggle')}
			onclick={() => theme.toggle()}
		>
			{#if $theme === 'dark'}
				<Sun class="size-4" aria-hidden="true" />
			{:else}
				<Moon class="size-4" aria-hidden="true" />
			{/if}
		</button>

		<AuthButton />
	</nav>
</header>
