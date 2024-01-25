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
	<form action="?/changePassword" method="POST" use:enhance={onSubmit}>
		<Card.Header>
			<Card.Title class="font-bold text-xl">
				Change Password
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="space-y-4">
				<div class="space-y-1">
					<Label for="input-cp-newPassword">New Password</Label>
					<Input type="password" id="input-cp-newPassword" name="newPassword" />
				</div>
				<div class="space-y-1">
					<Label for="input-cp-confirmNewPassword">Confirm New Password</Label>
					<Input type="password" id="input-cp-confirmNewPassword" name="confirmNewPassword" />
				</div>
				<div class="space-y-1">
					<Label for="input-cp-currentPassword">Current Password</Label>
					<Input type="password" id="input-cp-currentPassword" name="currentPassword" />
				</div>
				<div class="text-right">
					<Button type="submit" loading={isSubmitting}>Change Password</Button>
				</div>
			</div>
		</Card.Content>
	</form>
</Card.Root>

