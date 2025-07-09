import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageCircle, MoreHorizontal } from 'lucide-react'
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa"
import CommentDialog from './CommentDialog.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts, setSelectedPost } from '@/redux/postSlice.js'
import { Link } from 'react-router-dom'
import { setAuthUser } from '@/redux/authSlice.js'

const Post = ({ post }) => {
  if (!post || !post.likes || !post.author) {
    return null;
  }
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.posts);
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(post.likes.map(String).includes(String(user?._id)));
  const [likes, setLikes] = useState(post.likes.length);
  const [updatedComments, setUpdatedComments] = useState(post.comments);
  const [isBookmarked, setIsBookmarked] = useState(Array.isArray(user?.bookmarks) ? user.bookmarks.map(String).includes(String(post._id)) : false);
  // console.log(isBookmarked);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const deleteHandler = async () => {
    try {
      // console.log("Entered")
      const res = await fetch(`http://localhost:8000/api/v1/post/delete/${post?._id}`, {
        method: 'POST',
        credentials: 'include'
      });
      // console.log("mid")
      const data = await res.json();
      // console.log(data);
      if (data.success) {
        const updatedPosts = posts.filter((postItem) => {
          return postItem?._id !== post?._id;
        })
        dispatch(setPosts(updatedPosts));
        //Toast
      }
    } catch (error) {
      console.log(error);
    }
  }

  const likeDislikeHandler = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/post/${post._id}/likeDislike`, {
        credentials: 'include'
      });
      const data = await res.json();
      // console.log(data);

      let newLikesArray;
      if (data.message === 'Post liked') {
        setIsLiked(true)
        setLikes(likes + 1)
        newLikesArray = [...post?.likes, user._id];
      }
      else {
        setIsLiked(false)
        setLikes(likes - 1)
        newLikesArray = post?.likes.filter((id) => {
          return id != user._id;
        })
      }
      const updatedPosts = posts.map((p) => {
        return p._id === post?._id ? { ...p, likes: newLikesArray } : p;
      })
      dispatch(setPosts(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  }

  const commentHandler = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch(`http://localhost:8000/api/v1/post/${post._id}/comment`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment: text
        })
      });
      const data = await res.json();
      // console.log(data);
      if (data.success) {
        const updatedCommentData = [...updatedComments, data.comment];
        setUpdatedComments(updatedCommentData);
        const updatedPosts = posts.map((p) => (
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        ))
        dispatch(setPosts(updatedPosts));
        //Toast
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const bookmarkHandler = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/post/${post._id}/bookmark`, {
        credentials: 'include',
        method: 'POST',
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        let updatedUser;
        if (data.type === 'bookmark') {
          const currentBookmarks = Array.isArray(user?.bookmarks) ? user.bookmarks : [];
          updatedUser = {
            ...user,
            bookmarks: [...currentBookmarks, post._id]
          }
          setIsBookmarked(true);
        }
        else {
          const updatedBookmarks = (Array.isArray(user?.bookmarks) ? user.bookmarks : []).filter(
            (id) => id != post._id
          );
          updatedUser = {
            ...user,
            bookmarks: updatedBookmarks
          }
          setIsBookmarked(false);
        }
        dispatch(setAuthUser(updatedUser));
        // console.log(user);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCommentDialog = () => {
    dispatch(setSelectedPost(post));
    setOpen(true);
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to={`/profile/${post.author._id}`}>
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 rounded-full overflow-hidden border">
              <AvatarImage src={post.author.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-gray-800">{post.author.username}</h3>
            {user?._id === post.author._id && <Badge>Author</Badge>}
          </div>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-800" />
          </DialogTrigger>
          <DialogContent className="w-64" hideClose>
            <button className="rounded-md block w-full text-center px-4 py-2 hover:bg-gray-100">Unfollow</button>
            <button className="rounded-md block w-full text-center px-4 py-2 hover:bg-gray-100">Add to favourites    </button>
            {
              user && user?._id === post?.author._id && <button onClick={deleteHandler} className="rounded-md block w-full text-center px-4 py-2 hover:bg-red-100 text-red-600">Delete</button>
            }
          </DialogContent>
        </Dialog>
      </div>

      {/* Image */}
      <div className="rounded-lg overflow-hidden" onClick={handleCommentDialog}>
        <img
          src={post.image}
          alt="Post"
          className="w-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-4 text-xl text-gray-700">
          {
            !isLiked ? <FaRegHeart className="cursor-pointer hover:text-red-500 transition" onClick={likeDislikeHandler} /> : <FaHeart onClick={likeDislikeHandler} />
          }
          <MessageCircle
            className="cursor-pointer hover:text-blue-500 transition"
            onClick={handleCommentDialog}
          />
        </div>
        {
          isBookmarked ? <FaBookmark className="text-xl cursor-pointer hover:text-yellow-500 transition" onClick={bookmarkHandler} /> : <FaRegBookmark className="text-xl cursor-pointer hover:text-yellow-500 transition" onClick={bookmarkHandler} />
        }
      </div>

      {/* Likes */}
      <div className="px-1 text-sm font-semibold text-gray-800">{likes}</div>
      {/* Caption*/}
      <div>{post.caption}</div>

      <span onClick={handleCommentDialog} className="cursor-pointer text-gray-400">{updatedComments.length + " comments"}</span>
      <CommentDialog open={open} setOpen={setOpen} post={post} updatedComments={updatedComments} setUpdatedComments={setUpdatedComments} />

      {/* Comment Input */}
      <form onSubmit={commentHandler} className="border-t pt-3 flex items-center gap-3">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="flex-grow outline-none border-none text-sm bg-transparent placeholder:text-gray-400"
        />
        {text && (
          <button type='submit' className="text-blue-600 text-sm font-semibold cursor-pointer">Post</button>
        )}
      </form>
    </div>
  );
};

export default Post;