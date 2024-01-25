<script lang="ts">
	import { SendHorizonalIcon } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import { applyAction, enhance } from '$app/forms';
	import * as Avatar from '$components/ui/avatar';
	import { Button } from '$components/ui/button';
	import Textarea from '$components/ui/textarea/textarea.svelte';
	import { user } from '$lib/stores';
	import { getS3Url } from '$lib/utils';

	export let post;

	let content = '';

	let isSubmitting = false;

	/** @type {import('./$types').SubmitFunction} */
	const onSubmit = ({ formElement }) => {
		isSubmitting = true;

		return async ({ result }) => {
			const res = result.data;
			await applyAction(result);

			if (result.type === 'success') {
				isSubmitting = false;
				toast.success(res.message);
				post.comments = [...post.comments, res.data];
				formElement.reset();
			} else {
				isSubmitting = false;
				toast.error(res.message);
			}
		};
	};
</script>

<div class="flex gap-4">
	<div class="flex-shrink-0">
		<Avatar.Root>
			<Avatar.Image
				src={getS3Url('avatars', $user?.profile?.avatar || '')}
				alt={$user?.profile?.name}
			/>
			<Avatar.Fallback>
				<span class="-translate-y-[1px]">
					{$user?.profile?.name.charAt(0)}
				</span>
			</Avatar.Fallback>
		</Avatar.Root>
	</div>
	<div class="flex-grow">
		<form action="/post/comment?/new&post={post.id}" method="POST" use:enhance={onSubmit}>
			<div>
				<Textarea name="content" placeholder="Write a comment..." bind:value={content} />
			</div>
			{#if content.length > 0}
				<div class="mt-2 text-right" transition:slide>
					<Button type="submit" size="sm" loading={isSubmitting}>
						<SendHorizonalIcon />
						<span>Comment</span>
					</Button>
				</div>
			{/if}
		</form>
	</div>
</div>