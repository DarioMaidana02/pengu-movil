<svelte:head>
	<title>Travel share</title>
</svelte:head>
<section>
	<h1>Travel Share</h1>
	<p>
		Es una plataforma que conecta a conductores y pasajeros que comparten origenes, destinos y
		paradas comunes en la ruta
	</p>
	}
</section>
<button>
	<a href="/conductor">El conductor marca su ruta</a>
</button>
<br />
<br />
<br />
<button>
	<a href="/usuario">El usuario puede ver las rutas disponibles</a>
</button>
<br />
<br />
<br />

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
</style>
