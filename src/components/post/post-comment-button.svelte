<script>
	import { MessageSquareIcon } from 'lucide-svelte';
	import { Button } from '$components/ui/button';
	import * as Dialog from '$components/ui/dialog';
	import PostCommentNew from './post-comment-add.svelte';
	import PostCommentsList from './post-comments-list.svelte';

	export let post;

	let isDialogOpened = false;
</script>

<Button type="submit" variant="ghost" class="w-full" on:click={() => isDialogOpened = true}>
	<MessageSquareIcon />
	<span>Comment ({post.comments.length})</span>
</Button>

<Dialog.Root bind:open={isDialogOpened}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				Comments
			</Dialog.Title>
		</Dialog.Header>
		<div class="max-h-[60vh] -mx-2 px-2 overflow-y-auto">
			{#if post.comments.length > 0}
				<div class="py-2">
					<PostCommentsList bind:comments={post.comments} />
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center bg-card h-28 border rounded-md">
					<div class="text-muted-foreground text-sm text-center">
						There are no comments on this post.
					</div>
				</div>
			{/if}
		</div>
		<div>
			<PostCommentNew bind:post={post} />
		</div>
	</Dialog.Content>
</Dialog.Root>