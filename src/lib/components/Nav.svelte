<script lang="ts">
	import { Sun, Moon, Clapperboard, Globe, Check } from 'lucide-svelte';
	import { theme } from '$lib/stores/theme';
	import { locale, LOCALES } from '$lib/stores/locale';
	import { t } from '$lib/i18n/messages';
	import AuthButton from './AuthButton.svelte';

	let langOpen = $state(false);

	const LOCALE_LABELS: Record<string, string> = { en: 'English', de: 'Deutsch' };
</script>

<svelte:window onclick={(e) => { if (!(e.target as Element).closest('[data-lang-dropdown]')) langOpen = false; }} />

<header class="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
	<nav class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
		<a href="/" class="mr-auto flex items-center gap-2 tracking-tight" style="font-family: var(--font-display); font-weight: 600; letter-spacing: 0.01em">
			<Clapperboard class="size-5 text-primary" aria-hidden="true" />
			<span>{$t('app.title')}</span>
		</a>

		<!-- Language dropdown -->
		<div class="relative" data-lang-dropdown>
			<button
				class="rounded-full border border-border bg-surface p-2 text-muted-foreground transition-colors hover:text-foreground"
				aria-label={$t('lang.label')}
				aria-haspopup="listbox"
				aria-expanded={langOpen}
				onclick={() => (langOpen = !langOpen)}
			>
				<Globe class="size-4" aria-hidden="true" />
			</button>
			{#if langOpen}
				<div
					class="absolute right-0 mt-2 w-36 rounded-xl border border-border bg-surface p-1 shadow-lg"
					role="listbox"
					aria-label={$t('lang.label')}
				>
					{#each LOCALES as l (l)}
						<button
							class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted {$locale === l ? 'text-foreground font-medium' : 'text-muted-foreground'}"
							role="option"
							aria-selected={$locale === l}
							onclick={() => { locale.set(l); langOpen = false; }}
						>
							{#if $locale === l}
								<Check class="size-3.5 shrink-0 text-primary" aria-hidden="true" />
							{:else}
								<span class="size-3.5 shrink-0"></span>
							{/if}
							{LOCALE_LABELS[l] ?? l.toUpperCase()}
						</button>
					{/each}
				</div>
			{/if}
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
