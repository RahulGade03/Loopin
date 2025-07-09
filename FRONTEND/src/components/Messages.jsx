import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';
import React from 'react';
import { useSelector } from 'react-redux';

const Messages = () => {
    useGetRTM ();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    return (
        <div className="p-4 space-y-2 max-h-[80vh] overflow-y-auto rounded-lg">
            {
                messages && messages.map((msg) => {
                    const isSender = msg.senderId === user._id;
                    return (
                        <div
                            key={msg._id}
                            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                px-4 py-2 max-w-xs break-words text-sm rounded-lg shadow 
                                ${isSender 
                                    ? 'bg-blue-500 text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 rounded-bl-none'}
                            `}>
                                {msg.message}
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
};

export default Messages;
