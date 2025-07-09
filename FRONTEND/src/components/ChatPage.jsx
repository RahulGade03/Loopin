import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import { useLocation } from 'react-router-dom';
import { setSelectedProfile } from '@/redux/authSlice'
import { setMessages } from '@/redux/chatSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { MessageCircleCode } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Messages from './Messages.jsx'

const ChatPage = () => {
    useGetSuggestedUsers()
    const [textMessage, setTextMessage] = useState();
    const location = useLocation();
    const { suggestedUsers, selectedProfile } = useSelector(store => store.auth)
    const { onlineUsers, messages } = useSelector(store => store.chat)
    const dispatch = useDispatch();
    // console.log(textMessage)

    useEffect(() => {
        if (location.state?.profile) {
            dispatch(setSelectedProfile(location.state.profile));
        }
    }, [location.state, dispatch]);

    const sendMessageHandler = async (e) => {
        try {
            e.preventDefault();
            const res = await fetch(`http://localhost:8000/api/v1/message/send/${selectedProfile?._id}`, {
                credentials: 'include',
                body: JSON.stringify({ message: textMessage }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST"
            })
            const data = await res.json();
            console.log(data);
            if (data.success) {
                console.log(messages);
                dispatch(setMessages([...messages, data.message]));
                // console.log (messages);
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedProfile(null));
        }
    }, [])

    return (
        <div className="h-screen w-full bg-white">
            <div className="ml-65 flex h-full">
                {/* Sidebar */}
                <section className="w-72 border-r border-gray-200 flex flex-col">
                    <div className="px-6 py-4">
                        <h1 className="text-xl font-semibold">Chats</h1>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 px-2">
                        {suggestedUsers?.map((suggestedUser) => {
                            const isOnline = onlineUsers?.includes(suggestedUser?._id);
                            return <div
                                key={suggestedUser._id}
                                onClick={() => dispatch(setSelectedProfile(suggestedUser))}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                                <Avatar className="w-10 h-10 rounded-full border border-gray-300 shadow-sm overflow-hidden">
                                    <AvatarImage
                                        src={suggestedUser.profilePicture}
                                        className="w-full h-full object-cover"
                                    />
                                    <AvatarFallback className="flex items-center justify-center w-full h-full bg-indigo-500 text-white font-bold text-sm">
                                        PF
                                    </AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span className="font-medium truncate">{suggestedUser.username}</span>
                                    <span>{isOnline ? <span className='text-green-400 font-bold'>online</span> : <span className='text-red-500 font-bold'>offline</span>}</span>
                                </div>
                            </div>
                        })}
                    </div>
                </section>

                {/* Chat area */}
                <section className="flex-1 flex flex-col bg-gray-50">
                    {selectedProfile ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
                                <Avatar className="w-10 h-10 rounded-full border border-gray-300 shadow-sm overflow-hidden">
                                    <AvatarImage
                                        src={selectedProfile.profilePicture}
                                        className="w-full h-full object-cover"
                                    />
                                    <AvatarFallback className="flex items-center justify-center w-full h-full bg-indigo-500 text-white font-bold text-sm">
                                        PF
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-semibold">{selectedProfile.username}</h3>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-2">
                                <Messages />
                            </div>

                            {/* Composer */}
                            <form className="flex items-center gap-3 border-t border-gray-200 px-6 py-4" onSubmit={sendMessageHandler}>
                                <input
                                    value={textMessage}
                                    onChange={(e) => { setTextMessage(e.target.value) }}
                                    type="text" autoFocus
                                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Type a message…"
                                />
                                <button type='submit' className="px-4 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700">
                                    Send
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 text-gray-400 gap-2">
                            <MessageCircleCode className="w-16 h-16" />
                            <span className="text-lg">Click on the users to start a chat...</span>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

export default ChatPage