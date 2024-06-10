<script lang="ts">
	import Game from '$lib/components/Game.svelte';

	export let data;
</script>

<svelte:head>
	<title>Partie du {data.date} | Abécédaire</title>
</svelte:head>

<Game game={data.game} date={data.date} />
