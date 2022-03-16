<script lang="ts">
	import { onMount } from 'svelte'; //importando para poder montar al ejecutar
	import mapboxgl, { Marker, Map, Geojson } from 'mapbox-gl'; //importando mapboxgl
	import {
		addRoute,
		getRoute,
		deleteRoute,
		updateRoute
	} from '$lib/plugins/firebase';
	import { agregarMarcador } from '$lib/helpers/mapbox';
	import type { Ruta } from '$lib/types/general';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiYWxleGNhY2VyZXMxMjMiLCJhIjoiY2wwcXpsOW1jMmY1NzNmb2FwbnlybDZ5MCJ9.x-rlp8NGORNNCtNeRsTmLw';
	let mapa;
	let geojson: Geojson;
	let ruta: Ruta;
	let puntos: [number, number][] = [];
	let puntoDePartida: [number, number] = null;
	let puntoDeDestino: [number, number] = null;
	let marcadorDePartida: Marker = null;
	let marcadorDeDestino: Marker = null;

	let colorDePartida: string = '#0AF';
	let colorDeDestino: string = '#0FA';
	let horaDeSalida = '00:00';
	const idConductor = 'jnjVuVWrDKDhoWURj5CE'; // queda estatico por ahora

	let rutaSeEstaCreando: boolean = false;
	let rutaSeEstaEditando: boolean = false;

	function agregarUnPuntoALaRuta(coordenadas) {
		puntos.push(coordenadas);
	} // se agrega un punto a la ruta

	function repintarLinea() {
		// Solo pinta las rutas
		geojson.features[0].geometry.coordinates = puntos;

		mapa.getSource('Ruta').setData(geojson);

		mapa.removeLayer('Ruta');

		mapa.addLayer({
			id: 'Ruta',
			type: 'line',
			source: 'Ruta',
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

	function cargarPuntosIniciales(ruta: Ruta) {
		puntoDePartida = ruta.puntos[0];
		marcadorDePartida = agregarMarcador(
			mapa,
			puntoDePartida,
			colorDePartida,
			false,
			(evento) => {
				const { lng, lat } = evento.target.getLngLat();
				console.log(lng, lat);
				puntoDePartida = [lng, lat];
				puntos[0] = puntoDePartida;
				repintarLinea();
			}
		);

		puntoDeDestino = ruta.puntos[ruta.puntos.length - 1];
		marcadorDeDestino = agregarMarcador(
			mapa,
			puntoDeDestino,
			colorDeDestino,
			false,
			(evento) => {
				const { lng, lat } = evento.target.getLngLat();
				puntoDeDestino = [lng, lat];
				puntos[puntos.length - 1] = puntoDeDestino;
				repintarLinea();
			}
		);
	}

	function crearRuta() {
		rutaSeEstaCreando = true;
	}

	async function guardarRuta() {
		try {
			ruta = await addRoute(idConductor, puntos, horaDeSalida);
			alert('Ruta creada');
		} catch (error) {
			console.log(error);
			alert('Error al guardar la ruta, intente más tarde.');
		} finally {
			rutaSeEstaCreando = false;
		}
	}

	async function borrarRuta() {
		try {
			await deleteRoute(ruta.id);
			alert('Ruta eliminada');
		} catch (error) {
			console.log(error);
			alert('Error al eliminar la ruta, intente más tarde.');
		}
	}

	async function guardarCambiosEnRuta() {
		try {
			await updateRoute(ruta.id, puntos, horaDeSalida);
			alert('Ruta actualizada');
		} catch (error) {
			console.log(error);
			alert('Error al guardar los cambios, intente más tarde.');
		} finally {
			rutaSeEstaEditando = false;
		}
	}

	function editarRuta() {
		rutaSeEstaEditando = true;
		horaDeSalida = ruta.horaDeSalida;
	}

	async function guardarCambios() {
		if (rutaSeEstaEditando) {
			guardarCambiosEnRuta();
		} else {
			guardarRuta();
		}
		window.history.go(0);
	}

	onMount(async () => {
		ruta = await getRoute(idConductor);

		navigator.geolocation.getCurrentPosition((position) => {
			const [longitud, latitud] = [
				position.coords.longitude,
				position.coords.latitude
			];

			const puntosDeLaRuta = ruta?.puntos;

			puntos = puntosDeLaRuta?.length ? puntosDeLaRuta : [[longitud, latitud]];

			mapa = new mapboxgl.Map({
				container: 'mapa', // container ID
				style: 'mapbox://styles/mapbox/streets-v11', // style URL
				center: [longitud, latitud], // starting position [lng, lat]
				zoom: 15 // starting zoom
			});

			geojson = {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						geometry: {
							type: 'LineString',
							properties: {},
							coordinates: puntosDeLaRuta?.length ? puntosDeLaRuta : puntos
						}
					}
				]
			};

			if (puntosDeLaRuta?.length) {
				mapa.setCenter(puntosDeLaRuta[0]);

				cargarPuntosIniciales(ruta);

				horaDeSalida = ruta.horaDeSalida;
			} else {
				marcadorDePartida = agregarMarcador(
					mapa,
					[longitud, latitud],
					colorDePartida,
					true,
					(evento) => {
						const { lng, lat } = evento.target.getLngLat();
						puntoDePartida = [lng, lat];
						puntos[0] = [lng, lat];
						repintarLinea();
					}
				);
			}

			mapa.on('load', () => {
				mapa.addSource('Ruta', {
					type: 'geojson',
					data: geojson
				});
				mapa.addLayer({
					id: 'Ruta',
					type: 'line',
					source: 'Ruta',
					layout: {
						'line-join': 'round',
						'line-cap': 'round'
					},
					paint: {
						'line-color': '#BF93E4',
						'line-width': 8
					}
				});
			});

			mapa.on('click', (puntero) => {
				if (!rutaSeEstaCreando) return;

				const { lng, lat } = puntero.lngLat;

				agregarUnPuntoALaRuta([lng, lat]);

				marcadorDeDestino?.remove();

				marcadorDeDestino = agregarMarcador(
					mapa,
					[lng, lat],
					colorDeDestino,
					true,
					(evento) => {
						const { lng, lat } = evento.target.getLngLat();
						puntoDeDestino = [lng, lat];
						puntos[puntos.length - 1] = puntoDeDestino;
						repintarLinea();
					}
				);
				puntoDeDestino = [lng, lat];

				repintarLinea();
			});
		});
	});
</script>

<svelte:head>
	<title>conductor</title>
</svelte:head>

<div id="mapa" style="height: 60vh; width: 100%" />

<!-- MENU -->
<div>
	<ol>
		<li>
			<p>
				Ubica tu punto de partida <span style="color: {colorDePartida}">☻</span>
			</p>
		</li>
		<li>
			<p>
				Ubica tu punto de destino <span style="color: {colorDeDestino}">☻</span>
			</p>
		</li>
	</ol>
</div>

{#if ruta?.id && !rutaSeEstaEditando}
	<button on:click={borrarRuta}>Cambiar la ruta</button>
	<button on:click={editarRuta}>Cambiar la hora de salida</button>
{:else if !rutaSeEstaEditando && !rutaSeEstaCreando && !ruta?.id}
	<button on:click={crearRuta}>Crear una ruta</button>
{:else}
	<button on:click={guardarCambios}
		>Guardar {rutaSeEstaEditando ? 'los cambios' : 'la ruta'}</button
	>
{/if}
