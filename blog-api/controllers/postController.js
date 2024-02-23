const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const requireAuth = (req, res, next) => {
  authMiddleware(req, res, () => {
    next();
  });
};

exports.createPost = async (req, res) => {

  requireAuth(req, res, async () => {
    const { title, content, isPremium } = req.body;
    const author = req.userId;

    try {

      const post = new Post({ title, content, isPremium, author });

      await post.save();

      const newPost = await Post.findById(post._id).populate('author', 'username');

      res.status(201).json({
        message: 'Post created successfully',
        post: newPost,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the post' });
    }
  });
};


exports.deletePost = async (req, res) => {

  requireAuth(req, res, async () => {
    const postId = req.params.postId;

    try {

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (post.author.toString() !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const result = await Post.deleteOne({ _id: postId });

      if (result.deletedCount === 1) {
        return res.json({ message: 'Post deleted successfully' });
      } else {
        return res.status(500).json({ error: 'An error occurred while deleting the post' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing the delete request' });
    }
  });
};


exports.likePost = async (req, res) => {

  requireAuth(req, res, async () => {
    const postId = req.params.postId;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }


      const isLiked = post.likes.some((like) => like.userId && like.userId.toString() === userId);

      const user = await User.findById(userId);
      const username = user.username;
      const firstname = user.firstname;
      const lastname = user.lastname;

      if (isLiked) {

        post.likes = post.likes.filter((like) => like.userId && like.userId.toString() !== userId);
        await post.save();
        res.json({ message: 'Post unliked' });
      } else {

        post.likes.push({ userId, username, firstname, lastname });
        await post.save();
        res.status(200).json({ message: 'Post liked' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing the like' });
    }
  });
};





exports.commentPost = async (req, res) => {

  requireAuth(req, res, async () => {
    const postId = req.params.postId;
    const { text } = req.body;
    const authorId = req.userId;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
      } else {

        const user = await User.findById(authorId);
        const author = {
          userId: user._id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
        };

        post.comments.push({ text, author });
        await post.save();
        res.json({ message: 'Comment added' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while adding the comment' });
    }
  });
};



exports.getAllPosts = async (req, res) => {

  requireAuth(req, res, async () => {
    try {

      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPremiumUser = user.isPremium;


      const filter = isPremiumUser ? {} : { isPremium: false };

      const posts = await Post.find(filter).populate('author', 'username');
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching posts' });
    }
  });
};


exports.getSinglePost = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the post' });
  }
};
