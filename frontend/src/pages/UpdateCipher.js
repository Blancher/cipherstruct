import {useEffect, useContext, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import {motion} from 'framer-motion';
import useInput from '../hooks/useInput';
import useRouteProtection from '../hooks/useRouteProtection';
import Input from '../components/Input';
import Loading from '../components/Loading';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';
import sum from '../util/sum';

export default function NewCipher() {
    useRouteProtection();
    const ctx = useContext(context);
    const params = useParams();
    const navigate = useNavigate();
    const [isLoading, error, sendRequest] = useHttp();
    const [titleInput, titleValid, titleInputClasses, handleTitleChange, handleTitleBlur, handleTitleSubmit, titleInvalid, setTitleInput] = useInput(input => input.length > 0 && input.length <= 15);
    const [stringInput, stringValid, stringInputClasses, handleStringChange, handleStringBlur, handleStringSubmit, stringInvalid, setStringInput] = useInput(input => /^([+-]\d)+$/.test(input) && sum(input));
    const [cipherTitle, setCipherTitle] = useState();

    const handleSubmit = async(e) => {
        e.preventDefault();
        handleTitleSubmit();
        handleStringSubmit();

        if (titleValid && stringValid) {
            try {
                await sendRequest(`cipher/${params.cipherId}`, 'PATCH', JSON.stringify({title: titleInput, string: stringInput}), {'Content-Type': 'application/json', Authorization: `Bearer ${ctx.token}`});
                navigate('/');
            } catch(err) {
                return;
            }
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest(`cipher/${params.cipherId}`);
                setCipherTitle(response.cipher.title);
                setTitleInput(response.cipher.title);
                setStringInput(response.cipher.string);
            } catch(err) {
                return;
            }
        };

        dataFetcher();
    }, []);

    return (
        <div className='animate'>
            {isLoading && <Loading/>}
            {error && <p className='error'>{error}</p>}
            {!isLoading && (
                <>
                    <h1 className='page'>Update {cipherTitle}</h1>
                    <form onSubmit={handleSubmit}>
                        <Input classes={titleInputClasses} invalid={titleInvalid} message='Input length must be between 1 and 15 characters.' inputType='text' placeholder='Title' value={titleInput} onChange={handleTitleChange} onBlur={handleTitleBlur}/>
                        <Input classes={stringInputClasses} invalid={stringInvalid} message={!sum(stringInput) ? 'Sum of numbers must be between -26 and 26 characters.' : 'Encryption string must match format on home page.'} inputType='text' placeholder='Encryption String' value={stringInput} onChange={handleStringChange} onBlur={handleStringBlur}/>
                        <motion.button whileHover={{scale: 1.1}} className='button'>Update Cipher</motion.button>
                    </form>
                </>
            )}
        </div>
    );
}