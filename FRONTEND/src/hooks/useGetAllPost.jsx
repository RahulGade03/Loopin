import { setPosts } from "@/redux/postSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
    const dispatch = useDispatch ();
    useEffect (() => {
        const fetchAllPost = async () => {
            try {
                const res = await fetch (`${import.meta.env.VITE_BACKEND_BASE_URL}/post/all`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await  res.json ();
                dispatch(setPosts(data.posts));
            } catch (error) {
                console.log (error);
            }
        }
        fetchAllPost ();
    }, [])
}

export default useGetAllPost;