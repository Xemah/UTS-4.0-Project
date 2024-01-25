<script>
	import { page } from '$app/stores';
	import Container from '$components/layout/container.svelte';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { hydrated } from '$lib/stores';
	import Layout from './(app)/+layout.svelte';

	const goBack = () => {
		if ($hydrated) {
			history.back();
		}
	};
</script>

<Layout>
	<div class="flex flex-grow items-center">
		<Container class="max-w-[400px]">
			<Card.Root>
				<Card.Header class="!pb-2 text-center">
					<Card.Title class="font-bold text-2xl">
						Error {$page.status}
					</Card.Title>
				</Card.Header>
				<Card.Content class="text-center">
					<div class="text-muted-foreground text-base">
						{#if $page.status === 404}
							The requested page could not be found.
						{:else}
							{$page.error.message}
						{/if}
					</div>
					<div class="mt-6 space-x-2">
						<Button variant="secondary" on:click={goBack}>
							Go Back
						</Button>
						<Button href="/" variant="secondary">
							Go to Home
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</Container>
	</div>
</Layout>