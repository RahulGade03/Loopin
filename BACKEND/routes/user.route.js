import express from 'express';
import {editProfile, getProfile, followOrUnfollow, getSuggestedUsers, login, logout, register} from '../controllers/user.controller.js';
import upload from "../middlewares/multer.js";
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);

export default router;