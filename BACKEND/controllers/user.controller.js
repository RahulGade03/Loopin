import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import sendCredentialsMail from '../utils/nodemailer.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            throw new Error("All fields are required!");
        }

        const user = await User.findOne ({email});
        if (user) {
            throw new Error("Try another email, this one is already registered!");
        }

        const hashedPassword = await bcrypt.hash (password, 10);
        await User.create ({
            username,
            email,
            password: hashedPassword,
        });
        
        return res.status(201).json({
            message: 'User registered successfully',
            success: true,
        });
    }
    catch (error) {
        console.log (error);
        return res.status(401).json({
            message: error.message,
            success: false
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("All fields are required!");
        }

        let user = await User.findOne ({email}).lean();
        if (!user) {
            throw new Error("User not found, please register first!");
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Invalid credentials!");
        }
        
        const token = jwt.sign ({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1d'});

        const populatedPosts = await Promise.all (
            user.posts.map (async (postId) => {
                const post = await Post.findById (postId);
                if (post?.author.equals(user._id)) return post;
                return null;
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            gender: user.gender,
            posts: populatedPosts,
        }

        return res.cookie ('token', token, {httpOnly: true, sameSite:'lax', secure: false, maxAge: 1*24*60*60*1000}).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });
    }
    catch (error) {
        console.log (error);
        return res.status(401).json({
            message: error.message,
            success: false
        })
    }
}

export const logout = async (req, res) => {
    try {
        return res.cookie ('token', '', {maxAge: 0}).json ({
            message: 'Successfully logged out!',
            success: true,
        })
    } catch (error) {
        console.log (error);
    }
}

export const forgotPassword = async (req, res) => {
    try{
        const { email } = req.body;
        if (!email) {
            throw new Error("Email address needed!");
        }
        // check for user
        const user = await User.findOne({email});
        if (!user) {
            throw new Error("Invalid email!");
        }
        // use node mailer to send email to reset the password
        const content = `
        Click on the below link or copy it and open it on the browser to reset your LoopIn password!
        Link: ${process.env.FRONTEND_BASE_URL}/reset-password/${user._id}

        Thankyou, Team LoopIn.
        `;
        
        const result = await sendCredentialsMail(email, content);
        const data = JSON.parse(result);
        
        if (!data.success) throw new Error("Email cannot be sent, problem with nodemailer!");
        
        res.status(200).json({
            message: "Reset link sent to you email!",
            success: true
        });
    }
    catch(error) {
        console.log(error);
        return res.status(401).json({
            message: error.message,
            success: false
        })
    }
}

export const resetPasswordInitiate = (req, res) => {
    try {
        const { userId } = req.body;
        const user = User.findOne({userId});
        if (!user) {
            throw new Error("Invalid email!");
        }

        res.status(200).json({
            message: "Valid link",
            success: true
        })

    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: error.message,
            status: false
        })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { userId, password } = req.body;
        if (!userId || !password) {
            throw new Error("Email or Password are not specified!");
        }
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("user not found!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            throw new Error("Password hashing not working!");
        }

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password reset successful!",
            success: true
        })
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: error.message,
            status: false
        })
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        user = await user.populate({
            path: 'posts',
            populate: {
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            }
        });

        return res.status(200).json ({
            user,
            success: true,
        })
    }
    catch (error) {
        console.log (error);
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file;
        
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        let cloudResponse;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }
        
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (cloudResponse?.secure_url) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated successfully!',
            success: true,
            user
        })
    }
    catch (error) {
        console.log (error);
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find ({_id: {$ne: req.id}}).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
                status: false,
            })
        }
        return res.status(200).json({
            success: true,
            users: suggestedUsers,
        })
    } catch (error) {
        console.log (error);
    }
}

export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id;
        const jiskoFollowKrunga = req.params.id;
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow yourself :)',
                success: false,
            });
        }

        const user = await User.findById (followKrneWala);
        const targetUser = await User.findById (jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false,
            });
        }

        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            await Promise.all ([
                User.updateOne({_id: followKrneWala}, {$pull: {following: jiskoFollowKrunga}}),
                User.updateOne({_id: jiskoFollowKrunga}, {$pull: {followers: followKrneWala}})
            ])
            return res.status(200).json({
                message: `Unfollowed ${jiskoFollowKrunga}`,
                success: true
            })
        }
        else{
            await Promise.all ([
                User.updateOne({_id: followKrneWala}, {$push: {following: jiskoFollowKrunga}}),
                User.updateOne({_id: jiskoFollowKrunga}, {$push: {followers: followKrneWala}})
            ])
            return res.status(200).json({
                message: `Following ${jiskoFollowKrunga}`,
                success: true
            })
        }

    } catch (error) {
        console.log (error);
    }
}