<script>
	import * as Avatar from '$components/ui/avatar';
	import * as Dialog from '$components/ui/dialog';
	import { getS3Url } from '$lib/utils';

	export let profile;

	export let open = false;
</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="font-bold text-xl">
				Followings
			</Dialog.Title>
		</Dialog.Header>
		<div class="py-2">
			{#if profile.user.followings.length > 0}
				<div class="max-h-[60vh] space-y-4 overflow-y-auto -mx-2 px-2">
					{#each profile.user.followings as follow}
						<div class="flex items-center gap-4">
							<a href="/profile/{follow.target.id}">
								<Avatar.Root>
									<Avatar.Image
										src={getS3Url('avatars', follow.target.profile.avatar)}
										alt={follow.target.profile.name}
									/>
									<Avatar.Fallback>
										<span class="-translate-y-[1px]">{follow.target.profile.name.charAt(0)}</span>
									</Avatar.Fallback>
								</Avatar.Root>
							</a>
							<div class="font-medium text-base">
								<a href="/profile/{follow.target.id}">{follow.target.profile.name}</a>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div>
					User has no followings.
				</div>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>