<script>
	import { slide } from 'svelte/transition';
	import PostCommentItem from './post-comment-item.svelte';

	export let comments;
</script>

<div class="space-y-4">
	{#each comments as comment (comment.id)}
		<div transition:slide>
			<PostCommentItem
				comment={comment}
				on:delete={({ detail }) => comments = comments.filter(({ id }) => id !== detail.id)}
			/>
		</div>
	{/each}
</div>