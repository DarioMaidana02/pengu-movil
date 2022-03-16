<script>
	import { onMount } from 'svelte';

	onMount(() => {
		alert('Te notificaremos cuando el conductor acepte tu solicitud. 🐧');
	});
</script>

<svelte:head>
	<title>Datos del conductor</title>
</svelte:head>

<div style="background-color: #f6c042; height: 100vh; font-family: sans-serif;">
	<h2 style="color: #282748; padding-left: 5px; padding-top:5px">
		Datos del conductor
	</h2>
	<div
		style="color: white; border-radius: 50px; background: #282748; padding: 20px; padding-bottom: 50px"
	>
		<h2>Foto de perfil:</h2>
		<img
			src="https://cdn-assets-cloud.frontify.com/s3/frontify-cloud-files-us/eyJwYXRoIjoiZnJvbnRpZnlcL2FjY291bnRzXC83NFwvMjI0NjA0XC9wcm9qZWN0c1wvMzE0NjMzXC9hc3NldHNcLzYwXC81OTY4MjMyXC85MWFlMDg5ODYyNzdiMDFjYTk2Mjk5YWFiZjVhZDMxNy0xNjM1MzA0Nzc1LnN2ZyJ9:frontify:-5BvpWxVPaDqK-1G7-yntFSwCiX8Ha16aZ-YbaGjgcY?width=2400"
			alt="foto personal"
			width="250"
			height="250"
		/>
		<h3>Nombre del conductor:</h3>
		<h4>Jose</h4>
		<h3>Apellido:</h3>
		<h4>Perez</h4>
		<h3>Numero de telefono:</h3>
		<h4>0975678908</h4>
		<h3>Numero de CI:</h3>
		<h4>2345678</h4>
	</div>
</div>

<style>
	body {
		color: #f6c042;
		font-size: 15px;
		background-color: #282748;
	}
</style>
