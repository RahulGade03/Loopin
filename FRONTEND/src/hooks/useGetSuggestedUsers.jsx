import { setSuggestedUsers } from '@/redux/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await fetch('https://loopin-839q.onrender.com/api/v1/user/suggested', {
                    credentials: 'include'
                });
                const data = await res.json();
                // console.log(data.users);
                dispatch(setSuggestedUsers(data.users));
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    }, [])
}

export default useGetSuggestedUsers