import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Root from './pages/Root';
import Ciphers from './pages/Ciphers';
import Error from './pages/Error';
import Login from './pages/Login';
import NewCipher from './pages/NewCipher';
import Signup from './pages/Signup';
import SingleCipher from './pages/SingleCipher';
import UpdateCipher from './pages/UpdateCipher';
import UserCiphers from './pages/UserCiphers';
import {ContextProvider} from './store/context';

const router = createBrowserRouter([
  {path: '/', element: <Root/>, errorElement: <Error/>, children: [
    {index: true, element: <Ciphers/>},
    {path: '/cipher/new', element: <NewCipher/>},
    {path: '/cipher/use/:cipherId', element: <SingleCipher/>},
    {path: '/cipher/update/:cipherId', element: <UpdateCipher/>},
    {path: '/login', element: <Login/>},
    {path: '/signup', element: <Signup/>},
    {path: '/cipher/user', element: <UserCiphers/>},
  ]}
]);

export default function App() {
  return (
    <ContextProvider>
      <RouterProvider router={router}/>
    </ContextProvider>
  );
}