<script>
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	import { Toaster } from '$components/ui/sonner';
</script>

<div class="flex flex-col min-h-screen">
	<slot />
</div>

<ProgressBar
	class="text-zinc-950 !h-[4px] [&>.svelte-progress-bar-leader]:!h-[6px] !z-[9999]"
	minimum={0.02}
/>

<Toaster />