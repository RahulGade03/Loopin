import React from 'react';
import Posts from './Posts.jsx';
import RightSideBar from './RightSideBar.jsx';
import useGetAllPost from '@/hooks/useGetAllPost.jsx';

const Home = () => {
  useGetAllPost ();
  return (
    <div className='flex ml-65'>
      <div>
        <Posts/>
      </div>
      <RightSideBar/>
    </div>
  );
}

export default Home;