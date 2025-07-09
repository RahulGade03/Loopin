import { setUserProfile } from '@/redux/authSlice';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await fetch(`http://localhost:8000/api/v1/user/${userId}/profile`, {
          credentials: 'include'
        });
        const data = await userProfile.json();
        // console.log (data);
        if (data.success) {
          dispatch(setUserProfile(data.user));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserProfile();
  }, [userId, dispatch]);
}

export default useGetUserProfile;