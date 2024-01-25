<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { Loader2Icon } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { buttonVariants, type Props, type Events } from '.';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let loading: $$Props['loading'] = false;
	export let disabled: $$Props['disabled'] = false;
	export let builders: $$Props['builders'] = [];
	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	type="button"
	class={cn(buttonVariants({ variant, size, className }))}
	disabled={disabled || loading}
	{...$$restProps}
	on:click
	on:keydown
>
	{#if loading}
		<Loader2Icon class="!stroke-[2] animate-spin" />
	{/if}
	<span class={cn(
		'flex items-center justify-center space-x-2',
		loading && '[&_.lucide-icon]:!hidden',
		loading && size === 'icon' && '!m-0',
	)}>
		<slot />
	</span>
</ButtonPrimitive.Root>
