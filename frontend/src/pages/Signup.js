import {useContext} from 'react';
import {useNavigate} from 'react-router-dom'
import {motion} from 'framer-motion';
import useInput from '../hooks/useInput';
import useImageUpload from '../hooks/useImageUpload';
import Input from '../components/Input';
import ImageUpload from '../components/ImageUpload';
import {context} from '../store/context';
import Loading from '../components/Loading';
import useHttp from '../hooks/useHttp';

export default function Signup() {
    const ctx = useContext(context);
    const navigate = useNavigate();
    const [isLoading, error, sendRequest] = useHttp();
    const [nameInput, nameValid, nameInputClasses, handleNameChange, handleNameBlur, handleNameSubmit, nameInvalid] = useInput(input => input.length > 0 && input.length <= 25);
    const [file, previewUrl, fileValid, filePickerRef, handlePicked, handlePickImage, fileInvalid, fileInputClasses] = useImageUpload();
    const [emailInput, emailValid, emailInputClasses, handleEmailChange, handleEmailBlur, handleEmailSubmit, emailInvalid] = useInput(input => input.length > 0);
    const [passwordInput, passwordValid, passwordInputClasses, handlePasswordChange, handlePasswordBlur, handlePasswordSubmit, passwordInvalid] = useInput(input => input.length >= 8);

    const handleSubmit = async(e) => {
        e.preventDefault();
        handleNameSubmit();
        handleEmailSubmit();
        handlePasswordSubmit();

        if (nameValid && fileValid && emailValid && passwordValid) {
            const formData = new FormData();
            formData.append('username', nameInput);
            formData.append('image', file);
            formData.append('email', emailInput);
            formData.append('password', passwordInput);

            try {
                const response = await sendRequest('user/signup', 'POST', formData);
                ctx.login(response.token, response.userId, response.image);
                navigate('/');
            } catch(err) {
                return;
            }

        }
    };

    return (
        <div className='animate'>
            <h1 className='page'>Signup</h1>
            {isLoading && <Loading/>}
            {error && typeof error === 'object' && (
                <>
                    {error.map(message => <p className='error'>{message}</p>)}
                </>
            )}
            {error && typeof error === 'string' && <p className='error'>{error}</p>}
            {!isLoading && (
                <form onSubmit={handleSubmit}>
                    <Input classes={nameInputClasses} invalid={nameInvalid} message={`Username must be between 1 and 25 characters.`} inputType='text' placeholder='Username' value={nameInput} onChange={handleNameChange} onBlur={handleNameBlur}/>
                    <ImageUpload invalid={fileInvalid} classes={fileInputClasses} filePickerRef={filePickerRef} handlePicked={handlePicked} previewUrl={previewUrl} handlePickImage={handlePickImage} message='File is invalid'/>
                    <Input classes={emailInputClasses} invalid={emailInvalid} message={`Email can't be empty.`} inputType='text' placeholder='Email' value={emailInput} onChange={handleEmailChange} onBlur={handleEmailBlur}/>
                    <Input classes={passwordInputClasses} invalid={passwordInvalid} message='Password must be at least 8 characters.' inputType='password' placeholder='Password' value={passwordInput} onChange={handlePasswordChange} onBlur={handlePasswordBlur}/>
                    <motion.button whileHover={{scale: 1.1}} className='button'>Signup</motion.button>
                </form>
            )}
        </div>
    );
}