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
			({summary.found.length}/{summary.total}){/if}</a
	>
</li>
