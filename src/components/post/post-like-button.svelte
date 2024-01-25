<script>
	import { ThumbsUpIcon } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { applyAction, enhance } from '$app/forms';
	import { Button } from '$components/ui/button';
	import { user } from '$lib/stores';
	import { cn, deepMerge } from '$lib/utils';

	export let post;

	$: isLiked = post.likes.some(({ user: likee }) => likee.id === $user?.id);

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
				post = deepMerge(post, res.data);
			} else {
				isSubmitting = false;
				toast.error(res.message);
			}
		};
	};
</script>

<form
	action="/post?/like&id={post.id}"
	method="POST"
	use:enhance={onSubmit}
>
	<Button
		type="submit"
		variant="ghost"
		class={cn('w-full', isLiked && 'text-blue-500')}
		disabled={isSubmitting}
	>
		<ThumbsUpIcon />
		<span>Like ({post.likes.length})</span>
	</Button>
</form>