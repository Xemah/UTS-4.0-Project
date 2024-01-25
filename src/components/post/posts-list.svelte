<script>
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import PostItem from './post-item.svelte';

	const dispatch = createEventDispatcher();

	export let posts;
</script>

<div class="space-y-4">
	{#each posts as post (post.id)}
		<div transition:slide>
			<PostItem
				post={post}
				on:delete={({ detail }) => dispatch('delete', detail)}
			/>
		</div>
	{/each}
</div>