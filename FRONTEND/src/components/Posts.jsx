import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.posts);
  return (
    <div>
    {
      posts?.map ((post) => (
        <div className='my-3' key={post?._id}>
        <Post  post={post}/>
        </div>
      ))
    }
    </div>
  )
}

export default Posts