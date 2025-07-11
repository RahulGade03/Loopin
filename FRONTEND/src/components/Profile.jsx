import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { setSelectedProfile, setUserProfile } from '@/redux/authSlice';
import Post from './Post';

const Profile = () => {
  const { id } = useParams();
  useGetUserProfile(id);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userProfile, user } = useSelector(store => store.auth);
  const { selectedPost, posts } = useSelector(store => store.posts);
  // console.log(posts);
  const [activeTab, setActiveTab] = useState('posts');
  const [bookmarks, setBookmarks] = useState([]);
  console.log ("bookmarks: ", bookmarks);

  const isLoggedInUser = user?._id === userProfile?._id;
  const [isFollowing, setIsFollowing] = useState(
    userProfile?.followers?.includes(user._id)
  );
  // console.log (isFollowing);

  useEffect(() => {
    setIsFollowing(userProfile?.followers?.includes(user._id))
  }, [userProfile]);


  if (!userProfile)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        Loading...
      </div>
    );

  const handleFollow = async () => {
    // console.log(userProfile);
    const res = await fetch(
      `https://loopin-839q.onrender.com/api/v1/user/followorunfollow/${userProfile._id}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await res.json();
    // console.log(data);
    if (data.success) {
      let updatedFollowers;
      if (isFollowing) {
        updatedFollowers = userProfile?.followers.filter(
          (follower) => follower !== user._id
        );
      } else {
        updatedFollowers = [...userProfile?.followers, user._id];
      }
      const updatedUserProfile = {
        ...userProfile,
        followers: updatedFollowers,
      };
      dispatch(setUserProfile(updatedUserProfile));
      setIsFollowing(!isFollowing);
    }
  };

  const handleBookmark = async () => {
    setActiveTab('bookmarks');
    const res = await fetch("https://loopin-839q.onrender.com/api/v1/post/allBookmarks", {
      credentials: 'include',
    });
    const data = await res.json();
    setBookmarks(data.bookmarks);
  }
  // console.log(userProfile)
  const messageHandler = () => {
    dispatch(setSelectedProfile(userProfile));
    navigate('/chats', { state: { profile: userProfile } });
  }

  return (
    <div className="max-w-4xl ml-[16rem] px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-8 mb-10">
        <Avatar className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-offset-2 ring-pink-400 shadow-md overflow-hidden">
          <AvatarImage
            src={userProfile.profilePicture}
            className="w-full h-full object-cover"
          />
          <AvatarFallback className="w-full h-full flex items-center justify-center text-3xl font-semibold text-white bg-gray-400">
            CN
          </AvatarFallback>
        </Avatar>


        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 break-words">
            {userProfile.username}
          </h1>

          {isLoggedInUser ? (
            <Link to={'/editprofile'}>
              <button className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm transition">
                Edit Profile
              </button>
            </Link>
          ) : (
            <div className="flex justify-center sm:justify-start gap-4 mt-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md text-sm transition"
                onClick={handleFollow}
              >
                {!isFollowing ? 'Follow' : 'Unfollow'}
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm transition" onClick={messageHandler}>
                Message
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 text-center sm:text-left">
          <div>
            <span className="font-semibold text-xl">
              {userProfile?.followers?.length || 0}
            </span>
            <span className="ml-1 text-gray-600 text-xl">followers</span>
          </div>
          <div>
            <span className="font-semibold text-xl">
              {userProfile.following?.length || 0}
            </span>
            <span className="ml-1 text-gray-600 text-xl">following</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {userProfile.bio && (
        <p className="max-w-2xl mx-auto sm:mx-0 mb-10 text-gray-700 text-center sm:text-left">
          {userProfile.bio}
        </p>
      )}

      {/* Tabs */}
      <div className="flex justify-center sm:justify-start gap-8 border-b pb-3 mb-8 text-lg font-medium">
        <button
          className={`pb-2 ${activeTab === 'posts'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-700 hover:text-blue-500'
            }`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        {
          userProfile._id === user._id &&
          <button
            className={`pb-2 ${activeTab === 'bookmarks'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-700 hover:text-blue-500'
              }`}
            onClick={handleBookmark}
          >
            Bookmarks
          </button>
        }
      </div>

      {
        activeTab === 'posts' &&
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-w-[68rem]">
          {posts?.filter((post) => post.author._id === userProfile._id)
            .map((post) => (
              <Post key={post._id} post={post} />
            ))}
        </div>
      }
      {
        activeTab === 'bookmarks' &&
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-w-[67rem]">
          {
            bookmarks?.map((bookmark) => {
              return <Post key={bookmark._id} post={bookmark} />
            })}
        </div>
      }
    </div>
  );
};

export default Profile;
