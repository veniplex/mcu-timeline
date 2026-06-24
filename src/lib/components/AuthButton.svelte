<script lang="ts">
	import { LogIn, LogOut, ChevronDown, RotateCcw } from 'lucide-svelte';
	import { firebaseEnabled } from '$lib/firebase';
	import { auth, signInWithGoogle, signInWithGithub, signOut } from '$lib/stores/auth';
	import { resetWatched } from '$lib/stores/watched';
	import { t } from '$lib/i18n/messages';

	let open = $state(false);
	let error = $state<string | null>(null);
	let confirmReset = $state(false);

	async function run(fn: () => Promise<void>) {
		error = null;
		try {
			await fn();
			open = false;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Sign-in failed';
		}
	}

	// Two-step: first click arms, second click wipes. Resets when menu closes.
	async function onReset() {
		if (!confirmReset) {
			confirmReset = true;
			return;
		}
		await resetWatched();
		confirmReset = false;
		open = false;
	}

	$effect(() => {
		if (!open) confirmReset = false;
	});
</script>

<svelte:window onclick={(e) => { if (!(e.target as Element).closest('[data-auth-dropdown]')) open = false; }} />

{#if !firebaseEnabled}
	<!-- Auth not configured -->
{:else if $auth.loading}
	<div class="size-9 animate-pulse rounded-full bg-muted" aria-hidden="true"></div>
{:else if $auth.user}
	<!-- Signed in: avatar + dropdown -->
	<div class="relative" data-auth-dropdown>
		<button
			class="flex items-center gap-1.5 rounded-full border border-border bg-surface py-1 pl-1 pr-2"
			onclick={() => (open = !open)}
			aria-haspopup="menu"
			aria-expanded={open}
		>
			{#if $auth.user.photoURL}
				<img src={$auth.user.photoURL} alt="" width="28" height="28" class="size-7 rounded-full" />
			{:else}
				<span class="grid size-7 place-items-center rounded-full bg-primary text-xs text-on-primary">
					{($auth.user.displayName ?? '?').charAt(0)}
				</span>
			{/if}
			<ChevronDown class="size-4 text-muted-foreground" aria-hidden="true" />
		</button>
		{#if open}
			<div
				class="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface p-1 shadow-lg"
				role="menu"
			>
				<button
					class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors {confirmReset
						? 'bg-destructive/10 text-destructive'
						: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
					role="menuitem"
					onclick={onReset}
				>
					<RotateCcw class="size-4 shrink-0" aria-hidden="true" />
					{confirmReset ? $t('watched.resetConfirm') : $t('watched.reset')}
				</button>
				<div class="my-1 border-t border-border"></div>
				<button
					class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
					role="menuitem"
					onclick={() => run(signOut)}
				>
					<LogOut class="size-4 text-muted-foreground" aria-hidden="true" />
					{$t('auth.signOut')}
				</button>
			</div>
		{/if}
	</div>
{:else}
	<!-- Signed out: single icon + provider dropdown -->
	<div class="relative" data-auth-dropdown>
		<button
			class="grid size-9 place-items-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
			aria-label={$t('auth.signIn')}
			aria-haspopup="menu"
			aria-expanded={open}
			onclick={() => (open = !open)}
		>
			<LogIn class="size-4" aria-hidden="true" />
		</button>
		{#if open}
			<div
				class="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-surface p-1 shadow-lg"
				role="menu"
			>
				<button
					class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
					role="menuitem"
					onclick={() => run(signInWithGoogle)}
				>
					<svg class="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/>
						<path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"/>
					</svg>
					{$t('auth.google')}
				</button>
				<button
					class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
					role="menuitem"
					onclick={() => run(signInWithGithub)}
				>
					<svg class="size-4 shrink-0 fill-foreground" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.53.1.72-.23.72-.5v-1.77c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.54-1.17-1.54-.95-.65.07-.64.07-.64 1.06.07 1.61 1.09 1.61 1.09.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.66-1.4-2.33-.27-4.78-1.17-4.78-5.18 0-1.15.41-2.08 1.08-2.82-.11-.27-.47-1.34.1-2.78 0 0 .88-.28 2.88 1.07a9.96 9.96 0 0 1 5.24 0c2-1.35 2.88-1.07 2.88-1.07.57 1.44.21 2.51.1 2.78.67.74 1.08 1.67 1.08 2.82 0 4.02-2.45 4.9-4.79 5.16.38.33.71.97.71 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z"/>
					</svg>
					{$t('auth.github')}
				</button>
			</div>
		{/if}
		{#if error}
			<span
				class="absolute right-0 top-11 w-56 rounded-xl border border-destructive/40 bg-surface px-3 py-1.5 text-xs text-destructive shadow-lg"
				role="alert"
			>
				{error}
			</span>
		{/if}
	</div>
{/if}
