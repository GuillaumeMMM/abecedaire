<script lang="ts">
	import SummaryLine from '$lib/components/SummaryLine.svelte';

	export let data: { dates: string[] };
</script>

<h1 class="abc-title-2">Résumé des parties</h1>
{#if data.dates.length === 0}
	<p>Vous n'avez aucun score enregistré pour le moment.</p>
	<a href="/game">Lancer la partie du jour</a>
{/if}
{#if data.dates.length > 0}
	<ul>
		{#each data.dates.reverse() as date}
			<SummaryLine {date} />
		{/each}
	</ul>
{/if}
<a href="/" class="abc-cta return-home"
	><span aria-hidden="true">⬅️&nbsp;&nbsp;</span> Retour à l'accueil</a
>

<style>
	h1 {
		margin-bottom: 2rem;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-width: 100%;
		width: 300px;
	}

	.return-home {
		margin-top: 2rem;
	}
</style>
