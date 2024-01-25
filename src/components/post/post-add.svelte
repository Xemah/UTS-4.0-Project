<script>
	import { createEventDispatcher } from 'svelte';
	import * as Card from '$components/ui/card';
	import PostForm from './post-form.svelte';

	const dispatch = createEventDispatcher();

	let randomKey = Math.random();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>
			Create New Post
		</Card.Title>
	</Card.Header>
	<Card.Content>
		{#key randomKey}
			<PostForm
				mode="add"
				action="/post?/new"
				on:save={({ detail }) => {
					dispatch('add', detail);
					randomKey = Math.random();
				}}
			/>
		{/key}
	</Card.Content>
</Card.Root>

