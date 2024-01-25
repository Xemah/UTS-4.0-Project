<script>
	import { fly } from 'svelte/transition';
	import { toast } from 'svelte-sonner';
	import { enhance, applyAction } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { Input } from '$components/ui/input';
	import { Label } from '$components/ui/label';
	import { title } from '$lib/stores';

	title.set('Sign In');

	let isSubmitting = false;

	/** @type {import('./$types').SubmitFunction} */
	const onSubmit = () => {
		isSubmitting = true;

		return async ({ result }) => {
			const res = result.data;
			await applyAction(result);

			if (result.type === 'success') {
				await goto('/', { invalidateAll: true });
				toast.success(res.message);
				isSubmitting = false;
			} else {
				isSubmitting = false;
				toast.error(res.message);
			}
		};
	};
</script>

<div in:fly={{ y: 15 }}>
	<Card.Root>
		<Card.Header class="-sm:text-center">
			<Card.Title class="font-bold text-2xl">
				Sign In
			</Card.Title>
			<Card.Description>
				Enter your credentials to securely log in.
			</Card.Description>
		</Card.Header>
		<Card.Content class="pb-0">
			<form action="" method="POST" use:enhance={onSubmit}>
				<div class="space-y-4">
					<div class="space-y-1">
						<Label for="input-email">Email</Label>
						<Input type="email" id="input-email" name="email" />
					</div>
					<div class="space-y-1">
						<Label for="input-password">Password</Label>
						<Input type="password" id="input-password" name="password" />
					</div>
					<Button type="submit" class="w-full" loading={isSubmitting}>
						Sign In
					</Button>
				</div>
			</form>
		</Card.Content>
		<Card.Footer class="flex-col items-start gap-4">
			<div class="text-sm text-muted-foreground">
				Not registered yet?
			</div>
			<Button href="/sign-up" variant="secondary" class="w-full">
				Sign Up
			</Button>
		</Card.Footer>
	</Card.Root>
</div>