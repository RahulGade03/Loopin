import { setSuggestedUsers } from '@/redux/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/suggested`, {
                    credentials: 'include'
                });
                const data = await res.json();
                dispatch(setSuggestedUsers(data.users));
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    }, [])
}

export default useGetSuggestedUsers