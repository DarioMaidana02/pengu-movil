<script lang="ts">
	import { onMount } from 'svelte'; //importando para poder montar al ejecutar
	import mapboxgl from 'mapbox-gl'; //importando mapboxgl
	import { addRoute, getRoute } from '$lib/plugins/firebase';
	import { GeoPoint } from 'firebase/firestore/lite';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiYWxleGNhY2VyZXMxMjMiLCJhIjoiY2wwcXpsOW1jMmY1NzNmb2FwbnlybDZ5MCJ9.x-rlp8NGORNNCtNeRsTmLw';
	let mapa;
	let geojson;
	let ruta;
	let rutaEstaSiendoCreada = false;
	const idConductor = 'jnjVuVWrDKDhoWURj5CE'; // queda estatico por ahora

	function addPointToRoute(coordenadas) {
		const geoPoint = new GeoPoint(coordenadas[0], coordenadas[1]);
		ruta.points.push(geoPoint);
	} // se agrega un punto a la ruta

	function addLine(coordenadas, mapa) {
		// Solo pinta las rutas
		geojson.features[0].geometry.coordinates = [
			...geojson.features[0].geometry.coordinates,
			coordenadas
		];

		mapa.getSource('LineString').setData(geojson);

		mapa.removeLayer('LineString');

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

	function agregarMarcador(coordenadas, mapa) {
		// Solo pinta los marcadores
		const marker = new mapboxgl.Marker().setLngLat(coordenadas).addTo(mapa);
	}

	function borrarRuta() {
		// Elimina nuestra ruta
	}

	onMount(async () => {
		// navigator.geolocation.getCurrentPosition(async (position) => {

		mapa = new mapboxgl.Map({
			container: 'mapa', // container ID
			style: 'mapbox://styles/mapbox/streets-v11', // style URL
			zoom: 17 // starting zoom
		});

		ruta = await getRoute(idConductor);

		if (ruta) {
			mapa.setCenter(ruta.points[0]);

			agregarMarcador(ruta.points[0], mapa);
			agregarMarcador(ruta.points[ruta.points.length - 1], mapa);

			geojson = {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						geometry: {
							type: 'LineString',
							properties: {},
							coordinates: ruta.points || []
						}
					}
				]
			};

			mapa.on('load', () => {
				mapa.addSource('LineString', {
					type: 'geojson',
					data: geojson
				});
				mapa.addLayer({
					id: 'LineString',
					type: 'line',
					source: 'LineString',
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
		}

		mapa.on('click', (event) => {
			const { lng, lat } = event.lngLat;
			agregarMarcador([lng, lat], mapa);
			addLine([lng, lat], mapa);
			addPointToRoute([lng, lat]);
		});
		// });
	});
</script>

<svelte:head>
	<title>conductor</title>
</svelte:head>

<div id="mapa" style="height: 700px; width: 700px" />

<!-- <button on:click={saveChanges}>Guardar cambios</button>
<button on:click={cancelChanges}>Cancelar cambios</button> -->

<button on:click={borrarRuta}>Borrar ruta</button>
