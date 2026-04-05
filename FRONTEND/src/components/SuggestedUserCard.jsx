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
        <div className='flex w-[35vw] items-center justify-between text-sm'>
        <Link to={`/profile/${user?._id}`}>
          <div className="pl-[1rem] h-15 flex items-center justify-between space-x-3 w-[25vw] border-2 border-r-white rounded-tl-full rounded-bl-full border-t-blue-600 border-b-blue-600 border-l-blue-600">
            <Avatar className="w-[3rem] h-[3rem] rounded-full overflow-hidden border">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-gray-800 text-lg">{user.username}</h3>
            <h4 className='font-bold'><i>{user.posts.length} {user.posts.length<2 ? "post" : "posts"}</i></h4>
            <h4><b><i>{user.followers.length} {user.followers.length<2 ? "follower" : "followers"}</i></b></h4>
          </div>
        </Link>
        <button className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded-md text-sm transition" onClick={messageHandler}>
                Message
        </button>
      </div>
    </div>
  )
}

export default SuggestedUserCard