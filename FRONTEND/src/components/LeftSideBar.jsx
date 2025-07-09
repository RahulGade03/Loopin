import { Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';

const LeftSideBar = () => {
    const navigate = useNavigate();
    const {user} = useSelector (store => store.auth);
    const dispatch = useDispatch ();
    const [open, setOpen] = useState (false);

    const items = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Chats" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon:
                <Avatar>
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>PF</AvatarFallback>
                </Avatar>,
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ]

    const logoutHandler = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/v1/user/logout");
            const data = await res.json();
            console.log(data);
            if (data.success) {
                dispatch (setAuthUser(null))
                navigate('/login');
                //Toast
            }
        } catch (error) {
            //Toast
            alert(data.message);
        }
    }

    const mapHandler = async (text) => {
        if (text === 'Home') {
            navigate ('/')
        }
        if (text === 'Logout') {
            logoutHandler();
        }
        if (text === 'Create') {
            setOpen (true);
        }
        if (text === 'Profile') {
            navigate (`/profile/${user._id}`);
        }
        if (text === 'Chats') {
            navigate ('/chats');
        }
    }
    return (
        <div className="fixed top-0 left-0 min-h-screen w-64 bg-white border-r border-gray-200 p-6 flex flex-col shadow-lg">
            <h2 className="text-6xl pl-2 mb-4">🚀</h2>

            <div className="flex flex-col space-y-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => mapHandler(item.text)}
                        className="flex items-center space-x-4 p-3 rounded-xl hover:bg-pink-100 cursor-pointer transition-colors"
                    >
                        <div className="text-pink-600">{item.icon}</div>
                        <div className="text-gray-800 font-medium">{item.text}</div>
                    </div>
                ))}
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
}

export default LeftSideBar;