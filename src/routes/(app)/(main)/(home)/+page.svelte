<script>
	import Container from '$components/layout/container.svelte';
	import PostAdd from '$components/post/post-add.svelte';
	import PostsList from '$components/post/posts-list.svelte';
	import ProfileCard from '$components/profile/profile-card.svelte';
	import ProfileRecommendationsList from '$components/profile/profile-recommendations-list.svelte';
	import * as Card from '$components/ui/card';

	export let data;
	let posts = data.posts;
	let recommendations = data.recommendations;
</script>

<Container>
	<div class="grid md:grid-cols-[minmax(0,1fr)_300px] gap-4">
		<div>
			<PostAdd on:add={({ detail }) => posts = [detail, ...posts]} />
			<div class="mt-4">
				{#if posts.length > 0}
					<PostsList
						posts={posts}
						on:delete={({ detail }) => posts = posts.filter(({ id }) => id !== detail.id)}
					/>
				{:else}
					<div class="flex flex-col items-center justify-center bg-card p-6 border rounded-md">
						<div class="font-medium text-lg">
							No Posts
						</div>
						<div class="text-muted-foreground text-sm">
							There are no posts to show. Try following some people.
						</div>
					</div>
				{/if}
			</div>
			<Card.Root class="mt-4">
				<Card.Header>
					<Card.Title>Recommendations</Card.Title>
				</Card.Header>
				<Card.Content>
					{#if recommendations.length > 0}
						<ProfileRecommendationsList recommendations={recommendations} />
					{:else}
						<div class="text-muted-foreground text-sm">
							There are currently no recommendations.
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>
		<div class="-md:-order-1">
			<div class="sticky top-20">
				<ProfileCard />
			</div>
		</div>
	</div>
</Container>