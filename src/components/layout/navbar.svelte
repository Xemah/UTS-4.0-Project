<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import Container from './container.svelte';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<nav class={cn(
	'sticky top-0 z-50 bg-background/95 w-full mb-6 border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60',
	className,
)} in:fly={{ y: -15 }}>
	<Container class="flex items-center justify-center h-16">
		<div class="font-bold text-xl">
			<a href="/">UTS 4.0 Project</a>
		</div>
	</Container>
</nav>