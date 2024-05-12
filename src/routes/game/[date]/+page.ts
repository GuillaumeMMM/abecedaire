import type { Game } from '$lib/types/Game.js';

export async function load({ fetch, params }) {
	const res = await fetch(`https://guillaume-abcgetdailygame.web.val.run?date=${params.date}`);
	const data: {data: {game: Game, date: string}} = await res.json();
    
	return data.data;
}