<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	};

	let className: $$Props['class'] = undefined;
	export let tag: $$Props['level'] = 'h2';
	export { className as class };
</script>

<div
	class={cn('mb-6 py-12 font-bold text-3xl -md:text-2xl -md:text-center', className)}
	{...$$restProps}
>
	<svelte:element this={tag}>
		<slot />
	</svelte:element>
</div>