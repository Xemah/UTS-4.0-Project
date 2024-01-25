<script>
	import ProfileRecommendationItem from './profile-recommendation-item.svelte';

	export let recommendations;
</script>

<div class="grid grid-cols-3 gap-4 -md:grid-cols-2 -sm:grid-cols-1">
	{#each recommendations as recommendation}
		<div>
			<ProfileRecommendationItem bind:recommendation={recommendation} />
		</div>
	{/each}
</div>