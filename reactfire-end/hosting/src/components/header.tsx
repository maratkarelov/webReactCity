import {Outlet, useNavigate} from 'react-router-dom';
import {useAuth, useUser} from 'reactfire';
import CityCityLogo from '../assets/icon_city.svg';
import {signInAnonymously} from '@firebase/auth';

const Header = () => {
    // Auth
    const auth = useAuth();
    const user = useUser();
    signInAnonymously(auth)
        .then(() => {
            // Signed in..
            console.log('signInAnonymously');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('==============', errorCode, errorMessage);
            // ...
        });

    const navigate = useNavigate();

    return (
        <header>
            <nav className="bg-white px-2 lg:px-4 py-2.5 h-18">
                <div className="flex flex-wrap justify-between items-center max-w-screen">
                    <a
                        href="#"
                        className="flex items-center"
                        onClick={() => navigate('/')}
                    >
                        <img
                            className="mr-3 h-10 sm:h-8"
                            src={CityCityLogo}
                            alt="City"
                        />
                        <span className="mr-3 self-center text-xl whitespace-nowrap font-light bg-blue-700">
                            CityCity
                        </span>
                    </a>
                </div>
            </nav>
            <Outlet context={user?.data?.uid}/>
        </header>
    );

};

export default Header;
