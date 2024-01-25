<script>
	import Container from '$components/layout/container.svelte';
	import Heading from '$components/layout/heading.svelte';
	import ChangeEmail from './ChangeEmail.svelte';
	import ChangePassword from './ChangePassword.svelte';
</script>

<Container>
	<Heading>
		Account Settings
	</Heading>
	<div class="grid gap-6 md:grid-cols-2">
		<ChangeEmail />
		<ChangePassword />
	</div>
</Container>