import {useEffect, useState} from 'react';
import {useFirestoreCollectionData, useFirestore, useFirestoreDocData} from 'reactfire';
import {addDoc, setDoc, doc, where, collection, orderBy, query, getFirestore} from 'firebase/firestore';
import TripCards from '../components/trips/tripCards';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Home.css';
import PlacesList from '../components/places/placesList';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
const Home = () => {
    const [selectedDate, onChange] = useState<Value>(new Date());
    const [departureRef, setDepartureRef] = useState(undefined);
    const [arrivalRef, setArrivalRef] = useState(undefined);
    const [departureRefs, setDepartureRefs] = useState<any[]>([]);
    const [arrivalRefs, setArrivalRefs] = useState<any[]>([]);

    const firestore = useFirestore();
    const getTrips = () => {
        let q = query(collection(firestore, 'trips'), where('dateDeparture', '<', selectedDate));
        q = query(q, orderBy('dateDeparture', 'desc'));
        return q;
    };

    const getFilteredTrips = () => {
        let q = query(collection(firestore, 'trips'), where('dateDeparture', '<', selectedDate));
        if (departureRef !== undefined) {
            q = query(q, where('departureRef', '==', departureRef));
        }
        if (arrivalRef !== undefined) {
            q = query(q, where('arrivalRef', '==', arrivalRef));
        }
        q = query(q, orderBy('dateDeparture', 'asc'));
        return q;
    };

    const {data: trips} = useFirestoreCollectionData(
        getTrips(),
        {
            idField: 'id',
        }
    );

    const {data: filteredTrips} = useFirestoreCollectionData(
        getFilteredTrips(),
        {
            idField: 'id',
        }
    );

    console.log(departureRef?.path);
    // console.log(departureRefs?.map((it) => it.id));
    useEffect(() => {
        const departureRefs = trips?.map(trip => trip.departureRef);
        const departurePath = new Set(departureRefs?.map(ref => ref.path));
        const departureRefsSet = [];
        departurePath.forEach(path => {
            departureRefsSet.push(departureRefs.find(ref => ref.path == path));
        });
        setDepartureRefs(departureRefsSet);
        const arrivalRefs = trips?.map(trip => trip.arrivalRef);
        const arrivalPath = new Set(arrivalRefs?.map(ref => ref.path));
        const arrivalRefsSet = [];
        arrivalPath.forEach(path => {
            arrivalRefsSet.push(arrivalRefs.find(ref => ref.path == path));
        });
        setArrivalRefs(arrivalRefsSet);
    }, [trips]);

    const mockData = async () => {
        const db = getFirestore();
        const driverRef = doc(db, 'users', 'user1');
        await setDoc(driverRef, {
            name: 'Victor',
            photoUrl: 'https://firebasestorage.googleapis.com/v0/b/city-city-79092.appspot.com/o/users%2Fily8eqRAjbdSfMGtF62NNl41USL2%2Fprofile%2Fprofile.jpg?alt=media&token=48184d3f-259a-4a51-b87e-c3263461f674'
        });
        const vehicleRef = doc(db, 'vehicles', 'Dodge');
        await setDoc(vehicleRef, {model: 'Dodge'});
        const countryRef = doc(db, 'places', 'Ukraine');
        await setDoc(countryRef, {name_ru: 'Украина'});
        const regionKievRef = doc(countryRef, 'items', 'Kiev_region');
        await setDoc(regionKievRef, {name_ru: 'Киевская область'});
        const regionCherkasyRef = doc(countryRef, 'items', 'Cherkasy_region');
        await setDoc(regionCherkasyRef, {name_ru: 'Черкасская область'});
        const CherkasyRef = doc(regionCherkasyRef, 'items', 'Cherkasy');
        await setDoc(CherkasyRef, {name_ru: 'Черкассы'});
        const DrabovRef = doc(regionCherkasyRef, 'items', 'Drabov');
        await setDoc(DrabovRef, {name_ru: 'Драбов'});
        const KievRef = doc(regionKievRef, 'items', 'Kiev');
        await setDoc(KievRef, {name_ru: 'Киев'});
        const BorispolRef = doc(regionKievRef, 'items', 'Borispol');
        await setDoc(BorispolRef, {name_ru: 'Борисполь'});
        const cities = [CherkasyRef, DrabovRef, KievRef, BorispolRef];
        const min = 0;
        const max = 3;
        for (let i = 0; i < 20; i++) {
            const tripRef = doc(db, 'trips', 'trips_' + i.toString());
            const randDeparture = Math.floor(Math.random() * (max - min + 1)) + min;
            const randArrival = Math.floor(Math.random() * (max - min + 1)) + min;
            console.log(randDeparture, randArrival, cities[randDeparture]?.path, cities[randArrival]?.path);
            await setDoc(tripRef,
                {
                    driverRef: driverRef,
                    vehicleRef: vehicleRef,
                    departureRef: cities[randDeparture],
                    arrivalRef: cities[randArrival],
                    autoConfirmation: true,
                    dateDeparture: new Date(),
                    dateArrival: new Date(),
                    price: 400,
                    countPlaces: 6,
                    countBooked: 2,
                    currencyCountryCode: 'ru',
                    timeZone: '+0400',
                    note: '🅰️  Тольятти Космонавтов 32а, аптека Farmlend. _________________________________________👉  Еду по новой дороге. _________________________________________🅱️  СамараАвроры 211а, кулинария Бико.~~~~~~~~~~~~~~~~~~~~~~~~~~~~✅  Бронь переднего места +50 р.'
                });
        }
        //
    };
    return (
        <div className="Home__container">
            <div className="Home__left">
                <div className="Home__container__content">
                    <Calendar onChange={onChange}/>
                </div>
                <div className="Home__container__content">
                    {/*<button onClick={() => {*/}
                    {/*    mockData();*/}
                    {/*}}>*/}
                    {/*    mock*/}
                    {/*</button>*/}
                    <div className="Places">
                        {departureRefs &&
                            <PlacesList
                                title="Откуда"
                                refs={departureRefs}
                                callback={(path) => {
                                    setDepartureRef(departureRefs.find((ref) => ref.path == path));
                                }}>
                            </PlacesList>}
                        {arrivalRefs &&
                            <PlacesList
                                title="Куда"
                                refs={arrivalRefs}
                                callback={(path) => {
                                    setArrivalRef(departureRefs.find((ref) => ref.path == path));
                                }}
                            ></PlacesList>}
                    </div>
                </div>

            </div>
            <div className="Home__right">
                <TripCards trips={filteredTrips}/>
            </div>
        </div>
    );
};

export default Home;
