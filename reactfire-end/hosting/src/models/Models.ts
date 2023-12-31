import {Timestamp} from 'rxjs';
import firebase from 'firebase/compat';
import DocumentReference = firebase.firestore.DocumentReference;

export interface Place {
    reference: DocumentReference,
    name_ru: string,
    isCollection: boolean,
    sort: number
}

export interface CityUser {
    name: string,
    photoUrl: string,
    verified: boolean
}
export interface Vehicle {
    model: string
}

export interface Trip {
    dateDeparture: Timestamp<any>,
    countPlaces: number,
    price: number,
}

