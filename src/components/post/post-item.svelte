<script>
	import { PenIcon, TrashIcon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Time from 'svelte-time';
	import { applyAction, enhance } from '$app/forms';
	import * as Avatar from '$components/ui/avatar';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { user } from '$lib/stores';
	import { cn, getS3Url, sanitize } from '$lib/utils';
	import PostCommentAdd from './post-comment-add.svelte';
	import PostCommentButton from './post-comment-button.svelte';
	import PostCommentsList from './post-comments-list.svelte';
	import PostEditDialog from './post-edit-dialog.svelte';
	import PostLikeButton from './post-like-button.svelte';

	const dispatch = createEventDispatcher();

	export let post;
	export let expanded = false;

	/** @type {HTMLFormElement} */
	let deleteForm;

	let isEditing = false;
	let isDeleting = false;

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

<Card.Root class={cn(isDeleting && 'opacity-25 pointer-events-none')}>
	<Card.Header>
		<div class="flex items-center gap-4">
			<a href="/profile/{post.author.id}" class="flex-shrink-0">
				<Avatar.Root>
					<Avatar.Image
						src={getS3Url('avatars', post.author.profile.avatar)}
						alt={post.author.profile.name}
					/>
					<Avatar.Fallback>
						<span class="-translate-y-[1px]">{post.author.profile.name.charAt(0)}</span>
					</Avatar.Fallback>
				</Avatar.Root>
			</a>
			<div class="flex-grow">
				<Card.Title>
					<a href="/profile/{post.author.id}">{post.author.profile.name}</a>
				</Card.Title>
				<Card.Description>
					<Time timestamp={post.createdAt} relative live />
				</Card.Description>
			</div>
		</div>
	</Card.Header>
	<Card.Content class="pb-0">
		<div class="mb-1 font-bold text-xl">
			<a href="/post/{post.id}">{post.title}</a>
		</div>
		<div>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html sanitize(post.content)}
		</div>
		{#if post.image}
			<div class="mt-6">
				<img
					src={getS3Url('posts', post.image)}
					alt={post.title}
					class="w-full h-auto rounded-md"
				/>
			</div>
			{#if post.topics && post.topics.length > 0}
				<div class="flex items-center gap-2 mt-6">
					{#each post.topics as topic}
						<span class="bg-muted px-2 py-1 rounded font-semibold text-sm text-primary">
							{topic}
						</span>
					{/each}
				</div>
			{/if}
		{/if}
	</Card.Content>
	<Card.Footer class="p-2">
		<div class="grid sm:grid-flow-col w-full">
			{#if $user}
				<div>
					<PostLikeButton bind:post={post} />
				</div>
			{/if}
			{#if !expanded}
				<div>
					<PostCommentButton bind:post={post} />
				</div>
			{/if}
			{#if $user && $user.id === post.author.id}
				<Button variant="ghost" on:click={() => isEditing = true}>
					<PenIcon />
					<span>Edit</span>
				</Button>
				<Button variant="ghost" on:click={() => confirm('Are you sure want to delete this post?') && deleteForm.requestSubmit()}>
					<TrashIcon />
					<span>Delete</span>
				</Button>
			{/if}
		</div>
	</Card.Footer>
</Card.Root>

{#if expanded}
	<Card.Root class="mt-4">
		<Card.Header>
			<Card.Title>Comments</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if post.comments.length > 0}
				<PostCommentsList bind:comments={post.comments} />
			{:else}
				<div class="flex flex-col items-center justify-center bg-card h-28 border rounded-md">
					<div class="text-muted-foreground text-sm text-center">
						There are no comments on this post.
					</div>
				</div>
			{/if}
			{#if $user}
				<div class="mt-4">
					<PostCommentAdd bind:post={post} />
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
{/if}

<PostEditDialog
	bind:post={post}
	bind:open={isEditing}
/>

<form
	action="/post?/delete&id={post.id}"
	method="POST"
	use:enhance={onDelete}
	bind:this={deleteForm}
/>