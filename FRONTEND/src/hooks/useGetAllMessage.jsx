import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setMessages } from "@/redux/chatSlice";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedProfile } = useSelector(store => store.auth);
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/message/all/${selectedProfile?._id}`, {
                    credentials: 'include',
                });
                const data = await res.json();
                dispatch(setMessages(data.messages));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllMessage();
    }, [selectedProfile])
}

export default useGetAllMessage;