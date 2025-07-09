import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addComment, addNewPost, bookmarkPost, deletePost, likeDislikePost, getAllPost, getCommentsofPost, getUserPost, getAllBookmarks } from '../controllers/post.controller.js';

const router = express.Router();

router.route ('/addpost').post(isAuthenticated, upload.single('image'), addNewPost);
router.route ('/all').get(isAuthenticated, getAllPost);
router.route ('/userpost/all').get(isAuthenticated, getUserPost);
router.route ('/:id/likeDislike').get(isAuthenticated, likeDislikePost);
router.route ('/:id/comment').post(isAuthenticated, addComment);
router.route ('/:id/comment/all').post(isAuthenticated, getCommentsofPost);
router.route ('/delete/:id').post(isAuthenticated, deletePost);
router.route ('/:id/bookmark').post(isAuthenticated, bookmarkPost);
router.route ('/allBookmarks').get(isAuthenticated, getAllBookmarks);

export default router;