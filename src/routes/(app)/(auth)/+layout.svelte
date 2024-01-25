<script>
	import authCover from '$assets/images/auth-cover.jpg';
	import Container from '$components/layout/container.svelte';
</script>

<div class="flex flex-grow">
	<div
		class="flex-grow bg-center bg-cover bg-no-repeat -lg:hidden"
		style="background-image: url('{authCover}')"
	/>
	<div class="flex flex-col items-center justify-center w-full max-w-[50vw] min-w-[500px] mx-auto">
		<Container class="max-w-[400px]">
			<slot />
		</Container>
	</div>
</div>