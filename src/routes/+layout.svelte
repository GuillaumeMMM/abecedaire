<script lang="ts">
	import '../lib/styles/fonts.css';
	import '../lib/styles/reset.css';
	import '../lib/styles/global.css';
</script>

<svelte:head>
	<title>Abécédaire</title>
	<meta
		name="description"
		content="Chaque jour vous avez 5 minutes pour trouver un mot commençant par chaque lettre de l'alphabet pour un thème donné"
	/>
</svelte:head>

<main class="content">
	<slot />
</main>

<style>
	.content {
		font-family: 'Poppins';
		font-weight: 400;
		font-style: normal;
		line-height: 1.5;

		min-height: 100vh;
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
</style>
