<svelte:head>
	<title>Datos del conductor</title>
</svelte:head>

<div style="background: #282748; color: white; font-family: sans-serif;">
	<h2 style="color: white; padding-top: 5px; padding-left: 5px; ">
		Datos del vehículo
	</h2>

	<div class="box" style="color: #282748">
		<h1>Detalles del movil</h1>

		<form>
			<p><strong>Marca:</strong> Toyota</p>
			<p><strong>Modelo:</strong>Vitz</p>
			<p><strong>Ano:</strong>2018</p>
			<p><strong>Numero de chapa:</strong>AAAG201</p>
			<p>
				Horario: <br />
				Salida 07:20<br />
				Vuelta 18:00
			</p>
			<p>
				<label for="ida-vuelta-ambos"
					>Seleccione su viaje Ida, Vuelta o Ambos:</label
				><br />
				<input name="ida-vuelta-ambos" type="radio" value="ida" checked /> Ida
				<br />
				<input name="ida-vuelta-ambos" type="radio" value="vuelta" />
				Vuelta <br />
				<input name="ida-vuelta-ambos" type="radio" value="ambos" /> Ambos
				<br />
			</p>

			<p>
				Forma de pago: <br />
				<input name="forma-pago" type="radio" checked /> Tarjeta de Credito
				<br />
				<input name="forma-pago" type="radio" /> Billetera <br />
				<input name="forma-pago" type="radio" /> Deposito <br />
			</p>
			<p>
				<button type="reset">Cancelar</button>
				<button
					type="button"
					on:click={(e) => {
						e.preventDefault();
						window.location.href = '/datos-conductor';
					}}>Suscripcion</button
				>
			</p>
		</form>
	</div>
</div>

<style>
	body {
		font-family: 'PT Sans', sans-serif;
		background-color: #282748;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.box {
		padding: 100px;
		background-color: #f6c042;
		border-radius: 50px;
	}
	body {
		font-family: sans-serif;
		color: #f6c042;
		font-size: 15px;
		background-color: #282748;
	}
</style>
