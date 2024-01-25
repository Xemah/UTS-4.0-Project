<script>
	import { toast } from 'svelte-sonner';
	import { applyAction, enhance } from '$app/forms';
	import { Button } from '$components/ui/button';
	import { user } from '$lib/stores';
	import { deepMerge } from '$lib/utils';

	export let profile;

	$: isBlocked = profile.user.blockedBy.some(({ user: blocker }) => blocker.id === $user?.id);

	let isSubmitting = false;

	/** @type {import('./$types').SubmitFunction} */
	const onSubmit = () => {
		isSubmitting = true;

		return async ({ result }) => {
			const res = result.data;
			await applyAction(result);

			if (result.type === 'success') {
				isSubmitting = false;
				toast.success(res.message);
				profile = deepMerge(profile, res.data);
			} else {
				isSubmitting = false;
				toast.error(res.message);
			}
		};
	};
</script>

{#if $user}
	<form action="?/block" method="POST" use:enhance={onSubmit}>
		{#if isBlocked}
			<Button type="submit" variant="secondary" loading={isSubmitting}>
				Unblock
			</Button>
		{:else}
			<Button type="submit" variant="destructive" loading={isSubmitting}>
				Block
			</Button>
		{/if}
	</form>
{/if}