import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {motion} from 'framer-motion';
import useInput from '../hooks/useInput';
import Input from '../components/Input';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';
import cipher from '../util/cipher';

export default function SingleCipher() {
    const params = useParams();
    const [isLoading, error, sendRequest] = useHttp();
    const [textInput, textValid, textInputClasses, handleTextChange, handleTextBlur, handleTextSubmit, textInvalid] = useInput(input => input.length > 0);
    const [select, setSelect] = useState('encrypt');
    const [title, setTitle] = useState('');
    const [string, setString] = useState('');
    const [result, setResult] = useState('');

    const handleSelectChange = e => setSelect(e.target.value);
    const handleSubmit = e => {
        e.preventDefault();
        handleTextSubmit();

        if (textValid) {
            setResult(cipher(textInput, string, select));
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest(`cipher/${params.cipherId}`);
                setTitle(response.cipher.title);
                setString(response.cipher.string);
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
                    <h1 className='page'>{title}</h1>
                    <p id='desc'>To use the cipher, type something and choose to either encrypt or decrypt it. The encryption string will be used on the text.</p>
                    <form onSubmit={handleSubmit}>
                        <Input classes={textInputClasses} invalid={textInvalid} message={`Input can't be empty.`} inputType='text' placeholder='Text' onChange={handleTextChange} onBlur={handleTextBlur} value={textInput}/>
                        <div className='use'>
                            <select className='select' onChange={handleSelectChange}>
                                <option value='encrypt'>encrypt</option>
                                <option value='decrypt'>decrypt</option>
                            </select>
                            <motion.button whileHover={{scale: 1.1}}>Submit</motion.button>
                        </div>
                    </form>
                    <h2 id='changedtext'>{result}</h2>
                </>
            )}
        </div>
    );
}