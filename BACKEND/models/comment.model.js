import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema ({
    text: { type: String, required: true },
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
// This schema defines a comment with a text field, an author reference to a User, and a post reference to a Post. 
// It is used to store comments made by users on posts in the application.