<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl, { Marker, Map, Geojson } from 'mapbox-gl';
	import { getRoutes } from '$lib/plugins/firebase';
	import { agregarMarcador, removerMarcador } from '$lib/helpers/mapbox';
	import type { Ruta } from '$lib/types/general';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiYWxleGNhY2VyZXMxMjMiLCJhIjoiY2wwcXpsOW1jMmY1NzNmb2FwbnlybDZ5MCJ9.x-rlp8NGORNNCtNeRsTmLw';
	let mapa: Map;
	let geojson: Geojson;
	let rutas: Ruta[] = [];
	let rutaSeleccionada: Ruta = null;
	let colorDePartida: string = '#0AF';
	let colorDeDestino: string = '#0FA';
	let seleccionandoRuta: boolean = false;
	let popUpEstaAbierto: boolean = false;

	//creamos la funcion linea para empezar a dibujar
	function addLine(pointCoords, mapa) {
		geojson.features[0].geometry.coordinates = [
			...geojson.features[0].geometry.coordinates,
			pointCoords
		];

		mapa.getSource('Ruta').setData(geojson);

		mapa.removeLayer('Ruta');
		mapa.addLayer({
			id: 'LineString',
			type: 'line',
			source: 'LineString',
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				//definimos propiedades de la
				'line-color': '#888',
				'line-width': 8
			}
		});
	}

	function seleccionarRuta(index, map) {
		rutaSeleccionada = rutas[index];
		map.addLayer({
			id: `RutaSeleccionada`,
			type: 'line',
			source: `LineString${index}`,
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				'line-color': '#AA0',
				'line-width': 8
			}
		});
		map.on('click', `RutaSeleccionada`, (e) => {
			map.removeLayer(`RutaSeleccionada`);
			rutaSeleccionada = null;
		});
	}

	function cargarPuntosIniciales(ruta) {
		const puntoDePartida = ruta.puntos[0];
		agregarMarcador(mapa, puntoDePartida, colorDePartida);

		const puntoDeDestino = ruta.puntos[ruta.puntos.length - 1];
		agregarMarcador(mapa, puntoDeDestino, colorDeDestino);
	}

	onMount(async () => {
		rutas = await getRoutes();
		console.log(rutas);
		navigator.geolocation.getCurrentPosition((position) => {
			const { longitude, latitude } = position.coords;

			mapa = new mapboxgl.Map({
				container: 'mapa', // ID
				style: 'mapbox://styles/mapbox/streets-v11', // style URL
				center: [longitude, latitude], // starting position [lng, lat]
				zoom: 15 // starting zoom
			});

			mapa.on('load', () => {
				rutas.forEach((ruta, index) => {
					geojson = {
						type: 'FeatureCollection',
						features: [
							{
								type: 'Feature',
								geometry: {
									type: 'LineString',
									properties: {},
									coordinates: ruta.puntos || []
								}
							}
						]
					};

					mapa.addSource(`LineString${index}`, {
						type: 'geojson',
						data: geojson
					});

					mapa.addLayer({
						id: `LineString${index}`,
						type: 'line',
						source: `LineString${index}`,
						layout: {
							'line-join': 'round',
							'line-cap': 'round'
						},
						paint: {
							'line-color': '#BF93E4',
							'line-width': 8
						}
					});

					cargarPuntosIniciales(ruta);

					mapa.on('click', `LineString${index}`, (e) => {
						if (rutaSeleccionada !== rutas[index]) {
							if (rutaSeleccionada) {
								mapa.removeLayer(`RutaSeleccionada`);
							}
							setTimeout(() => {
								seleccionarRuta(index, mapa);
								popUpEstaAbierto = true;
							}, 100);
						}
					});
				});
			});
		});
	});
</script>

<svelte:head>
	<title>usuario</title>
</svelte:head>

<!-- MAPA -->
<div id="mapa" style="height: 500px; width: 100%" />

<!-- MENU -->
{#if popUpEstaAbierto}
	<div>
		<ol>
			<li>
				<p>
					Ubica tu punto de partida <span style="color: {colorDePartida}"
						>☻</span
					>
				</p>
			</li>
			<li>
				<p>
					Ubica tu punto de destino <span style="color: {colorDeDestino}"
						>☻</span
					>
				</p>
			</li>
			<li>
				<p>
					Ruta seleccionada <span style="color: #AA0">☻</span>
				</p>
			</li>
		</ol>
	</div>

	<button>Confirmar Ruta</button>

	<!-- <div>
		<h3>Información de la ruta</h3>
		informaci
	</div> -->
{/if}

<!-- pop-up to confirm the selected route -->
{#if seleccionandoRuta}
	<!-- <div id="popup" class="popup">
		<div class="popup-content">
			<p>¿Estás seguro que quieres seleccionar esta ruta?</p>
			<button
				on:click={() => {
					functionFijarRutaSeleccionada(rutaSeleccionada);
				}}
			>
				<p>Sí</p>
			</button>
			<button on:click={quitarRutasSeleccionadas}>
				<p>No</p>
			</button>
		</div>
	</div> -->
{/if}

<style>
	.popup {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		border-radius: 5px;
		padding: 20px;
		box-shadow: 0px 0px 10px #000;
		z-index: 1;
	}
</style>
