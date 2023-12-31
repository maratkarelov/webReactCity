import './Places.css';
import {Place} from '../../models/Models';
import {useFirestoreDocData} from 'reactfire';
import {useState} from 'react';

const PlacesList = ({refs, title, callback}: any) => {
    const [selectedPath, setSelectedPath] = useState(undefined);
    return (
        <div className="Place_list_container">
            <p className="Place_list_title">
                {title}
            </p>

            <ul

            >
                {refs?.map((placeRef: any) => {
                    return (<PlaceCard
                        placeRef={placeRef}
                        selectedPath={selectedPath}
                        select={(path) => {
                            setSelectedPath(path);
                            callback(path);
                        }}
                    />);

                })}
            </ul>
        </div>
    );

};

export default PlacesList;

const PlaceCard = ({placeRef, selectedPath, select, callback}: any) => {
    const {data: place} = useFirestoreDocData<Place>(placeRef);

    const getBackground = () => {
        if (selectedPath == placeRef.path) {
            return '#ffc515';
        } else {
            return '#eeeeee';
        }

    };

    //
    function renderRoute() {
        return <p
            onClick={
                () => {
                    if (placeRef.path == selectedPath) {
                        select(undefined);
                    } else {
                        select(placeRef.path);
                    }
                }
            }
            style={{backgroundColor: getBackground()}}
            className="Place__text">{place?.name_ru}

        </p>;
    }

    return (
        <>
            <li
                key={placeRef.id}
            >
                {renderRoute()}
            </li>
        </>
    );
};

