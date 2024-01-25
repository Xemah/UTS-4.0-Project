<script>
	import { onMount } from 'svelte';
	import { title, user, hydrated } from '$lib/stores';
	import '../app.pcss';

	export let data;
	$: user.set(data.user);

	onMount(() => hydrated.set(true));
</script>

<svelte:head>
	<title>
		{$title !== '' ? $title + ' - ' : ''}
		UTS 4.0 Project
	</title>
</svelte:head>

<slot />