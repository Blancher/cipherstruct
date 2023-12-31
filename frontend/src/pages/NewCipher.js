import {useContext} from 'react';
import {useNavigate} from 'react-router-dom'
import {motion} from 'framer-motion';
import useInput from '../hooks/useInput';
import useRouteProtection from '../hooks/useRouteProtection';
import Input from '../components/Input';
import Loading from '../components/Loading';
import useHttp from '../hooks/useHttp';
import {context} from '../store/context';
import sum from '../util/sum';

export default function NewCipher() {
    const ctx = useContext(context);
    useRouteProtection();
    const navigate = useNavigate();
    const [isLoading, error, sendRequest] = useHttp();
    const [titleInput, titleValid, titleInputClasses, handleTitleChange, handleTitleBlur, handleTitleSubmit, titleInvalid] = useInput(input => input.length > 0 && input.length <= 15);
    const [stringInput, stringValid, stringInputClasses, handleStringChange, handleStringBlur, handleStringSubmit, stringInvalid] = useInput(input => /^([+-]\d)+$/.test(input) && sum(input));

    const handleSubmit = async(e) => {
        e.preventDefault();
        handleTitleSubmit();
        handleStringSubmit();

        if (titleValid && stringValid) {
            try {
                await sendRequest('cipher', 'POST', JSON.stringify({title: titleInput, string: stringInput}), {'Content-Type': 'application/json', 'Authorization': `Bearer ${ctx.token}`});
                navigate('/');
            } catch(err) {
                return;
            }
        }
    };

    return (
        <div className='animate'>
            <h1 className='page'>New Cipher</h1>
            {isLoading && <Loading/>}
            {error && <p className='error'>{error}</p>}
            {!isLoading && (
                <form onSubmit={handleSubmit}>
                    <Input classes={titleInputClasses} invalid={titleInvalid} message='Title length must be between 1 and 15 characters.' inputType='text' placeholder='Title' value={titleInput} onChange={handleTitleChange} onBlur={handleTitleBlur}/>
                    <Input classes={stringInputClasses} invalid={stringInvalid} message={!sum(stringInput) ? 'Sum of numbers must be between -26 and 26 characters.' : 'Encryption string must match format on home page.'} inputType='text' placeholder='Encryption String' value={stringInput} onChange={handleStringChange} onBlur={handleStringBlur}/>
                    <motion.button whileHover={{scale: 1.1}} className='button'>Create Cipher</motion.button>
                </form>
            )}
        </div>
    );
}