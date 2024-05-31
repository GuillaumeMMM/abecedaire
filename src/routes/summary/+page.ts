import type { Game } from "$lib/types/Game.js";

export const ssr = false;
export async function load({ fetch }) {
	const today = new Date(Date.now()).toISOString().split('T')[0]
	const res = await fetch(`https://guillaume-abcgetdailygame.web.val.run?date=all&today=${today}`);
	const data: {data: {date: string, game: Game}[]} = await res.json();

	return {dates: data.data.map(date => date.date)};
}