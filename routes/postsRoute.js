const express = require('express');
const router = express.Router();
const {
    getAllPosts,
    getUserPosts,
    createPost,
    likePost,
    postComment,
    getPostImage
} = require('../controllers/postsController');
const authMiddleware = require('../middlewares/authMiddleware')

router.route('/').get(authMiddleware, getAllPosts).post(authMiddleware, createPost);
router.route('/image/:postId').get(authMiddleware, getPostImage)
router.route('/:userId').get(authMiddleware, getUserPosts);
router.route('/:postId/like').post(authMiddleware, likePost);
router.route('/:postId/comment').post(authMiddleware, postComment);

module.exports = router;