import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts} = useSelector(store => store.posts);
  return (
    <>
    {
      posts?.map ((post) => (
        <div className='my-3' key={post?._id}>
        <Post  post={post}/>
        </div>
      ))
    }
    </>
  )
}

export default Posts