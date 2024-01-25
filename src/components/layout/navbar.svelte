<script lang="ts">
	import { UserIcon } from 'lucide-svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import Container from '$components/layout/container.svelte';
	import ProfileSearch from '$components/profile-search.svelte';
	import { Button } from '$components/ui/button';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { user } from '$lib/stores';
	import { cn } from '$lib/utils';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };

	const signOut = async () => {
		toast.loading('Signing out...');
		await fetch('/sign-out', {
			method: 'POST',
			body: new FormData(),
		});

		await goto('/sign-in', { invalidateAll: true });
		toast.success('You have been successfully signed out.');
	};
</script>

<nav class={cn(
	'sticky top-0 z-50 bg-background/95 w-full mb-6 border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60',
	className,
)} in:fly={{ y: -15 }}>
	<Container class="relative flex items-center justify-center h-16">
		<div class="flex items-center">
			<ProfileSearch />
		</div>
		<div class="absolute left-1/2 -translate-x-1/2 font-bold text-xl">
			<a href="/">UTS 4.0 Project</a>
		</div>
		<div class="flex items-center ml-auto">
			{#if $user}
				<DropdownMenu.Root preventScroll={false}>
					<DropdownMenu.Trigger class="h-9 w-9" asChild let:builder>
						<Button variant="secondary" size="icon" builders={[builder]}>
							<UserIcon />
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="min-w-[200px]" align="end" sameWidth={false}>
						<DropdownMenu.Label class="font-normal">
							<div class="flex flex-col space-y-1">
								<p class="text-sm font-medium leading-none">{$user.profile?.name}</p>
								<p class="text-xs leading-none text-muted-foreground">{$user.account?.email}</p>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item href="/profile/{$user.id}">
							Profile
						</DropdownMenu.Item>
						<DropdownMenu.Item href="/notifications">
							Notifications
						</DropdownMenu.Item>
						<DropdownMenu.Item href="/account">
							Account Settings
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item class="text-red-500" on:click={signOut}>
							Sign Out
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
		</div>
	</Container>
</nav>