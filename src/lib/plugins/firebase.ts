// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	collection,
	getDocs,
	addDoc,
	GeoPoint,
	getDoc,
	doc,
	query,
	where
} from 'firebase/firestore/lite';

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
export async function getRoutes() {
	const routesCol = collection(db, 'routes');
	const routeSnapshot = await getDocs(routesCol);
	const routeList = routeSnapshot.docs.map((doc) => {
		return {
			id: doc.id,
			points: doc.data().points
		};
	});
	return routeList;
}

export async function addRoute(points) {
	const routesCol = collection(db, 'routes');
	const geoPoints = points.map((point) => {
		return new GeoPoint(point[0], point[1]);
	});
	const routeRef = await addDoc(routesCol, { points: geoPoints });
	return routeRef.id;
}

// Obtener una ruta de la base de datos pasandole el id del conductor
export async function getRoute(id_driver) {
	const colRef = collection(db, 'routes');
	const q = query(colRef, where('id_driver', '==', id_driver));
	const querySnapshot = await getDocs(q);
	console.log(querySnapshot.docs);
	const route = querySnapshot.docs[0].data();
	return {
		...route,
		points: route.points.map((point) => {
			return [point._long, point._lat];
		})
	};
}
