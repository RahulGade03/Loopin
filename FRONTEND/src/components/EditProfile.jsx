import { setAuthUser } from '@/redux/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const photoRef = useRef();
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch ();
    const navigate = useNavigate ();
    const [loading, setLoading] = useState (false);

    const [info, setInfo] = useState({
        profilePicture: user?.profilePicture || null,
        bio: user.bio,
        gender: user.gender,
        previewURL: null
    })

    const handlePhotoChange = (e) => {
        const photo = e.target.files?.[0];
        const previewURL = URL.createObjectURL(photo);
        setInfo({ ...info, profilePicture: photo, previewURL: previewURL });
    }
    console.log(info)

    const handleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    }

    const handleProfile = async () => {
        setLoading (true);
        const formData = new FormData();
        formData.append('bio', info.bio);
        formData.append('gender', info.gender);
        if (info.profilePicture) {
            formData.append('profilePicture', info.profilePicture);
        }

        try {
            const res = await fetch('https://loopin-839q.onrender.com/api/v1/user/profile/edit', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.json();
            console.log(data);

            if (data.success) {
                dispatch (setAuthUser(data.user));
                navigate (`/profile/${user._id}`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading (false);
        }
    }

    return (
        <div className="mt-15 max-w-md min-w-1/2 mx-auto p-6 space-y-6 bg-white rounded-2xl shadow-lg">
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Profile Picture</h2>
                <Avatar className="w-24 h-24 ring-2 ring-pink-500 rounded-full overflow-hidden">
                    <AvatarImage src={info?.previewURL || info?.profilePicture} className="object-cover" />
                    <AvatarFallback>
                        CN
                    </AvatarFallback>
                </Avatar>
                <input ref={photoRef} onChange={handlePhotoChange} type="file" accept="image/*" className="hidden" />
                <button onClick={() => { photoRef?.current.click() }} className="px-4 py-1 text-sm font-medium text-pink-600 border border-pink-500 rounded-lg hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-400">Change photo</button>
            </div>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">Bio</h2>
                <textarea
                    name='bio'
                    onChange={handleChange}
                    value={info.bio}
                    className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                ></textarea>
            </div>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">Gender</h2>
                <select
                    name="gender"
                    value={info.gender}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                    <option value="" disabled selected>Not set</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            {
                info.gender === undefined || info.gender === "" ? (
                    <span className="block text-sm text-red-500">Specifying gender is compulsory! Please update your gender.</span>
                ) : (
                    <button
                        onClick={handleProfile}
                        className="w-full py-2 font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                        {!loading ? 'Save Profile' : 'Updating...'}
                    </button>
                )
            }
        </div>
    )
}

export default EditProfile;
