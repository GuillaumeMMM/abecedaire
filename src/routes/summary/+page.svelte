<script lang="ts">
	import SummaryLine from '$lib/components/SummaryLine.svelte';

	export let data: { dates: string[] };
</script>

<h1>Résumé des parties</h1>
{#if data.dates.length === 0}
	<p>Vous n'avez aucun score enregistré pour le moment.</p>
	<a href="/game">Lancer la partie du jour</a>
{/if}
{#if data.dates.length > 0}
	<ul>
		{#each data.dates as date}
			<SummaryLine {date} />
		{/each}
	</ul>
{/if}
<a href="/"><span aria-hidden="true">⬅️&nbsp;&nbsp;</span> Retour à l'accueil</a>
