import { setPosts } from "@/redux/postSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
    const dispatch = useDispatch ();
    useEffect (() => {
        // console.log ('useEffect started')
        const fetchAllPost = async () => {
            try {
                // console.log ("start")
                const res = await fetch ('http://localhost:8000/api/v1/post/all', {
                    method: 'GET',
                    credentials: 'include',
                });
                // console.log ("mid")
                const data = await  res.json ();
                console.log ("Result: ", data);
                dispatch (setPosts (data.posts));
            } catch (error) {
                console.log (error);
            }
        }
        fetchAllPost ();
    }, [])
}

export default useGetAllPost;