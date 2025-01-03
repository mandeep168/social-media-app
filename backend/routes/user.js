const express = require('express');
const { 
    register, 
    login, 
    logout, 
    followUser, 
    updatePassword, 
    updateProfile, 
    deleteMyProfile, 
    myProfile,
    getUserProfile,
    getAllUsers,
    forgotPassword,
    resetPassword,
    getMyPosts
} = require("../controllers/user");
const {isAuthenticated} = require('../middlewares/auth');
const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(isAuthenticated, logout);

router.route("/follow/:id").get(isAuthenticated, followUser);

router.route("/update/password").put(isAuthenticated, updatePassword);

router.route("/update/profile").put(isAuthenticated, updateProfile);

router.route("/delete/profile").delete(isAuthenticated, deleteMyProfile);

router.route("/profile").get(isAuthenticated, myProfile);

router.route("/my/posts").get(isAuthenticated, getMyPosts);

router.route("/user/:id").get(isAuthenticated, getUserProfile);

router.route("/users").get(isAuthenticated, getAllUsers);

router.route("/forgot/password").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

module.exports = router;