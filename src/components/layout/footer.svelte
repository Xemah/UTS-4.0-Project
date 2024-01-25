<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import Container from './container.svelte';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<footer class={cn(
	'sticky top-0 z-50 bg-background/95 w-full mt-6 border-t border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60',
	className,
)} in:fly={{ y: 15 }}>
	<Container class="flex items-center h-16">
		<div class="font-normal text-sm text-muted-foreground">
			Copyright &copy;
			<a href="/">UTS 4.0 Project</a>,
			{new Date().getFullYear()}
		</div>
	</Container>
</footer>