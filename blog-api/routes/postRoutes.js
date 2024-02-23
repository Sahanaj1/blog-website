const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.getAllPosts);
router.get('/:postId', postController.getSinglePost);
router.post('/create', postController.createPost);
router.delete('/:postId', postController.deletePost);
router.post('/:postId/like', postController.likePost);
router.post('/:postId/comment', postController.commentPost);

module.exports = router;
