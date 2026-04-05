import { setSelectedProfile } from '@/redux/authSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog'
import { Badge, MoreHorizontal } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const SuggestedUserCard = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messageHandler = () => {
    dispatch(setSelectedProfile(user));
    navigate('/chats', { state: { profile: user } });
  }
  return (
    <div>
      <div className='flex w-full items-center justify-around gap-4 shadow-2xl rounded-full px-3'>
        <Link to={`/profile/${user?._id}`}>
          <div className="h-15 flex items-center justify-between space-x-3 w-[20vw]">
            <Avatar className="w-[3rem] h-[3rem] rounded-full overflow-hidden border">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-gray-800">{user.username}</h3>
            <div className='flex-col items-center justify-center'>
              <p className='fond-bold text-xs text-center'><b><i>{user.posts.length}</i></b></p>
              <p className='text-xs text-center'>{user.posts.length < 2 ? "follower" : "followers"}</p>
            </div>
            <div className='flex-col items-center justify-center'>
              <p className='fond-bold text-xs text-center'><b><i>{user.followers.length}</i></b></p>
              <p className='text-xs text-center'>{user.followers.length < 2 ? "follower" : "followers"}</p>
            </div>
          </div>
        </Link>
        <button className="bg-black hover:bg-pink-500 text-white px-3 py-2 rounded-md text-sm transition" onClick={messageHandler}>
          Message
        </button>
      </div>
    </div>
  )
}

export default SuggestedUserCard