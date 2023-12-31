import './Trips.css';
import {useFirestoreDocDataOnce} from 'reactfire';
import {format} from 'date-fns';
import {CityUser, Place, Vehicle} from '../../models/Models';
import React, {useRef, useState} from 'react';

const TripCards = ({trips}: any) => {
    const currencies = [
        {countryCode: 'ru', currencySymbol: '₽'},
        {countryCode: 'ua', currencySymbol: '₴'},
    ];

    return (
        <>
            <ul
            >
                {trips?.map((item: any) => {
                    return (<RowCard
                        trip={item}
                        currencySymbol={currencies.find(c => c.countryCode == item.currencyCountryCode)?.currencySymbol}
                    />);

                })}
            </ul>
        </>
    );
};

export default TripCards;


const RowCard = ({trip, currencySymbol}: any) => {
    const {data: dataDeparture} = useFirestoreDocDataOnce<Place>(trip.departureRef);
    const {data: dataArrival} = useFirestoreDocDataOnce<Place>(trip.arrivalRef);
    const {data: dataDriver} = useFirestoreDocDataOnce<CityUser>(trip.driverRef);
    const {data: dataVehicle} = useFirestoreDocDataOnce<Vehicle>(trip.vehicleRef);
    const [isSelected, setIsSelected] = useState(false);
    const [count, setCount] = useState(1);
    const [myPhone, setMyPhone] = useState(undefined);
    const [myPhoneError, setMyPhoneError] = useState(undefined);

    function renderRoute() {
        return <p className="Route__text">{dataDeparture?.name_ru} - {dataArrival?.name_ru} </p>;
    }

    function renderDriver() {
        return <p className="Driver__text">{dataDriver?.name}</p>;
    }

    function renderVehicle() {
        return <p className="Vehicle__text">{dataVehicle?.model}</p>;
    }

    function renderDriverPhoto() {
        return <img className="circular_image" src={dataDriver?.photoUrl}></img>;
    }

    function renderDetails() {
        return <div>
            <p className="Note__text">{trip?.note}</p>
        </div>;
    }

    const bookTrip = () => {
        console.log('bookTrip', myPhone);
    };
    console.log(myPhone)

    const handleChangeMyPhone = (value) => {
        setMyPhoneError(undefined);
        setMyPhone(value);

    };

    function renderBookingButtons() {
        return <div className="Book_container">
            <button
                className="Book__btn"
                onClick={e => {
                    e.stopPropagation();
                    if (myPhone && myPhone.length == 10) {
                        bookTrip();
                    } else {
                        setMyPhoneError('Длина номера должна быть 10 цифр');
                    }
                }}>Забронировать<br />{count}</button>

            <button
                className="Book__plus_minus"
                onClick={e => {
                    e.stopPropagation();
                    if (count > 1) {
                        setCount(count - 1);
                    }
                }}
            >—
            </button>
            <button
                className="Book__plus_minus"
                onClick={e => {
                    e.stopPropagation();
                    setCount(count + 1);
                }}
            >+
            </button>
            <div className="MyPhoneContainer">
                <input
                    placeholder={'контактный телефон'}
                    className="Phone_input"
                    onChange={
                        handleChangeMyPhone
                    }
                    onClick={e => {
                        e.stopPropagation();
                    }}
                ></input>
                <span className="PhoneError">{myPhoneError}</span>
            </div>
        </div>;
    }

    return (
        <>
            <li
                key={trip.id}
                onClick={() => setIsSelected(!isSelected)}
            >
                <div className="Trips__container">
                    <div className="Trip_item">
                        <div className="Trip_item_left">
                            <div className="time_price_container">
                                <p className="Time">{format(trip.dateDeparture.toDate(), 'H:mm')}</p>
                                <p className="Trip_item_price">{trip.price} {currencySymbol}</p>
                                <p className="Places_text">Мест {trip.countPlaces - (trip?.countBooked ?? 1.0)}</p>
                            </div>
                            {renderRoute()}
                        </div>
                        <div className="Trip_item_center">
                            {renderDriverPhoto()}
                        </div>
                        <div className="Trip_item_right">
                            {renderDriver()}
                            {renderVehicle()}
                        </div>
                    </div>
                    {isSelected && renderDetails()}
                    {isSelected && <div className="Divider"></div>}
                    {isSelected && renderBookingButtons()}
                </div>
            </li>
        </>
    );
};
