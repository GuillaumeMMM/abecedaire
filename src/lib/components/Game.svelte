<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Game } from '$lib/types/Game';
	import type { Summary } from '$lib/types/Summary';
	import { browser } from '$app/environment';
	import GameSuccess from './GameSuccess.svelte';
	import GameProgression from './GameProgression.svelte';

	export let game: Game;
	export let date: string;

	let currentValueTypes = '';
	let currentValueError = '';

	const summaryStr = browser ? localStorage.getItem(`abc-summary-${date}`) : null;
	const summary: Summary | null = summaryStr ? JSON.parse(summaryStr) : null;

	$: isToday = new Date(date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);

	let foundElements: string[] = summary?.found ?? [];
	$: timeSpent = summary?.duration ?? 0;

	$: isGameSuccess = foundElements.length === game.values.length;

	setInterval(() => {
		if (!isGameSuccess) {
			timeSpent += 1;
			updateLSSummary();
		}
	}, 1000);

	const intlTimeFormater = new Intl.NumberFormat('fr-FR', { minimumIntegerDigits: 2 }).format;

	function updateLSSummary() {
		if (browser) {
			localStorage.setItem(
				`abc-summary-${date}`,
				JSON.stringify({
					found: foundElements,
					date: date,
					total: game.values.length,
					duration: timeSpent
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
		for (const value of game.values) {
			if (!foundElements.includes(value) && isMatch(input, value)) {
				return value;
			}
		}
		return null;
	}

	function isGameFinished() {
		return foundElements.length === game.values.length;
	}

	function onSubmit(event: Event) {
		event.preventDefault();
		const matchingValue = isValidInput(currentValueTypes);
		if (matchingValue !== null) {
			foundElements = [...foundElements, matchingValue];
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
	<p>
		Temps écoulé : {intlTimeFormater(Math.trunc(timeSpent / 60))}:{intlTimeFormater(timeSpent % 60)}
	</p>
	<p>
		Trouvez {game.categoryGender === 'f' ? 'toutes' : 'tous'} les {game.categoryPlural} commençant par
		la lettre {game.letter}.
	</p>
</div>
<GameProgression foundCount={foundElements.length} totalCount={game.values.length} />
{#if isGameSuccess}
	<GameSuccess />
{/if}
<ul class="found-list">
	{#each foundElements as found}
		<li>
			<div class="found-item-content">{found} <span aria-hidden="true">✅</span></div>
		</li>
	{/each}
</ul>
<form on:submit={onSubmit}>
	{#if !isGameSuccess}
		<label for="current-value">Entrez un {game.category} en {game.letter} </label>
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
