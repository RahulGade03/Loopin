import React from 'react';
import Posts from './Posts.jsx';
import RightSideBar from './RightSideBar.jsx';
import useGetAllPost from '@/hooks/useGetAllPost.jsx';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers.jsx';
import LeftSideBar from './LeftSideBar.jsx';

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className='flex'>
      <div>
        <Posts />
      </div>
        <RightSideBar />
    </div>
  );
}

export default Home;