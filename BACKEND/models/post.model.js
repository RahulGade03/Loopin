import mongoose from "mongoose";
const postSchema = new mongoose.Schema ({
    caption: {type: String, default:''},
    image: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

const Post = mongoose.model('Post', postSchema);
export default Post;
// This schema defines a post with a caption, an image, an author reference to a User, an array of likes (User references), and an array of comments (Comment references).
// It is used to store posts made by users in the application.