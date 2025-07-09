// import { Dialog, DialogContent } from '@radix-ui/react-dialog'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Link } from "react-router-dom";

const CommentDialog = ({ open, setOpen, post, updatedComments, setUpdatedComments }) => {

    const [text, setText] = useState("");
    const dispatch = useDispatch();
    const { posts, selectedPost } = useSelector(store => store.posts);
    const { user } = useSelector(store => store.auth);

    const textHandler = (e) => {
        const text = e.target.value;
        setText(text.trim() ? text : "");
    }

    // console.log ('user._id: ', user._id, '\npost: ', post)

    const commentHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8000/api/v1/post/${selectedPost._id}/comment`, {
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
            console.log(data);
            if (data.success) {
                const updatedCommentData = [...updatedComments, data.comment];
                setUpdatedComments(updatedCommentData);
                const updatedPosts = posts.map((p) => (
                    p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
                ))
                dispatch(setPosts(updatedPosts));
                //Toast
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteHandler = async () => {
        try {
            console.log("Entered")
            const res = await fetch(`http://localhost:8000/api/v1/post/delete/${post?._id}`, {
                method: 'POST',
                credentials: 'include'
            });
            console.log("mid")
            const data = await res.json();
            console.log(data);
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

    return (
        <Dialog open={open}>
            {/* Main pop‑up */}
            <DialogContent
                /* remove Shadcn padding, force full‑bleed content */
                className="w-full max-w-3xl p-0 overflow-hidden rounded-xl border shadow-2xl
                   sm:max-w-4xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur"
                onInteractOutside={() => { setOpen(false) }}
            >
                <DialogTitle></DialogTitle>
                <div className="flex h-[80vh] flex-col md:flex-row">
                    {/* ── Media column ───────────────────────────── */}
                    <div className="relative flex-1 bg-black">
                        <img
                            src={post.image}
                            alt=""
                            className="absolute inset-0 h-full w-full object-contain"
                        />
                    </div>


                    {/* ── Meta / comments column ────────────────── */}
                    <div className="flex w-full max-w-sm flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                            <Link to={`/profile/${post._author}`}>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 rounded-full ring-2 ring-pink-300 overflow-hidden shadow-sm">
                                        <AvatarImage
                                            src={post.author.profilePicture}
                                            className="w-full h-full object-cover"
                                        />
                                        <AvatarFallback className="flex items-center justify-center w-full h-full text-xs font-semibold bg-gray-300 text-white">
                                            CN
                                        </AvatarFallback>
                                    </Avatar>

                                    <span className="text-sm font-semibold">{post.author.username}</span>
                                </div>
                            </Link>

                            {/* … menu */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="rounded-full p-1 transition hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </DialogTrigger>

                                <DialogContent className="w-60 p-0 overflow-hidden rounded-md">
                                    <button className="rounded-md block w-full text-center px-4 py-2 hover:bg-gray-100">Unfollow</button>
                                    <button className="rounded-md block w-full text-center px-4 py-2 hover:bg-gray-100">Add to favourites    </button>
                                    {
                                        user && user?._id === post?.author && <button onClick={deleteHandler} className="rounded-md block w-full text-center px-4 py-2 hover:bg-red-100 text-red-600">Delete</button>
                                    }
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Comments list */}
                        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                            {
                                updatedComments.map(comment => (
                                    <Comment key={comment._id} comment={comment} />
                                ))
                            }
                        </div>

                        {/* Comment composer */}
                        <form
                            onSubmit={commentHandler}
                            className="flex items-center gap-3 border-t px-4 py-3"
                        >
                            <input
                                type="text"
                                value={text}
                                onChange={textHandler}
                                placeholder="Add a comment…"
                                className="flex-1 bg-transparent text-sm outline-none placeholder-zinc-500"
                            />
                            {text && (
                                <button
                                    type="submit"
                                    className="text-sm font-semibold text-blue-500 hover:opacity-80 disabled:opacity-40"
                                >
                                    Post
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CommentDialog