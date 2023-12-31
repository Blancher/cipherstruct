import {useState, useContext} from 'react';
import {NavLink, Link, useNavigate} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {context} from '../store/context';

export default function Navbar() {
    const ctx = useContext(context);
    const navigate = useNavigate();
    const [showSideBar, setShowSideBar] = useState(false);

    const handleRedirect = () => navigate('/cipher/user');
    const handleOpenSideBar = () => setShowSideBar(true);
    const handleCloseSideBar = () => setShowSideBar(false);

    const navlinks = (
        <>
            <NavLink end to='/' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>Ciphers</NavLink>
            {ctx.isLoggedIn && (
                <>
                    <NavLink to='/cipher/new' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>New Cipher</NavLink>
                    <Link to='/' className='navlink' onClick={ctx.logout}>Logout</Link>
                    <img id='profile' src={`${process.env.REACT_APP_BACKEND_URL}/${ctx.image}`} width='40' height='40' onClick={handleRedirect}/>
                </>
            )}
            {!ctx.isLoggedIn && (
                <>
                    <NavLink to='/login' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>Login</NavLink>
                    <NavLink to='/signup' className={({isActive}) => isActive ? 'navlink active' : 'navlink'}>Signup</NavLink>
                </>
            )}
        </>
    );
    
    return (
        <>
            <div id='nav'>
                <div className='flex' id='nav1'>
                    <h1 id='header'>Cipherstruct</h1>
                    <div id='links' className='flex'>
                        {navlinks}
                    </div>
                </div>
                <div className='flex' id='nav2'>
                    <img id='lines' onClick={handleOpenSideBar} width='50' height='100' src='https://static.thenounproject.com/png/1729058-200.png'/>
                    <h1 id='header'>Cipherstruct</h1>
                </div>
            </div>
            <AnimatePresence>
                {showSideBar && <motion.div onClick={handleCloseSideBar} initial={{opacity: 0}} animate={{opacity: .5}} exit={{opacity: 0}} className='background'></motion.div>}
            </AnimatePresence>
            <AnimatePresence>
                {showSideBar && (
                    <motion.div onClick={handleCloseSideBar} initial={{x: '-500%'}} animate={{x: 0}} exit={{x: '-500%'}} id='sidebar'>
                        <div id='column' className='flex'>
                            {navlinks}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}