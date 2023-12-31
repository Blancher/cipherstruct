import {useContext, useEffect, useState} from 'react';
import CipherCard from '../components/CipherCard';
import useRouteProtection from '../hooks/useRouteProtection';
import Loading from '../components/Loading';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';

export default function UserCiphers() {
    useRouteProtection();
    const ctx = useContext(context);
    const [isLoading, error, sendRequest] = useHttp();
    const [ciphers, setCiphers] = useState([]);
    const [reload, setReload] = useState(false);

    const handleReload = () => setReload(prev => !prev);

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest('cipher');
                setCiphers(response.ciphers.filter(cipher => cipher.creator.id === ctx.userId));
            } catch(err) {
                return;
            }
        };

        dataFetcher();
    }, [reload]);

    return (
        <div className='animate'>
            <h1 className='page'>Your Ciphers</h1>
            {isLoading && <Loading/>}
            {error && <p className='error'>{error}</p>}
            {!isLoading && !error && ciphers.length === 0 && <h2 className='center displaycard'>You have no ciphers.</h2>}
            {ciphers.length > 0 && (
                <div className='ciphers flex'>
                    {ciphers.map(cipher => <CipherCard use onReload={handleReload} onDelete={() => {}} {...cipher}/>)}
                </div>
            )}
        </div>
    );
}