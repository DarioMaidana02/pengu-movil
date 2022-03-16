<svelte:head>
	<title>Datos del conductor</title>
</svelte:head>

<body>
	<br /><br /><br /><br /><br /><br />
	<h2>Datos del vehículo/h2>
	
body {
        <br /><br /><br /><br /><br /><br />
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
		</style>

		<div class="box">
			<h1>Detalles del movil</h1>

			<form>
				<p>Marca: <input type="text" /></p>
				<p>Modelo: <input type="text" /></p>
				<p>Ano: <input type="number" /></p>
				<p>Numero de chapa: <input type="text" /></p>
				<p>
					Horario: <br />
					Salida <input type="time" /> <br />
					Vuelta <input type="time" />
				</p>
				<p>
					Seleccione su viaje Ida, Vuelta o Ambos: <br />
					<input type="radio" /> Ida <input type="radio" /> Vuelta
					<input type="radio" /> Ambos
				</p>

				<p>
					Forma de pago: <br />
					<input type="radio" /> Tarjeta de Credito
					<input type="radio" /> Billetera <input type="radio" /> Deposito
				</p>
				<p>
					<button type="reset">Cancelar</button>
					<button type="submit">Suscripcion</button>
				</p>
			</form>
		</div>
	</body>
</html>

	<h3>Nombre del conductor:</h3>
	<h4>Jose</h4>
	<h3>Apellido:</h3>
	<h4>Perez</h4>
	<h3>Numero de telefono:</h3>
	<h4>0975678908</h4>
	<h3>Numero de CI:</h3>
	<h4>2345678</h4>

	<style>
		body {
			font-family: sans-serif;
			color: #f6c042;
			font-size: 15px;
			background-color: #282748;
		}
	</style>
</body>
