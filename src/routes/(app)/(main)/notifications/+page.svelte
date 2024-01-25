<script>
	import Time from 'svelte-time';
	import Container from '$components/layout/container.svelte';
	import Heading from '$components/layout/heading.svelte';
	import { cn } from '$lib/utils';

	export let data;
	let notifications = data.notifications;
</script>

<Container>
	<Heading>
		Notifications
	</Heading>
	{#if notifications.length > 0}
		<div class="space-y-4">
			{#each notifications as notification}
				<a
					href="/notifications/{notification.id}"
					class="block bg-card px-4 py-3 border rounded transition-colors hover:bg-muted/50"
				>
					<div class={cn(notification.isRead ? 'font-medium text-primary/75' : 'font-bold text-primary')}>
						{notification.content}
					</div>
					<div class="text-sm text-muted-foreground">
						<Time timestamp={notification.createdAt} relative live />
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center bg-card h-28 border rounded-md">
			<div class="text-muted-foreground text-sm text-center">
				You don't have any notifications.
			</div>
		</div>
	{/if}
</Container>