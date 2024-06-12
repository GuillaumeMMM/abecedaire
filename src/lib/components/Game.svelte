<script lang="ts">
	import { goto } from '$app/navigation';
	import { FirstLetter, type Game } from '$lib/types/Game';
	import type { Summary } from '$lib/types/Summary';
	import { browser } from '$app/environment';
	import GameSuccess from './GameSuccess.svelte';
	import GameProgression from './GameProgression.svelte';
	import { GAME_TIME_LENGTH } from '$lib/constants';
	import { formatDate, intlTimeFormater, isValidInput, normalizeString } from '$lib/utils';
	import { onDestroy, onMount } from 'svelte';

	export let game: Game;
	export let date: string;

	let currentValueTypes = '';
	let currentValueError = '';
	let currentValueWarning = '';

	const summaryStr = browser ? localStorage.getItem(`abc-summary-data-${date}`) : null;
	const summary: Summary | null = summaryStr ? JSON.parse(summaryStr) : null;

	const allLetters: FirstLetter[] = Object.values(FirstLetter);

	$: isToday = new Date(date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);

	let foundElements: { [key in FirstLetter]?: string } = summary?.found ?? {};
	$: timeLeft = summary?.duration ?? GAME_TIME_LENGTH;

	$: gameFirstLetters = Object.keys(game.values) as FirstLetter[];
	$: missingFirstLetters = (Object.keys(FirstLetter) as FirstLetter[]).filter(
		(letter) => !gameFirstLetters.includes(letter)
	);
	$: foundFirstLetters = Object.keys(foundElements)
		.map(normalizeString)
		.sort((a, b) => (a > b ? 1 : -1)) as FirstLetter[];

	$: isGameSuccess = foundFirstLetters.length === gameFirstLetters.length || timeLeft <= 0;

	let interval: ReturnType<typeof setInterval>;

	function startInterval() {
		interval = setInterval(() => {
			if (!isGameSuccess) {
				timeLeft -= 1;
				updateLSSummary();
			}
		}, 1000);
	}

	onMount(() => {
		startInterval();
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	function updateLSSummary() {
		if (browser) {
			localStorage.setItem(
				`abc-summary-data-${date}`,
				JSON.stringify({
					found: foundElements,
					date: date,
					total: gameFirstLetters.length,
					duration: timeLeft
				})
			);
		}
	}

	function isGameFinished() {
		return foundFirstLetters.length === gameFirstLetters.length;
	}

	function onSubmit(event: Event) {
		event.preventDefault();
		const matchingValue = isValidInput(
			currentValueTypes,
			foundFirstLetters,
			missingFirstLetters,
			game.values,
			foundElements
		);
		currentValueError = '';
		currentValueWarning = '';
		const firstLetter = (currentValueTypes ?? '')[0];
		currentValueTypes = '';

		if (matchingValue.type === 'error') {
			currentValueError = 'Proposition invalide';
			return;
		}
		if (matchingValue.type === 'warning') {
			currentValueWarning = matchingValue.value ?? '';
			return;
		}
		foundElements[normalizeString(firstLetter) as FirstLetter] = matchingValue.value ?? '';
		updateLSSummary();
		if (isGameFinished()) {
			goto('game/success');
		}
	}

	function onCurrentValueInput(event: Event) {
		currentValueTypes = (event.target as HTMLInputElement).value;
	}
</script>

<h1 class="abc-title-2">
	Petit bac {isToday ? 'du jour' : `du ${formatDate(date)}`}
</h1>
<div class="instructions">
	<p class="rules">
		Trouvez <span class="rules-theme"
			>{game.categoryGender === 'f' ? 'une' : 'un'} {game.category}</span
		>
		commençant par chaque lettre de l'alphabet.
	</p>
	{#if missingFirstLetters.length > 0}
		<p>
			<span aria-hidden="true">⚠️</span>&nbsp;À part {#if missingFirstLetters.length > 1}les lettres{:else}la
				lettre{/if}{#each missingFirstLetters as letter}
				&nbsp;{letter}{/each} qui n'{#if missingFirstLetters.length > 1}ont{:else}a{/if} pas de solution
		</p>{/if}
	<p class={`timer ${timeLeft < 60 ? 'low' : ''}`}>
		Temps restant : {intlTimeFormater(Math.trunc(timeLeft / 60))}:{intlTimeFormater(timeLeft % 60)}
	</p>
</div>
{#if isGameSuccess}
	<GameSuccess {timeLeft} {foundFirstLetters} {gameFirstLetters} {game} {date} />
{/if}
{#if !isGameSuccess}
	<form on:submit={onSubmit}>
		<label for="current-value"
			>Renseignez {game.categoryGender === 'm' ? 'un' : 'une'} {game.category}</label
		>
		<div class="input-container">
			<input
				type="text"
				id="current-value"
				class="abc-input"
				value={currentValueTypes}
				on:input={onCurrentValueInput}
				aria-invalid={Boolean(currentValueError)}
				aria-describedby="current-value-error"
				autocorrect="off"
				autocomplete="off"
			/>
			<button type="submit" class="abc-cta">Valider</button>
		</div>

		{#if currentValueError}
			<p role="alert" class="alert">{currentValueError}</p>
		{/if}
		{#if currentValueWarning}
			<p role="alert" class="warning">{currentValueWarning}</p>
		{/if}
	</form>
	<GameProgression foundCount={foundFirstLetters.length} totalCount={gameFirstLetters.length} />
	<ul class="found-list">
		{#each allLetters as letter}
			{#if foundFirstLetters.includes(letter)}
				<li>
					<div class="found-item-content">
						<div><span class="found-item-letter">{letter}</span> {foundElements[letter]}</div>
						<span aria-hidden="true">✅</span>
					</div>
				</li>
			{/if}
			{#if missingFirstLetters.includes(letter)}
				<li>
					<div class="missing-item-content">
						<div>
							<span class="found-item-letter">{letter}</span>
							<span class="missing-item-text">Pas de solutions</span>
						</div>
						<span aria-hidden="true">⚪</span>
					</div>
				</li>
			{/if}
		{/each}
	</ul>
{/if}
<a href="/" class="abc-cta return-home"
	><span aria-hidden="true">⬅️&nbsp;&nbsp;</span>Retour à l'accueil</a
>

<style>
	h1 {
		margin-bottom: 1rem;
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
		font-weight: 500;
	}

	.timer {
		font-weight: 500;
	}

	.timer.low {
		color: rgb(238, 1, 60);
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

	.missing-item-content {
		display: flex;
		justify-content: space-between;
		border: 2px solid #b2b2b2;
		padding: 0.5rem 1rem;
		border-radius: 0.2rem;
	}

	.missing-item-text {
		color: rgb(108, 108, 108);
		font-style: italic;
		font-size: 0.9rem;
	}

	.missing-item-content:hover {
		background-color: #f8f8f8;
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

	.warning {
		color: var(--primary-color);
		margin-top: 5px;
	}

	.return-home {
		margin-top: 2rem;
	}

	.found-item-letter {
		background-color: var(--primary-color-light);
		border-radius: 0.3rem;
		padding: 1px 6px;
		margin-right: 10px;
		min-width: 0.8rem;
		display: inline-block;
		text-align: center;
	}
</style>
