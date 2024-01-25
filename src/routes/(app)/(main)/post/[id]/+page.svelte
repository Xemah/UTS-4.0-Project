<script>
	import { goto } from '$app/navigation';
	import Container from '$components/layout/container.svelte';
	import Heading from '$components/layout/heading.svelte';
	import PostItem from '$components/post/post-item.svelte';

	export let data;
	let post = data.post;

	$: post = data.post;
</script>

<Container>
	<Heading>
		Post
	</Heading>
	<PostItem
		expanded={true}
		post={post}
		on:delete={() => goto('/')}
	/>
</Container>