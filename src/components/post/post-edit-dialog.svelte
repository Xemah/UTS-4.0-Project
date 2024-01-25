<script>
	import * as Dialog from '$components/ui/dialog';
	import { deepMerge } from '$lib/utils';
	import PostForm from './post-form.svelte';

	export let post;

	export let open = false;
</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				Edit Post
			</Dialog.Title>
		</Dialog.Header>
		<div class="py-2">
			<PostForm
				action="/post?/edit&id={post.id}"
				mode="edit"
				post={post}
				on:save={({ detail }) => {
					post = deepMerge(post, detail);
					open = false;
				}}
			/>
		</div>
	</Dialog.Content>
</Dialog.Root>