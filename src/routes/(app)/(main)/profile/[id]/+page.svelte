<script>
	import { page } from '$app/stores';
	import Container from '$components/layout/container.svelte';
	import PostAdd from '$components/post/post-add.svelte';
	import PostsList from '$components/post/posts-list.svelte';
	import ProfileHeader from '$components/profile/profile-header.svelte';
	import { user, title } from '$lib/stores';

	export let data;
	let profile = data.profile;
	let posts = data.posts;

	$: profile = data.profile;
	$: posts = data.posts;

	title.set(`Profile: ${profile.name}`);

	$: hasBlocked = profile.user.blocks.some(({ target }) => target.id === $user?.id);
</script>

{#key $page.url.pathname}
	<Container>
		<ProfileHeader profile={profile} />
		<div class="mt-6">
			{#if profile.user.id === $user.id}
				<div class="mb-4">
					<PostAdd on:add={({ detail }) => posts = [detail, ...posts]} />
				</div>
			{/if}
			{#if posts.length > 0}
				<PostsList
					posts={posts}
					on:delete={({ detail }) => posts = posts.filter(({ id }) => id !== detail.id)}
				/>
			{:else}
				{#if hasBlocked}
					<div class="flex flex-col items-center justify-center bg-card p-6 border rounded-md">
						<div class="font-bold text-lg">
							You're Blocked
						</div>
						<div class="text-muted-foreground text-sm">
							This user has blocked you.
						</div>
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center bg-card p-6 border rounded-md">
						<div class="font-bold text-lg">
							No Posts
						</div>
						<div class="text-muted-foreground text-sm">
							This user has not created any posts.
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</Container>
{/key}