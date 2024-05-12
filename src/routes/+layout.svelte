<script lang="ts">
	import '../lib/styles/fonts.css';
	import '../lib/styles/reset.css';
	import '../lib/styles/global.css';
</script>

<main class="content">
	<slot />
</main>

<style>
	.content {
		font-family: 'Poppins';
		font-weight: 400;
		font-style: normal;
		line-height: 1.2;

		min-height: 100vh;
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
</style>
