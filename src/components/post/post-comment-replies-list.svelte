<script>
	import { slide } from 'svelte/transition';
	import PostCommentReplyItem from './post-comment-reply-item.svelte';

	export let replies;
</script>

<div class="space-y-4">
	{#each replies as reply (reply.id)}
		<div transition:slide>
			<PostCommentReplyItem
				reply={reply}
				on:delete={({ detail }) => replies = replies.filter(({ id }) => id !== detail.id)}
			/>
		</div>
	{/each}
</div>