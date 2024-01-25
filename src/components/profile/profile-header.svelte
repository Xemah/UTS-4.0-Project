<script>
	import * as Avatar from '$components/ui/avatar';
	import { Button } from '$components/ui/button';
	import { user } from '$lib/stores';
	import { getS3Url } from '$lib/utils';
	import ProfileBlockButton from './profile-block-button.svelte';
	import ProfileEditDialog from './profile-edit-dialog.svelte';
	import ProfileFollowButton from './profile-follow-button.svelte';
	import ProfileFollowersDialog from './profile-followers-dialog.svelte';
	import ProfileFollowingsDialog from './profile-followings-dialog.svelte';

	export let profile;

	$: hasBlocked = profile.user.blocks.some(({ target }) => target.id === $user?.id);

	let isEditing = false;
	let isFollowersDialogOpened = false;
	let isFollowingsDialogOpened = false;
</script>

<div class="relative bg-card border rounded-md overflow-hidden">
	<div class="h-40 border-b overflow-hidden">
		{#if profile.background}
			<img
				src={getS3Url('backgrounds', profile.background)}
				alt={profile.name}
				class="w-full h-full object-cover"
			/>
		{/if}
	</div>
	<div class="p-6">
		<div class="absolute top-20 -md:left-1/2 -md:-translate-x-1/2">
			<Avatar.Root class="w-40 h-40 border-2 text-6xl">
				<Avatar.Image
					src={getS3Url('avatars', profile.avatar)}
					alt={profile.name}
				/>
				<Avatar.Fallback>
					<span class="-translate-y-[2px]">{profile.name.charAt(0)}</span>
				</Avatar.Fallback>
			</Avatar.Root>
		</div>
		<div class="relative min-h-24 md:pl-48 -md:pt-20 -md:text-center">
			<div class="font-bold text-3xl">
				{profile.name}
			</div>
			{#if profile.bio}
				<div class="mt-1 text-muted-foreground text-base">
					{profile.bio}
				</div>
			{/if}
			<div class="inline-flex items-center gap-2 mt-4">
				<Button variant="outline" on:click={() => isFollowersDialogOpened = true}>
					{profile.user.followers.length} Followers
				</Button>
				<Button variant="outline" on:click={() => isFollowingsDialogOpened = true}>
					{profile.user.followings.length} Followings
				</Button>
			</div>
			<div class="absolute top-0 right-0 flex items-center gap-2 -md:static -md:mt-6 -md:justify-center">
				{#if $user && $user.id === profile.user.id}
					<Button on:click={() => isEditing = true}>
						Edit Profile
					</Button>
				{:else}
					<ProfileBlockButton bind:profile={profile} />
					{#if !hasBlocked}
						<ProfileFollowButton bind:profile={profile} />
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>

{#if $user && $user.id === profile.user.id}
	<ProfileEditDialog
		bind:open={isEditing}
		bind:profile={profile}
	/>
{/if}

<ProfileFollowersDialog
	profile={profile}
	bind:open={isFollowersDialogOpened}
/>

<ProfileFollowingsDialog
	profile={profile}
	bind:open={isFollowingsDialogOpened}
/>