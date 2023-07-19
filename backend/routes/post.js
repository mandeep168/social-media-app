const express = require('express');
const { 
    createPost, 
    likeAndUnlikePost, 
    deletePost, 
    getPostsOfFollowing, 
    updateCaption,
    commentOnPost,
    deleteComment
} = require("../controllers/post");
const router = express.Router();
const {isAuthenticated} = require("../middlewares/auth");

router.route("/post/upload").post(isAuthenticated, createPost);

router
    .route("/post/:id")
    .get(isAuthenticated, likeAndUnlikePost)
    .put(isAuthenticated, updateCaption)
    .delete(isAuthenticated, deletePost);

router.route("/posts").get(isAuthenticated, getPostsOfFollowing);

router
    .route("/post/comment/:id")
    .put(isAuthenticated, commentOnPost)
    .delete(isAuthenticated, deleteComment);

module.exports = router;