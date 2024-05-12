<script lang="ts">
	import Game from '$lib/components/Game.svelte';

	export let data;
</script>

<Game game={data.game} date={data.date} />
