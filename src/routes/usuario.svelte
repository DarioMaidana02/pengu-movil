<script lang="ts">
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiYWxleGNhY2VyZXMxMjMiLCJhIjoiY2wwcXpsOW1jMmY1NzNmb2FwbnlybDZ5MCJ9.x-rlp8NGORNNCtNeRsTmLw';
	let map;
	let geojson;
	let routes = []; //estamos creando la lista
	let selectedRoute = null; //ruta seleccionada

	function setPoint(pointCoords) {
		const oldPoints = getPoints() || [];
		const newPoints = [...oldPoints, pointCoords];
		const newPointsToString = newPoints.map((point) => point.toString());
		localStorage.setItem('pointCoords', newPointsToString.join('!'));
	} //aca se ingresa en el local store directamente la informacion colectada

	function getPoints() {
		const points = localStorage
			.getItem('pointCoords')
			?.split('!')
			?.map((point) => point.split(','));
		if (points) {
			return points;
		}
	}
	//creamos la funcion linea para empezar a dibujar

	function addLine(pointCoords, map) {
		geojson.features[0].geometry.coordinates = [
			...geojson.features[0].geometry.coordinates,
			pointCoords
		];

		map.getSource('LineString').setData(geojson);

		map.removeLayer('LineString');
		map.addLayer({
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

	function addMarker(coords, map) {
		const marker = new mapboxgl.Marker({
			draggable: false
		})
			.setLngLat(coords)
			.addTo(map);
	}
	function selectRoute(index) {
		selectedRoute = routes[index];
		map.addLayer({
			id: `LineString${index}`,
			type: 'line',
			source: `LineString${index}`,
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				'line-color': '#00BB2D',
				'line-width': 8
			}
		});
	}

	onMount(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			const { longitude, latitude } = position.coords;

			map = new mapboxgl.Map({
				container: 'map', // ID
				style: 'mapbox://styles/mapbox/streets-v11', // style URL
				center: [longitude, latitude], // starting position [lng, lat]
				zoom: 17 // starting zoom
			});

			const coordinates = getPoints();
			coordinates?.forEach((point) => {
				addMarker(point, map);
			});

			geojson = {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						geometry: {
							type: 'LineString',
							properties: {},
							coordinates: coordinates || []
						}
					}
				]
			};

			map.on('load', () => {
				map.addSource('LineString', {
					type: 'geojson',
					data: geojson
				});
				map.addLayer({
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
			map.on('click', 'LineString', () => {
				//coordenadas geometricas
				console.log('rutita');
				// selectRoute();
			});
		});
	});
</script>

<svelte:head>
	<title>usuario</title>
</svelte:head>

<div id="map" style="height: 700px; width: 700px" />
