import type { FirstLetter, Game } from './types/Game';

export const intlTimeFormater = new Intl.NumberFormat('fr-FR', { minimumIntegerDigits: 2 }).format;

export function formatDate(date: string) {
	return new Date(date).toLocaleDateString('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function normalizeString(str: string) {
	return str
		.toUpperCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '');
}

export function isValidInput(
	input: string,
	foundFirstLetters: FirstLetter[],
	missingFirstLetters: FirstLetter[],
	gameValues: Game['values'],
	foundElements: { [key in FirstLetter]?: string }
):
	| { type: 'success'; value: string }
	| { type: 'error'; value: null }
	| { type: 'warning'; value: string } {
	if (!input) {
		return { type: 'error', value: null };
	}
	const firstLetter = normalizeString(input[0]) as FirstLetter;

	if (foundFirstLetters.includes(firstLetter)) {
		return {
			type: 'warning',
			value: `Vous avez déjà une solution pour la lettre ${firstLetter}`
		};
	}

	if (missingFirstLetters.includes(firstLetter)) {
		return {
			type: 'warning',
			value: `Aucune solution possible ne commence par la lettre ${firstLetter}`
		};
	}

	for (const value of gameValues[firstLetter] ?? []) {
		if (
			!foundElements[firstLetter]?.includes(value.label) &&
			isMatch(input, value.aliases ?? [value.label])
		) {
			return { type: 'success', value: value.label };
		}
	}
	return { type: 'error', value: null };
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
	const costs = [];
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

function isMatch(str: string, aliases: string[]) {
	return aliases.some((alias) => similarity(normalizeString(alias), normalizeString(str)) > 0.87);
}
