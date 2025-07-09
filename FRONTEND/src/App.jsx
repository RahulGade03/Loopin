import './App.css';
import Login from './components/Login';
import Signup from './components/Signup.jsx';
import MainLayout from './components/MainLayout.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Profile from './components/Profile.jsx';
import Home from './components/Home.jsx';
import EditProfile from './components/EditProfile.jsx';
import ChatPage from './components/ChatPage.jsx';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { useEffect } from 'react';
import { setOnlineUsers } from './redux/chatSlice';
import ProtectedRoutes from './components/ProtectedRoutes';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: '/', element: <Home /> },
      { path: '/profile/:id', element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
      { path: '/editProfile', element: <ProtectedRoutes><EditProfile /></ProtectedRoutes> },
      { path: '/chats', element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> }
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
]);

function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector (store => store.socketio);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("connect_error", (err) => {
        console.error("Socket error:", err.message);
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    }
    else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;