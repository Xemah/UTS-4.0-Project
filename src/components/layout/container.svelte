<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div
	class={cn('w-full max-w-[1000px] mx-auto me-auto px-4', className)}
	{...$$restProps}
>
	<slot />
</div>