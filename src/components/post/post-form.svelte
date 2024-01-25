<script>
	import { CheckIcon, ImageIcon, PenIcon, SendHorizonalIcon, Trash2Icon } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { applyAction, enhance } from '$app/forms';
	import FileInput from '$components/file-input.svelte';
	import { Button } from '$components/ui/button';
	import { Input } from '$components/ui/input';
	import { Textarea } from '$components/ui/textarea';
	import { getS3Url } from '$lib/utils';

	const dispatch = createEventDispatcher();

	export let action;
	export let mode;
	export let post = undefined;

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
				formElement.reset();
				dispatch('save', res.data);
			} else {
				isSubmitting = false;
				toast.error(res.message);
			}
		};
	};
</script>

<form action={action} method="POST" use:enhance={onSubmit}>
	<div class="space-y-4">
		<div>
			<Input name="title" placeholder="Enter post title" value={post?.title || ''} />
		</div>
		<div>
			<Textarea name="content" placeholder="Enter your post here" value={post?.content || ''} />
		</div>
		<div>
			<Input name="topics" placeholder="Enter post topics" value={post?.topics.join(', ') || ''} />
		</div>
		<div class="flex items-end gap-4 text-right">
			<FileInput
				name="image"
				endpoint="/upload/posts"
				accept="image/jpeg, image/png, image/gif, image/webp"
				renderInput={true}
				value={post?.image || undefined}
				let:select
				let:remove
				let:files
				let:busy
			>
				<div class="space-y-2">
					<div class="flex gap-2">
						{#if files.length > 0}
							{#if files[0].status === 'uploading'}
								<Button variant="outline" loading={true}>
									<ImageIcon />
									<span>Uploading Image</span>
								</Button>
							{:else}
								<div class="flex flex-col items-start gap-2">
									<img
										src={getS3Url('posts', files[0].name)}
										alt=""
										class="w-40 h-auto rounded-md"
									/>
									<div>
										<Button variant="outline" disabled={true}>
											<CheckIcon />
											<span>Image Attached</span>
										</Button>
										<Button variant="ghost" size="icon" on:click={select}>
											<PenIcon />
										</Button>
										<Button variant="ghost" size="icon" on:click={remove}>
											<Trash2Icon />
										</Button>
									</div>
								</div>
							{/if}
						{:else}
							<Button variant="outline" loading={busy} on:click={select}>
								<ImageIcon />
								<span>Insert Image</span>
							</Button>
						{/if}
					</div>
				</div>
			</FileInput>
			<Button type="submit" class="ml-auto" loading={isSubmitting}>
				<SendHorizonalIcon class="!w-3.5 !h-3.5" />
				<span>{mode === 'edit' ? 'Save' : 'Post'}</span>
			</Button>
		</div>
	</div>
</form>

