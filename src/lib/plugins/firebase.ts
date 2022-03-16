// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	GeoPoint,
	getDoc,
	doc,
	query,
	where,
	QuerySnapshot
} from 'firebase/firestore/lite';

import type { Ruta } from '$lib/types/general'

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
	apiKey: 'AIzaSyB-DHz-C9AhjONVibbhAexa3VYOwmi2s8A',

	authDomain: 'proyecto-crud-9bae3.firebaseapp.com',

	projectId: 'proyecto-crud-9bae3',

	storageBucket: 'proyecto-crud-9bae3.appspot.com',

	messagingSenderId: '323333307485',

	appId: '1:323333307485:web:20d144c4744ca70f71e1b4'
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Get a list of routes from your database
export async function getRoutes(): Promise<Ruta[]> {
	const coleccionDeRutas = collection(db, 'routes');
	const snapshotDeRutas = await getDocs(coleccionDeRutas);
	const rutas: Ruta[] = snapshotDeRutas.docs.map(doc => {
		return {
			id: doc.id,
			idConductor: doc.data().idConductor,
			puntos: doc.data().points.map((point) => {
				return [point._long, point._lat];
			}),
			horaDeSalida: new Date(doc.data().horaDeSalida),

		};
	});
	return rutas;
}

export async function addRoute(idConductor, puntos, horaDeSalida): Promise<Ruta> {
	const coleccionDeRutas = collection(db, 'routes');
	const geoPuntos = puntos.map((point) => {
		return new GeoPoint(point[0], point[1]);
	});
	const referenciaDeRuta = await addDoc(coleccionDeRutas, { idConductor, puntos: geoPuntos, horaDeSalida });
	return {
		id: referenciaDeRuta.id,
		idConductor,
		puntos,
		horaDeSalida
	};
}

// Obtener una ruta de la base de datos pasandole el id del conductor
export async function getRoute(idConductor: string): Promise<Ruta> {
	const referenciaDeColeccion = collection(db, 'routes');
	const q = query(referenciaDeColeccion, where('idConductor', '==', idConductor));
	const querySnapshot = await getDocs(q);
	console.log(querySnapshot.docs);
	if (querySnapshot.docs.length) {
		const route = querySnapshot.docs[0].data();
		return {
			id: querySnapshot.docs[0].id,
			puntos: route.puntos.map((punto) => {
				return [punto._long, punto._lat];
			}),
			idConductor: querySnapshot.docs[0].data().idConductor,
			horaDeSalida: new Date(querySnapshot.docs[0].data().horaDeSalida),
		};
	} else {
		return null;
	}
}

export async function deleteRoute(idRuta: string) {
	const referenciaDeRuta = doc(db, 'routes', idRuta);
	await deleteDoc(referenciaDeRuta);
	alert('Ruta eliminada');
}
