<script lang="ts">
	import { GAME_TIME_LENGTH } from '$lib/constants';
	import { FirstLetter, type Game } from '$lib/types/Game';
	import { formatDate, intlTimeFormater } from '$lib/utils';

	export let timeLeft: number;
	export let gameFirstLetters: FirstLetter[];
	export let foundFirstLetters: FirstLetter[];
	export let game: Game;
	export let date: string;

	const allLetters: FirstLetter[] = Object.values(FirstLetter);

	const ratio = foundFirstLetters.length / gameFirstLetters.length;
	const timeSpent = GAME_TIME_LENGTH - timeLeft;

	$: copied = false;

	const resultsSummary = `${foundFirstLetters.length} ${foundFirstLetters.length === 1 ? `${game.category} trouvé` : `${game.categoryPlural} trouvés`} en ${intlTimeFormater(Math.trunc(timeSpent / 60))}:${intlTimeFormater(timeSpent % 60)}`;

	const emojiResults = allLetters.map((letter) => {
		if (foundFirstLetters.includes(letter)) {
			return '✅';
		} else if (gameFirstLetters.includes(letter)) {
			return '🚫';
		} else {
			return '⚪';
		}
	});

	function onCopyResults() {
		const text = `Le ${formatDate(date)}\n${resultsSummary}\n${emojiResults.join('')}`;
		navigator.clipboard.writeText(text).then(() => {
			copied = true;
		});
	}
</script>

<p class="results-congrats">
	{#if ratio === 1}<span aria-hidden="true">🎉</span> Bravo! Vous avez terminé le défi du jour.{/if}
	{#if timeLeft <= 0}<span aria-hidden="true">⏱️</span> Fin du temps réglementaire! Vous avez trouvé {foundFirstLetters.length}
		{#if foundFirstLetters.length === 1}lettre{:else}lettres{/if} sur {gameFirstLetters.length}.
	{/if}
</p>

<p class="results-label">Partagez vos résultats :</p>
<div class="results">
	<p class="results-date">Le {formatDate(date)}</p>
	<p class="results-summary">
		{resultsSummary}
	</p>
	<p aria-hidden="true">
		{#each Array.from(emojiResults) as emoji}
			<span>
				{emoji}
			</span>
		{/each}
	</p>
	<button class="abc-cta results-button" on:click={onCopyResults}
		><span aria-hidden="true">🖨️</span>&nbsp;<span role="status"
			>{#if copied}Copié{:else}Copier{/if}</span
		></button
	>
</div>

<style>
	.results-date {
		font-weight: 600;
	}

	.results-congrats {
		margin: 1rem 0;
	}

	.results-label {
		margin: 1rem 0 10px 0;
	}

	.results {
		border: 2px solid black;
		border-radius: 5px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.results:hover {
		background-color: #e9f2fc;
	}

	.results-button {
		width: fit-content;
	}
</style>
