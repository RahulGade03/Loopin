import React from 'react'
import { useSelector } from 'react-redux'
import SuggestedUserCard from './SuggestedUserCard';

const RightSideBar = () => {
  const { suggestedUsers } = useSelector(store => store.auth);
  return (
    <div className='fixed top-4 right-4
        w-[40vw] h-[80vh]
        bg-gray backdrop-blur-lg
        shadow-xl rounded-2xl
        border border-gray-200
        p-4 flex flex-col items-center space-y-3'>
      {
        suggestedUsers?.map((user) => {
          return(
            <SuggestedUserCard user={user}/>
          )
        })
      }
    </div>
  )
}

export default RightSideBar