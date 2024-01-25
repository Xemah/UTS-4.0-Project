<script>
	import axios from 'axios';
	import { Loader2Icon, SearchIcon } from 'lucide-svelte';
	// import { getAvatarUrl } from '$lib/utils';
	import { getS3Url } from '$lib/utils';
	import * as Avatar from './ui/avatar';
	import { Button } from './ui/button';
	import * as DropdownMenu from './ui/dropdown-menu';
	import { Input } from './ui/input';
	import * as Tooltip from './ui/tooltip';

	let query = '';

	let searched = false;
	let results = [];
	let error = false;
	let isLoading = false;

	/** @type {number | null} */
	let timeout = null;

	const search = (query) => {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(async () => {
			isLoading = true;

			const response = await axios.get('/api/search', {
				params: { query },
				validateStatus: () => true,
			});

			if (response.status < 200 || response.status > 299) {
				searched = true;
				results = [];
				error = true;

			} else {
				results = response.data;
				error = false;
			}

			searched = true;
			isLoading = false;
		}, 1000);
	};

	$: query.length > 2 && search(query);
	$: searched = query.length < 3 ? false : searched;
</script>

<DropdownMenu.Root preventScroll={false}>
	<DropdownMenu.Trigger class="h-9 w-9" asChild let:builder>
		<Tooltip.Root openDelay={200}>
			<Tooltip.Trigger>
				<Button variant="secondary" size="icon" builders={[builder]}>
					<SearchIcon />
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				Search user
			</Tooltip.Content>
		</Tooltip.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="p-3" align="start" sameWidth={false}>
		<Input
			type="search"
			class="h-9 mb-3 py-1 items-center"
			placeholder="Search player"
			bind:value={query}
		/>
		{#if isLoading}
			<div class="p-1 flex items-center gap-2 text-muted-foreground text-sm">
				<Loader2Icon class="w-4 h-4 stroke-[2] animate-spin" />
				Searching
			</div>
		{:else if error}
			<div class="p-1 text-muted-foreground text-sm">
				Failed to search
			</div>
		{:else if !searched}
			<div class="p-1 text-muted-foreground text-sm">
				Type to search...
			</div>
		{:else}
			{#if results.length === 0}
				<div class="p-1 text-muted-foreground text-sm">
					No search results
				</div>
			{:else}
				{#each results as profile}
					<DropdownMenu.Item href="/profile/{profile.user.id}">
						<div class="flex items-center gap-2">
							<Avatar.Root class="w-8 h-8">
								<Avatar.Image
									src={getS3Url('avatars', profile.avatar)}
									alt={profile.name}
								/>
								<Avatar.Fallback>
									<span class="-translate-y-[1px]">{profile.name.charAt(0)}</span>
								</Avatar.Fallback>
							</Avatar.Root>
							<span>{profile.name}</span>
						</div>
					</DropdownMenu.Item>
				{/each}
			{/if}
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
