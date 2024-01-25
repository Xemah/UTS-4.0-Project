<script>
	import { toast } from 'svelte-sonner';
	import { applyAction, enhance } from '$app/forms';
	import { Button } from '$components/ui/button';
	import * as Card from '$components/ui/card';
	import { Input } from '$components/ui/input';
	import { Label } from '$components/ui/label';

	let isSubmitting = false;

	/** @type {import('./$types').SubmitFunction} */
	const onSubmit = ({ formElement }) => {
		isSubmitting = true;

		return async ({ result }) => {
			const res = result.data;
			await applyAction(result);

			if (result.type === 'success') {
				isSubmitting = false;
				formElement.reset();
				toast.success(res.message);
			} else {
				isSubmitting = false;
				toast.error(res.message);
			}
		};
	};
</script>

<Card.Root>
	<form action="?/changeEmail" method="POST" use:enhance={onSubmit}>
		<Card.Header>
			<Card.Title class="font-bold text-xl">
				Change Email
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="space-y-4">
				<div class="space-y-1">
					<Label for="input-ce-newEmail">New Email</Label>
					<Input type="email" id="input-ce-newEmail" name="newEmail" />
				</div>
				<div class="space-y-1">
					<Label for="input-ce-confirmNewEmail">Confirm New Email</Label>
					<Input type="email" id="input-ce-confirmNewEmail" name="confirmNewEmail" />
				</div>
				<div class="space-y-1">
					<Label for="input-ce-currentPassword">Current Password</Label>
					<Input type="password" id="input-ce-currentPassword" name="currentPassword" />
				</div>
				<div class="text-right">
					<Button type="submit" loading={isSubmitting}>Change Email</Button>
				</div>
			</div>
		</Card.Content>
	</form>
</Card.Root>

