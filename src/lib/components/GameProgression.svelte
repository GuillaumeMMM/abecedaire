<script lang="ts">
	export let foundCount: number;
	export let totalCount: number;

	$: ratio = foundCount / totalCount;

	$: status =
		ratio < 0.3
			? 'Débutant·e'
			: ratio < 0.6
				? 'Intermédiaire'
				: ratio < 0.9
					? 'Confirmé·e'
					: 'Génial·e';
</script>

<div class="game-progression">
	<label for="game-progression" role="status">
		<span aria-hidden="true">{status}</span>
		<span>
			<span class="visually-hidden">Vous en avez trouvé {foundCount} sur {totalCount}</span>
			<span aria-hidden="true">{foundCount}/{totalCount}</span>
		</span>
	</label>
	<progress id="game-progression" max={totalCount} value={foundCount}
		>{foundCount}/{totalCount}</progress
	>
</div>

<style>
	.game-progression {
		display: flex;
		flex-direction: column;
		max-width: 300px;
	}

	.game-progression label {
		display: flex;
		justify-content: space-between;
	}

	.game-progression progress {
		width: 100%;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		border: 0;
		padding: 0;

		white-space: nowrap;
		clip-path: inset(100%);
		clip: rect(0 0 0 0);
		overflow: hidden;
	}
</style>
