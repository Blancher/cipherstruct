import {useContext, useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import CipherCard from '../components/CipherCard';
import {context} from '../store/context';
import Loading from '../components/Loading';
import useHttp from '../hooks/useHttp';

export default function Ciphers() {
    const ctx = useContext(context);
    const navigate = useNavigate();
    const [isLoading, error, sendRequest] = useHttp();
    const [reload, setReload] = useState(false);
    const [ciphers, setCiphers] = useState([]);
    
    const handleReload = () => setReload(prev => !prev);
    const handleCreateCipher = () => navigate('/cipher/new');
    const handleDelete = async(id) => {
        try {
            await sendRequest(`cipher/${id}`, 'DELETE', null, {Authorization: `Bearer ${ctx.token}`});
            setCiphers(prev => prev.filter(cipher => cipher.id !== id));
        } catch(err) {
            return;
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            const response = await sendRequest('cipher');
            setCiphers(response.ciphers);
        };

        dataFetcher();
    }, [reload]);

    return (
        <div className='animate'>
            <h1 className='page'>Home</h1>
            <p id='desc'>Welcome to Cipherstruct! Cipherstruct is a website for creating ciphers that can be used to encrypt and decrypt strings. To create a cipher, you can pass an encryption string that will shift each character a certain number of letters forward or backward in the alphabet. The string should have a pattern of either a plus or minus symbol followed by a single-digit number, looking something like <i>+6-3+7+4-5</i>. The sum of all the numbers in the string must be between -26 and 26.</p>
            <motion.button style={{opacity: ctx.isLoggedIn ? 1 : 0, visibility: ctx.isLoggedIn ? 'visible' : 'hidden'}} onClick={handleCreateCipher} whileHover={{scale: 1.1}} className='button'>Create Cipher</motion.button>
            {isLoading && <Loading/>}
            {error && <p className='error'>{error}</p>}
            {!isLoading && !error && ciphers.length === 0 && <h2 className='center displaycard'>No ciphers.</h2>}
            {ciphers.length > 0 && (
                <div className='ciphers flex'>
                    {ciphers.map(cipher => <CipherCard use onReload={handleReload} onDelete={handleDelete} {...cipher}/>)}
                </div>
            )}
        </div>
    );
}
