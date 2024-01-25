<script>
	import { toast } from 'svelte-sonner';
	import { applyAction, enhance } from '$app/forms';
	import * as Avatar from '$components/ui/avatar';
	import { Button } from '$components/ui/button';
	import { user } from '$lib/stores';
	import { deepMerge, getS3Url } from '$lib/utils';

	export let recommendation;

	let isSubmitting = false;

	$: isFollowed = recommendation.user.followers.some(({ userId }) => userId === $user?.id);

	/** @type {import('./$types').SubmitFunction} */
	const onSubmit = () => {
		isSubmitting = true;

		return async ({ result }) => {
			const res = result.data;
			await applyAction(result);

			if (result.type === 'success') {
				isSubmitting = false;
				toast.success(res.message);
				recommendation = deepMerge(recommendation, res.data);
			} else {
				isSubmitting = false;
				toast.error(res.message);
			}
		};
	};
</script>

<div class="flex flex-col justify-center gap-2 bg-card p-4 border rounded-md text-center">
	<a href="/profile/{recommendation.user.id}" class="flex-shrink-0">
		<Avatar.Root class="w-16 h-16 mx-auto">
			<Avatar.Image
				src={getS3Url('avatars', recommendation.avatar)}
				alt={recommendation.name}
			/>
			<Avatar.Fallback>
				<span class="-translate-y-[1px]">{recommendation.name.charAt(0)}</span>
			</Avatar.Fallback>
		</Avatar.Root>
	</a>
	<div class="font-bold">
		<a href="/profile/{recommendation.user.id}">{recommendation.name}</a>
	</div>
	<form action="/profile/{recommendation.user.id}?/follow" method="POST" use:enhance={onSubmit}>
		<Button
			type="submit"
			size="sm"
			class="w-full"
			disabled={isFollowed}
			loading={isSubmitting}
		>
			{isFollowed ? 'Followed' : 'Follow'}
		</Button>
	</form>
</div>