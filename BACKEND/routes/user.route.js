import express from 'express';
import {editProfile, getProfile, followOrUnfollow, getSuggestedUsers, login, logout, register, forgotPassword, resetPasswordInitiate, resetPassword} from '../controllers/user.controller.js';
import upload from "../middlewares/multer.js";
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile); 
// upload.single('profilePicture') is used to upload a single file with the field name 'profilePicture'. 
// This middleware will add the file to the req object as req.file. 'profilePicture' field will be in the form-data of the request which is already converted to json format by express.urlencoded middleware in index.js
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password-initiate').post(resetPasswordInitiate);
router.route('/reset-password').post(resetPassword);

export default router;