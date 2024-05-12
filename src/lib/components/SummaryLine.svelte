<script lang="ts">
	import type { Summary } from '$lib/types/Summary';
	import { browser } from '$app/environment';

	export let date: string;

	const summaryStr = browser ? localStorage.getItem(`abc-summary-${date}`) : null;
	const summary: Summary | null = summaryStr ? JSON.parse(summaryStr) : null;
</script>

<li>
	<a href={`/game/${date}`}
		>{new Date(date).toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})}
		{#if summary}
			({summary.found.length}/{summary.total}){/if}

		<span aria-hidden="true">➡️</span></a
	>
</li>

<style>
	li > a:hover {
		background-color: #dee2e6;
	}

	li > a {
		color: inherit;
		text-decoration: none;

		display: flex;
		justify-content: space-between;
		border: 2px solid #adb5bd;
		padding: 0.5rem 1rem;
		border-radius: 0.2rem;
	}
</style>
