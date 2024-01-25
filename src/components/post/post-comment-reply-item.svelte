<script>
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Time from 'svelte-time';
	import { applyAction, enhance } from '$app/forms';
	import * as Avatar from '$components/ui/avatar';
	import { Button } from '$components/ui/button';
	import { Textarea } from '$components/ui/textarea';
	import { user } from '$lib/stores';
	import { cn, deepMerge, getS3Url, sanitize } from '$lib/utils';

	const dispatch = createEventDispatcher();

	export let reply;

	/** @type {HTMLFormElement} */
	let deleteForm;

	let isEditing = false;
	let isDeleting = false;
	let isSubmitting = false;

	/** @type {import('./$types').SubmitFunction} */
	const onEdit = () => {
		isSubmitting = true;

		return async ({ result }) => {
			const res = result.data;
			await applyAction(result);

			if (result.type === 'success') {
				isSubmitting = false;
				toast.success(res.message);
				reply = deepMerge(reply, res.data);
				isEditing = false;
			} else {
				isSubmitting = false;
				toast.error(res.message);
			}
		};
	};

	/** @type {import('./$types').SubmitFunction} */
	const onDelete = () => {
		isDeleting = true;

		return async ({ result }) => {
			const res = result.data;
			await applyAction(result);

			if (result.type === 'success') {
				isDeleting = false;
				toast.success(res.message);
				dispatch('delete', res.data);
			} else {
				isDeleting = false;
				toast.error(res.message);
			}
		};
	};
</script>

<div class={cn('flex gap-4', isDeleting && 'opacity-25 pointer-events-none')}>
	<div class="flex-shrink-0">
		<Avatar.Root>
			<Avatar.Image
				src={getS3Url('avatars', reply.author.profile.avatar)}
				alt={reply.author.profile.name}
			/>
			<Avatar.Fallback>
				<span class="-translate-y-[1px]">
					{reply.author.profile.name.charAt(0)}
				</span>
			</Avatar.Fallback>
		</Avatar.Root>
	</div>
	<div class="flex-grow">
		{#if !isEditing}
			<div class="font-medium text-sm">
				<a href="/profile/{reply.author.id}">{reply.author.profile.name}</a>
			</div>
			<div class="text-sm">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html sanitize(reply.content)}
			</div>
			<div class="mt-1 flex items-center gap-3 text-muted-foreground text-xs">
				<Time timestamp={reply.createdAt} relative live />
				{#if $user.id === reply.author.id}
					<a href="#/" on:click|preventDefault={() => isEditing = true}>Edit</a>
					<a href="#/" on:click|preventDefault={() => confirm('Are you sure want to delete this reply?') && deleteForm.requestSubmit()}>Delete</a>
				{/if}
			</div>
		{:else}
			<form action="/post/comment/reply?/edit&id={reply.id}" method="POST" use:enhance={onEdit}>
				<div class="space-y-2">
					<Textarea name="content" value={reply.content} />
					<div class="flex items-center justify-end gap-2">
						<Button variant="ghost" size="sm" on:click={() => isEditing = false}>Cancel</Button>
						<Button type="submit" size="sm" loading={isSubmitting}>Save</Button>
					</div>
				</div>
			</form>
		{/if}
	</div>
</div>

<form
	action="/post/comment/reply?/delete&id={reply.id}"
	method="POST"
	use:enhance={onDelete}
	bind:this={deleteForm}
/>