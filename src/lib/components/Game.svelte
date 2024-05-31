<script lang="ts">
	import { goto } from '$app/navigation';
	import { FirstLetter, type Game } from '$lib/types/Game';
	import type { Summary } from '$lib/types/Summary';
	import { browser } from '$app/environment';
	import GameSuccess from './GameSuccess.svelte';
	import GameProgression from './GameProgression.svelte';

	export let game: Game;
	export let date: string;

	let currentValueTypes = '';
	let currentValueError = '';

	const summaryStr = browser ? localStorage.getItem(`abc-summary-data-test-${date}`) : null;
	const summary: Summary | null = summaryStr ? JSON.parse(summaryStr) : null;

	$: isToday = new Date(date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);

	let foundElements: { [key in FirstLetter]?: string } = summary?.found ?? {};
	$: timeLeft = summary?.duration ?? 300;

	$: gameFirstLetters = Object.keys(game.values) as FirstLetter[];
	$: missingFirstLetters = (Object.keys(FirstLetter) as FirstLetter[]).filter(
		(letter) => !gameFirstLetters.includes(letter)
	);
	$: foundFirstLetters = Object.keys(foundElements) as FirstLetter[];

	$: isGameSuccess = foundFirstLetters.length === gameFirstLetters.length || timeLeft === 0;

	setInterval(() => {
		if (!isGameSuccess) {
			timeLeft -= 1;
			updateLSSummary();
		}
	}, 1000);

	const intlTimeFormater = new Intl.NumberFormat('fr-FR', { minimumIntegerDigits: 2 }).format;

	function updateLSSummary() {
		if (browser) {
			localStorage.setItem(
				`abc-summary-data-test-${date}`,
				JSON.stringify({
					found: foundElements,
					date: date,
					total: gameFirstLetters.length,
					duration: timeLeft
				})
			);
		}
	}

	function similarity(s1: string, s2: string) {
		let longer = s1;
		let shorter = s2;
		if (s1.length < s2.length) {
			longer = s2;
			shorter = s1;
		}
		const longerLength = longer.length;
		if (longerLength == 0) {
			return 1.0;
		}
		return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength.toString());
	}

	function editDistance(s1: string, s2: string) {
		const costs = new Array();
		for (let i = 0; i <= s1.length; i++) {
			let lastValue = i;
			for (let j = 0; j <= s2.length; j++) {
				if (i == 0) costs[j] = j;
				else {
					if (j > 0) {
						let newValue = costs[j - 1];
						if (s1.charAt(i - 1) != s2.charAt(j - 1))
							newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
						costs[j - 1] = lastValue;
						lastValue = newValue;
					}
				}
			}
			if (i > 0) costs[s2.length] = lastValue;
		}
		return costs[s2.length];
	}

	function isMatch(str: string, alias: string) {
		return (
			similarity(
				alias
					.toLowerCase()
					.normalize('NFD')
					.replace(/\p{Diacritic}/gu, ''),
				str
					.toLowerCase()
					.normalize('NFD')
					.replace(/\p{Diacritic}/gu, '')
			) > 0.87
		);
	}

	function isValidInput(input: string) {
		const firstLetter = input[0].toUpperCase();
		for (const value of game.values[firstLetter as FirstLetter]) {
			if (!foundElements[firstLetter as FirstLetter]?.includes(value) && isMatch(input, value)) {
				return value;
			}
		}
		return null;
	}

	function isGameFinished() {
		return foundFirstLetters.length === gameFirstLetters.length;
	}

	function onSubmit(event: Event) {
		event.preventDefault();
		const matchingValue = isValidInput(currentValueTypes);
		if (matchingValue !== null) {
			foundElements[matchingValue[0] as FirstLetter] = matchingValue;
			currentValueTypes = '';
			currentValueError = '';
			updateLSSummary();
			if (isGameFinished()) {
				goto('game/success');
			}
		} else {
			currentValueError = 'Proposition invalide';
		}
	}

	function onCurrentValueInput(event: Event) {
		currentValueTypes = (event.target as HTMLInputElement).value;
	}
</script>

<h1 class="abc-title-2">
	Abécédaire {isToday
		? 'du jour'
		: `du ${new Date(date).toLocaleDateString('fr-FR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}`}
</h1>
<div class="instructions">
	<p class="rules">
		Trouvez <span class="rules-theme"
			>{game.categoryGender === 'f' ? 'une' : 'un'} {game.category}</span
		>
		commençant par chaque lettre de l'alphabet {#if missingFirstLetters.length > 0}
			<span>
				(à part les lettres{#each missingFirstLetters as letter}
					&nbsp;{letter}{/each}) qui n'ont pas de solution</span
			>{/if}.
	</p>
	<p class="timer">
		Temps restant : {intlTimeFormater(Math.trunc(timeLeft / 60))}:{intlTimeFormater(timeLeft % 60)}
	</p>
</div>
<GameProgression foundCount={foundFirstLetters.length} totalCount={gameFirstLetters.length} />
{#if isGameSuccess}
	<GameSuccess />
{/if}
<ul class="found-list">
	{#each foundFirstLetters as found}
		<li>
			<div class="found-item-content">
				{foundElements[found]} <span aria-hidden="true">✅</span>
			</div>
		</li>
	{/each}
</ul>
<form on:submit={onSubmit}>
	{#if !isGameSuccess}
		<label for="current-value">Renseignez un {game.category}</label>
		<div class="input-container">
			<input
				type="text"
				id="current-value"
				class="abc-input"
				value={currentValueTypes}
				on:input={onCurrentValueInput}
				aria-invalid={Boolean(currentValueError)}
				aria-describedby="current-value-error"
			/>
			<button type="submit" class="abc-cta">Valider</button>
		</div>
	{/if}

	{#if currentValueError && !isGameSuccess}
		<p role="alert" class="alert">{currentValueError}</p>
	{/if}
</form>
<a href="/" class="abc-cta return-home"
	><span aria-hidden="true">⬅️&nbsp;&nbsp;</span>Retour à l'accueil</a
>

<style>
	h1 {
		margin-bottom: 2rem;
	}

	.instructions {
		margin: 1rem 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.rules {
		overflow-wrap: anywhere;
	}

	.rules-theme {
		font-weight: 600;
	}

	.timer {
		font-weight: 600;
	}

	.found-list li {
		margin: 5px 0;
		width: 300px;
		max-width: 100%;
	}

	.found-list li:hover {
		background-color: #17ba3214;
	}

	.found-item-content {
		display: flex;
		justify-content: space-between;
		border: 2px solid #17ba32;
		padding: 0.5rem 1rem;
		border-radius: 0.2rem;
	}

	form {
		margin: 1rem 0;
	}

	.input-container {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	form label {
		display: block;
		margin-bottom: 2px;
	}

	.input-container input {
		width: calc(300px - 1rem);
		max-width: calc(100% - 1rem);
	}

	.alert {
		color: red;
		margin-top: 5px;
	}

	.return-home {
		margin-top: 2rem;
	}
</style>
