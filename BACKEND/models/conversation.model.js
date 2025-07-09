import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema ({
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
})

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
// This schema defines a conversation, which can be used to store information about a chat between two users. 
// It can include fields like participants, messages, timestamps, etc., depending on the application's requirements.