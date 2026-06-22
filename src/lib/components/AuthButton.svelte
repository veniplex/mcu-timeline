<script lang="ts">
	import { LogIn, LogOut, ChevronDown } from 'lucide-svelte';
	import { firebaseEnabled } from '$lib/firebase';
	import { auth, signInWithGoogle, signInWithGithub, signOut } from '$lib/stores/auth';
	import { t } from '$lib/i18n/messages';

	let open = $state(false);
	let error = $state<string | null>(null);

	async function run(fn: () => Promise<void>) {
		error = null;
		try {
			await fn();
			open = false;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Sign-in failed';
		}
	}
</script>

{#if !firebaseEnabled}
	<!-- Auth not configured: hide controls rather than show a broken button -->
{:else if $auth.loading}
	<div class="size-9 animate-pulse rounded-full bg-muted" aria-hidden="true"></div>
{:else if $auth.user}
	<div class="relative">
		<button
			class="flex items-center gap-1.5 rounded-full border border-border bg-surface py-1 pl-1 pr-2"
			onclick={() => (open = !open)}
			aria-haspopup="menu"
			aria-expanded={open}
		>
			{#if $auth.user.photoURL}
				<img
					src={$auth.user.photoURL}
					alt=""
					width="28"
					height="28"
					class="size-7 rounded-full"
				/>
			{:else}
				<span class="grid size-7 place-items-center rounded-full bg-primary text-on-primary text-xs">
					{($auth.user.displayName ?? '?').charAt(0)}
				</span>
			{/if}
			<ChevronDown class="size-4 text-muted-foreground" aria-hidden="true" />
		</button>
		{#if open}
			<div
				class="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-surface p-1 shadow-lg"
				role="menu"
			>
				<button
					class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
					role="menuitem"
					onclick={() => run(signOut)}
				>
					<LogOut class="size-4" aria-hidden="true" />
					{$t('auth.signOut')}
				</button>
			</div>
		{/if}
	</div>
{:else}
	<div class="relative">
		<button
			class="flex items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-sm font-medium text-on-primary"
			onclick={() => (open = !open)}
			aria-haspopup="menu"
			aria-expanded={open}
		>
			<LogIn class="size-4" aria-hidden="true" />
			<span class="hidden sm:inline">{$t('auth.signIn')}</span>
		</button>
		{#if open}
			<div
				class="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-surface p-1 shadow-lg"
				role="menu"
			>
				<button
					class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
					role="menuitem"
					onclick={() => run(signInWithGoogle)}
				>
					{$t('auth.google')}
				</button>
				<button
					class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
					role="menuitem"
					onclick={() => run(signInWithGithub)}
				>
					{$t('auth.github')}
				</button>
				{#if error}
					<p class="px-3 py-1.5 text-xs text-destructive">{error}</p>
				{/if}
			</div>
		{/if}
	</div>
{/if}
