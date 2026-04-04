import React from 'react';
import Posts from './Posts.jsx';
import RightSideBar from './RightSideBar.jsx';
import useGetAllPost from '@/hooks/useGetAllPost.jsx';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers.jsx';

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className='flex ml-65'>
      <div>
        <Posts />
      </div>
      <RightSideBar />
    </div>
  );
}

export default Home;