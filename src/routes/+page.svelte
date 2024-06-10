<div class="home">
	<div class="home-content">
		<h1 class="abc-title">Abécédaire</h1>
		<p>
			Chaque jour vous avez <span class="bold">5 minutes</span> pour trouver un mot commençant par
			<span class="bold">chaque lettre de l'alphabet</span>
			pour un thème donné
		</p>
		<div class="actions">
			<a class="abc-cta" href="./game">Jouer</a>
			<a class="abc-cta" href="./summary">Jours précédents</a>
		</div>
	</div>
</div>

<style>
	.home {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		height: 100%;
		text-align: center;
		padding: 1rem;
	}

	.bold {
		font-weight: 500;
		color: var(--primary-color);
	}

	h1 {
		margin-bottom: 1rem;
	}

	p {
		max-width: 400px;
		margin-bottom: 2rem;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
</style>
