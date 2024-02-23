const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isPremium: {
    type: Boolean,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String, 
      firstname:String,
      lastname:String,
    },
  ],
  comments: [
    {
      text: String,
      author: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: String, 
        firstname:String,
      lastname:String,
      },
    },
  ],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
