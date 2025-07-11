import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Comment from "../models/comment.model.js";
import { getReceiverSocketId, io } from '../socket/socket.js';

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        console.log(authorId);

        if (!image) return res.status(400).json({ message: 'Image required!' });
        const optimisedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimisedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(200).json({
            message: 'New post added!',
            post,
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .popoulate({
                path: 'author',
                select: 'username profilePicture'
            })
            .populate({
                path: 'comment',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            })
        return res.status(200).json({
            posts,
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}

export const likeDislikePost = async (req, res) => {
    try {
        const likeKrneWala = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                messsage: 'Post not found',
                success: false
            });
        }

        //like logic
        const isLiked = post.likes.includes(likeKrneWala)
        if (!isLiked) {
            await post.updateOne({ $addToSet: { likes: likeKrneWala } });
        }
        else {
            await post.updateOne({ $pull: { likes: likeKrneWala } });
        }
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(likeKrneWala).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if (postOwnerId !== likeKrneWala) {
            const notification = {
                type: isLiked ? 'like' : 'dislike',
                userId: likeKrneWala,
                userDetails: user,
                postId,
                message: isLiked ? 'Your post was liked' : 'Your post was disliked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({
            message: isLiked ? 'Post disliked' : 'Post liked',
            status: true,
        })

    } catch (error) {
        console.log(error);
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentKrneWala = req.id;
        const { comment } = req.body;

        const post = await Post.findById(postId);

        if (!comment) {
            return res.status(400).json({
                message: 'Comment is required',
                success: false
            });
        }

        const newComment = await Comment.create({
            text: comment,
            author: commentKrneWala,
            post: postId
        })
        newComment.populate({
            path: 'author',
            select: 'username profilePicture'
        })

        post.comments.push(newComment._id);
        await post.save();

        return res.status(200).json({
            message: 'Comment added',
            success: true,
            comment: newComment
        });
    }
    catch (error) {
        console.log(error);
    }
}

export const getCommentsofPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate({ path: 'author', select: 'username profilePicture' });
        if (!comments) {
            return res.status(400).json({
                message: 'No comments found for this post',
                success: false
            });
        }
        return res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(403).json({
                message: 'Post not found',
                success: false
            });
        }
        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'You are not authorized to delete this post',
                success: false
            });
        }
        await Post.findByIdAndDelete(postId);
        let user = await User.findById(authorId);
        user.posts = user.posts.filter((post) => post.toString() !== postId);
        await user.save();

        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: 'Post deleted'
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAllBookmarks = async (req, res) => {
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
        res.sattus(404).json({
            status: false,
            message: "User not found"
        });
    }
    let bookmarks = (await user.populate('bookmarks'))
    bookmarks = bookmarks.bookmarks;
    if (!bookmarks) {
        res.status(404).json({
            success: false,
            message: "No bookmarks found."
        })
    }
    return res.status(200).json({
        success: true,
        bookmarks: bookmarks
    })
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        let post = await Post.findById(postId);
        post = await post.populate([
            {
                path: 'author',
                select: 'username profilePicture'
            },
            {
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            }
        ]);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        const user = await User.findById(authorId);
        if (user.bookmarks.includes(post._id)) {
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                type: 'unbookmark',
                message: 'Post removed from bookmarks',
                success: true
            });
        }
        else {
            // If post is not bookmarked, bookmark it
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                type: 'bookmark',
                message: 'Post bookmarked',
                success: true
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}