import {useContext, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import {context} from '../store/context';
import useHttp from '../hooks/useHttp';

export default function CipherCard(props) {
    const ctx = useContext(context);
    const navigate = useNavigate();
    const [isLoading, error, sendRequest] = useHttp();
    const [showModal, setShowModal] = useState(false);
    const [liked, setLiked] = useState(props.likes.includes(ctx.userId));
    const [disliked, setDisliked] = useState(props.dislikes.includes(ctx.userId));

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleRedirect = () => navigate(`/cipher/use/${props.id}`);
    const handleEdit = () => navigate(`/cipher/update/${props.id}`);
    const handleDelete = () => {
        props.onDelete(props.id);
        handleCloseModal();
    };
    const vote = async(path) => {
        try {
            await sendRequest(`cipher/${path}/${props.id}`, 'PATCH', null, {Authorization: `Bearer ${ctx.token}`});
            path.includes('dislike') ? setDisliked(prev => !prev) : setLiked(prev => !prev);
            props.onReload();
        } catch(err) {
            return
        }
    };

    return (
        <>
            <motion.div key={props.id} whileHover={{scale: 1.1}} className='cipher'>
                <div className='redirect' onClick={handleRedirect}></div>
                <h2 className='displaycard'>{props.title}</h2>
                <h3 className='displaycard'>{props.string}</h3>
                <h4 className='displaycard'>{props.creator.username}</h4>
                {ctx.isLoggedIn && (
                    <div className='vote'>
                        <motion.button className={liked ? 'selected' : ''} onClick={() => vote(props.likes.includes(ctx.userId) ? 'unlike' : 'like')} whileHover={{scale: 1.1}}>{props.likes.length} ✓</motion.button>
                        <motion.button className={disliked ? 'selected' : ''} onClick={() => vote(props.dislikes.includes(ctx.userId) ? 'undislike' : 'dislike')} whileHover={{scale: 1.1}}>{props.dislikes.length} ✗</motion.button>
                    </div>
                )}
                {props.use && ctx.userId === props.creator.id && (
                    <div className='change'>
                        <motion.button onClick={handleEdit} whileHover={{scale: 1.1}}>Edit</motion.button>
                        <motion.button onClick={handleShowModal} whileHover={{scale: 1.1}}>Delete</motion.button>
                    </div>
                )}
            </motion.div>
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div initial={{opacity: 0}} animate={{opacity: .5}} exit={{opacity: 0}} className='background'></motion.div>
                        <motion.div id='modal' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                            <h2 id='delete'>Are you sure you want to delete <i>{props.title}</i>?</h2>
                            <div className='flex'>
                                <motion.button onClick={handleDelete} whileHover={{scale: 1.1}}>Yes</motion.button>
                                <motion.button onClick={handleCloseModal} whileHover={{scale: 1.1}}>No</motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}