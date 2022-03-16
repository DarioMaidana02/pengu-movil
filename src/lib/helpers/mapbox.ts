import { Marker, Map } from 'mapbox-gl';

export function agregarMarcador(
	mapa: Map,
	coordenadas: [number, number],
	color: string = '#aff',
	draggable: boolean = false,
	onDrop: Function = () => {}
): Marker {
	const options = {
		draggable,
		color
	};
	// Agrega un punto al mapa
	const marcador = new Marker(options)
		.setLngLat(coordenadas)
		.addTo(mapa);

	marcador.on('dragend', onDrop);

	return marcador;
}

export function removerMarcador(marcador: Marker) {
	marcador.remove();
}