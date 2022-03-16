<svelte:head>
	<title>Pengu movil</title>
</svelte:head>
<div
	style="background-color: #f6c042; height: 100vh; width: 100vw; display: flex; flex-direction: column; place-content: center; font-family: sans-serif;"
>
	<button
		class="button"
		on:click={(e) => {
			e.preventDefault();
			window.location.href = '/conductor';
		}}
	>
		Entrar como conductor
	</button>
	<button
		class="button"
		on:click={(e) => {
			e.preventDefault();
			window.location.href = '/usuario';
		}}
	>
		Entrar como usuario
	</button>
</div>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.button {
		padding: 1rem 2rem;
		background-color: #282748;
		color: white;
		width: 50%;
		margin: 20px auto;
		font-size: large;
		border-radius: 10px;
		cursor: pointer;
		box-shadow: #282748 0px 0px 10px;
	}
</style>
