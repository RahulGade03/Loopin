import mongoose from 'mongoose';
const userSchema = new mongoose.Schema ({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilePicture: {type: String, default: ''},
    bio: {type: String, default: ''},
    gender: {type: String, enum: ['Male', 'Female']},
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    bookmarks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: []}],
}, {timestamps: true});

const User = mongoose.model ('User', userSchema);
export default User;
// This schema defines a user with fields for username, email, password, profile picture, bio, and an array of posts. 
// It is used to store user information in the application.