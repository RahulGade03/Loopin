import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedProfile } = useSelector(store => store.auth);
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await fetch(`https://loopin-839q.onrender.com/api/v1/message/all/${selectedProfile?._id}`, {
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