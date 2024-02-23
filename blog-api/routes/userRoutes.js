const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:userId/posts', userController.getUserPosts);
router.post('/:userId/subscribe', userController.subscribeToPremium);
router.get('/:userId', userController.getUserDetails);

module.exports = router;
