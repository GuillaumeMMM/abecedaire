<script lang="ts">
	import type { Summary } from '$lib/types/Summary';
	import { browser } from '$app/environment';
	import { formatDate } from '$lib/utils';

	export let date: string;

	const summaryStr = browser ? localStorage.getItem(`abc-summary-data-${date}`) : null;
	const summary: Summary | null = summaryStr ? JSON.parse(summaryStr) : null;
	const isComplete = summary && Object.keys(summary.found).length / summary.total === 1;
</script>

<li>
	<a href={`/game/${date}`} class={isComplete ? 'complete' : ''}
		>{formatDate(date)}
		{#if summary}
			({Object.keys(summary.found).length}/{summary.total}){/if}

		<span aria-hidden="true">➡️</span></a
	>
</li>

<style>
	li > a:hover {
		background-color: transparent;
	}

	li > a {
		color: inherit;
		text-decoration: none;

		display: flex;
		justify-content: space-between;
		border: 2px solid var(--primary-color);
		background-color: var(--primary-color-light);
		padding: 0.5rem 1rem;
		border-radius: 0.2rem;
	}

	.complete {
		border-color: #17ba32;
		background-color: #17ba3214;
	}
</style>
