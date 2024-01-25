<script>
	import { EditIcon, Loader2Icon, LogOutIcon, UserCogIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import ProfileEditDialog from '$components/profile/profile-edit-dialog.svelte';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { user } from '$lib/stores';
	import { getS3Url } from '$lib/utils';

	let profile;
	let isLoading = true;
	let isEditingProfile = false;

	const getProfile = async () => {
		const response = await fetch('/api/profile');
		const data = await response.json();
		profile = data.profile;
		isLoading = false;
	};

	const signOut = async () => {
		toast.loading('Signing out...');
		await fetch('/sign-out', {
			method: 'POST',
			body: new FormData(),
		});

		await goto('/sign-in', { invalidateAll: true });
		toast.success('You have been successfully signed out.');
	};

	onMount(async () => {
		await getProfile();
	});
</script>

{#if $user}
	{#if isLoading}
		<Card.Root>
			<Card.Content class="p-0">
				<div class="flex items-center justify-center h-40">
					<Loader2Icon class="w-6 h-6 stroke-[2] animate-spin" />
				</div>
			</Card.Content>
		</Card.Root>
	{:else}
		<Card.Root>
			<Card.Header class="relative">
				<div class="bg-white h-24 -mt-6 -mx-6 border-b rounded-t-md overflow-hidden">
					{#if profile.background}
						<img
							src={getS3Url('backgrounds', profile.background)}
							alt={profile.name}
							class="w-full h-full object-cover"
						/>
					{/if}
				</div>
				<div class="absolute top-8 -bottom-8 left-1/2 -translate-x-1/2 bg-white w-24 h-24 border rounded-full overflow-hidden">
					{#if profile.avatar}
						<img
							src={getS3Url('avatars', profile.avatar)}
							alt={profile.name}
							class="w-full h-full object-cover"
						/>
					{:else}
						<div class="flex items-center justify-center bg-black/25 w-full h-full text-white text-4xl">
							<span class="-translate-y-[1px]">
								{profile?.name.charAt(0)}
							</span>
						</div>
					{/if}
				</div>
			</Card.Header>
			<Card.Content class="pt-6">
				<div class="font-bold text-xl text-center">
					<a href="/profile/{profile.user.id}">{profile?.name}</a>
				</div>
				{#if profile.bio}
					<div class="mt-1 text-muted-foreground text-sm text-center">
						{profile.bio}
					</div>
				{/if}
				<div class="grid grid-cols-3 mt-4">
					<Button href="/profile/{profile.user.id}" variant="ghost" class="h-16">
						<div class="text-center">
							<div class="font-bold text-xl">
								{profile.user._count.posts}
							</div>
							<div class="font-normal text-muted-foreground text-xs">
								Posts
							</div>
						</div>
					</Button>
					<Button href="/profile/{profile.user.id}" variant="ghost" class="h-16">
						<div class="text-center">
							<div class="font-bold text-xl">
								{profile.user._count.followers}
							</div>
							<div class="font-normal text-muted-foreground text-xs">
								Followers
							</div>
						</div>
					</Button>
					<Button href="/notifications" variant="ghost" class="h-16">
						<div class="text-center">
							<div class="font-bold text-xl">
								{profile.user._count.notifications}
							</div>
							<div class="font-normal text-muted-foreground text-xs">
								Notifications
							</div>
						</div>
					</Button>
				</div>
				<div class="flex flex-col gap-2 mt-4">
					<Button variant="secondary" class="w-full" on:click={() => isEditingProfile = true}>
						<EditIcon />
						<span>Edit Profile</span>
					</Button>
					<Button href="/account" variant="secondary" class="w-full">
						<UserCogIcon />
						<span>Account Settings</span>
					</Button>
					<Button variant="ghost" class="w-full" on:click={signOut}>
						<LogOutIcon />
						<span>Sign Out</span>
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
		<ProfileEditDialog
			bind:profile={profile}
			bind:open={isEditingProfile}
		/>
	{/if}
{/if}