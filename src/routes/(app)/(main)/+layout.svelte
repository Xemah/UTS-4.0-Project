<script>
	import { toast } from 'svelte-sonner';
	import { source } from 'sveltekit-sse';
	import { goto } from '$app/navigation';
	import Footer from '$components/layout/footer.svelte';
	import Navbar from '$components/layout/navbar.svelte';

	const notificationsData = source('/api/notifications');
	notificationsData.subscribe(async (data) => {
		let notifications = [];
		try {
			notifications = JSON.parse(data);
		} catch (err) { }

		let i = 0;
		while (i < notifications.length) {
			const notification = notifications[i];

			toast.info('Notification', {
				description: notification.content,
				action: {
					label: 'View',
					onClick: () => goto(`/notifications/${notification.id}`),
				},
			});

			await new Promise((resolve) => setTimeout(resolve, 100));
			i++;
		}
	});
</script>

<Navbar />

<div class="flex flex-col flex-grow">
	<slot />
</div>

<Footer />