<script>
	import { toast } from 'svelte-sonner';
	import { applyAction, enhance } from '$app/forms';
	import FileInput from '$components/file-input.svelte';
	import * as Avatar from '$components/ui/avatar';
	import { Button } from '$components/ui/button';
	import * as Dialog from '$components/ui/dialog';
	import { Input } from '$components/ui/input';
	import { Textarea } from '$components/ui/textarea';
	import { getS3Url } from '$lib/utils';

	/** @type {import('./$types').PageData['profile']} */
	export let profile;

	export let open = false;

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
				profile = { ...profile, ...res.data };
				open = false;
			} else {
				isSubmitting = false;
				toast.error(res.message);
			}
		};
	};
</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="font-bold text-xl">
				Edit Profile
			</Dialog.Title>
		</Dialog.Header>
		<div class="py-2">
			<form action="/profile?/edit" method="POST" use:enhance={onSubmit}>
				<div class="max-h-[60vh] space-y-4 overflow-y-scroll px-2">
					<div class="space-y-2">
						<div class="font-bold text-lg">
							Name
						</div>
						<Input name="name" value={profile.name} />
					</div>
					<FileInput
						name="avatar"
						endpoint="/upload/avatars"
						value={profile.avatar}
						accept="image/jpeg, image/png, image/gif, image/webp"
						renderInput={true}
						let:select
						let:remove
						let:files
					>
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div class="font-bold text-lg">
								Profile Picture
							</div>
							<div class="flex items-center gap-2">
								{#if files.length > 0}
									{#if files[0].status === 'uploading'}
										<Button
											variant="ghost"
											size="sm"
											loading={true}
										>
											Uploading
										</Button>
									{:else}
										<Button
											variant="ghost"
											size="sm"
											on:click={remove}
										>
											Remove
										</Button>
										<Button
											variant="ghost"
											size="sm"
											on:click={select}
										>
											Change
										</Button>
									{/if}
								{:else}
									<Button
										variant="ghost"
										size="sm"
										on:click={select}
									>
										Upload
									</Button>
								{/if}
							</div>
						</div>
						<div>
							<Avatar.Root class="w-32 h-32 mx-auto text-4xl">
								<Avatar.Image
									src={files[0]?.name ? getS3Url('avatars', files[0].name) : ''}
									alt={profile.name}
								/>
								<Avatar.Fallback>
									<span class="-translate-y-[1px]">{profile.name.charAt(0)}</span>
								</Avatar.Fallback>
							</Avatar.Root>
						</div>
					</FileInput>
					<FileInput
						name="background"
						endpoint="/upload/backgrounds"
						value={profile.background}
						accept="image/jpeg, image/png, image/gif, image/webp"
						renderInput={true}
						let:select
						let:remove
						let:files
					>
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div class="font-bold text-lg">
								Background
							</div>
							<div class="flex items-center gap-2">
								{#if files.length > 0}
									{#if files[0].status === 'uploading'}
										<Button
											variant="ghost"
											size="sm"
											loading={true}
										>
											Uploading
										</Button>
									{:else}
										<Button
											variant="ghost"
											size="sm"
											on:click={remove}
										>
											Remove
										</Button>
										<Button
											variant="ghost"
											size="sm"
											on:click={select}
										>
											Change
										</Button>
									{/if}
								{:else}
									<Button
										variant="ghost"
										size="sm"
										on:click={select}
									>
										Upload
									</Button>
								{/if}
							</div>
						</div>
						<div>
							<div class="w-full h-40 rounded-md overflow-hidden">
								{#if files.length > 0 && files[0].status === 'uploaded'}
									<img
										src={getS3Url('backgrounds', files[0].name)}
										alt={profile.name}
										class="w-full h-full object-cover"
									/>
								{:else}
									<div class="flex items-center justify-center bg-muted w-full h-full">
										<span class="text-muted-foreground text-4xl">?</span>
									</div>
								{/if}
							</div>
						</div>
					</FileInput>
					<div class="space-y-2">
						<div class="font-bold text-lg">
							Bio
						</div>
						<Textarea name="bio" value={profile.bio} />
					</div>
					<div class="space-y-2">
						<div class="font-bold text-lg">
							Interests
						</div>
						<Input name="interests" value={profile.interests.join(', ')} />
						<div class="text-muted-foreground text-xs">
							Seperated by a comma
						</div>
					</div>
				</div>
				<div class="mt-4 text-right">
					<Button type="submit" loading={isSubmitting}>
						Save
					</Button>
				</div>
			</form>
		</div>
	</Dialog.Content>
</Dialog.Root>