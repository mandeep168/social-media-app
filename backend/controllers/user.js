const User = require("../models/User");
const Post = require("../models/Post");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require('crypto');
const cloudinary = require('cloudinary');

exports.register = async (req, res) => {
    try{
        const {name, email, password, avatar} = req.body;
        let user = await User.findOne({ email });
        if(user) {
            return res
                .status(400)
                .json({ success: true, message: "User already exists" });
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
        });

        user = await User.create({
            name, 
            email, 
            password, 
            avatar:{
                public_id: myCloud.public_id, 
                url: myCloud.secure_url,
            },
        });

        const token = await user.generateToken();
        
        const options =  {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 
            httpOnly: true,
        };
        // token storing in cokkie
        res.status(201).cookie("token", token, options).json({
            success: true,
            user,
            token,
        });
    }catch(err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        
        const user = await User.findOne({email})
        .select("+password")
        .populate("posts followers following");
        
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exist!"
            });
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Password doesn't match"
            });
        }

        const token = await user.generateToken();
        
        const options =  {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 
            httpOnly: true,
        };
        // token storing in cokkie
        res.status(200).cookie("token", token, options).json({
            success: true,
            user,
            token,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};



exports.logout = async (req, res) => {
    try {
        const options = {
            expires: new Date(Date.now()),
            httpOnly: true,
        };
        res
            .status(200)
            .cookie("token", null, options)
            .json({
                success: true,
                message: "logged out"
            });
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: err.message
        });
    }
};


exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);
        if(!userToFollow || !loggedInUser){
            return res.status(404).json({
                success : false,
                message : "User not found!"
            })
        }
        
        if(loggedInUser.following.includes(userToFollow._id)){
            const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
            const indexFollower = userToFollow.followers.indexOf(loggedInUser._id);
            
            loggedInUser.following.splice(indexFollowing, 1);
            userToFollow.followers.splice(indexFollower, 1);

            await loggedInUser.save();
            await userToFollow.save();

            res.status(200).json({
                success: true,
                message: "User unfollowed!"
            });
        } else{
            userToFollow.followers.push(loggedInUser._id);
            loggedInUser.following.push(userToFollow._id);

            await loggedInUser.save();
            await userToFollow.save();

            res.status(200).json({
                success : true,
                message : "User followed!"
            });
        }
        
    } catch (err) {
        res.status(500).json({
            success : false, 
            message : err.message
        });
    }
};


exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("+password");

        const {oldPassword, newPassword} = req.body;
        
        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success: false,
                message: "Please provide old and new password",
            });
        }

        const isMatch = await user.matchPassword(oldPassword);
        
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Incorrect old password",
            });
        }
        if(oldPassword === newPassword){
            return res.status(400).json({
                success: false,
                message: "Old and New password can't be same",
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated",
        });
        
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: err.message,
        });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        
        const user = await User.findById(req.user._id);

        const { name, email, avatar } = req.body;

        if(email){
            const userEmail = User.findOne({ email });
            if(userEmail && user.email !== email){
                return res.status(400).json({
                    success: true,
                    message: "email provided is assiciated with another registered user"
                });
            }
            user.email = email;
        }
        if(name){
            user.name = name;
        }
        
        if(avatar) {
            console.log(avatar);
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);

            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                folder: 'avatars',
            });

            user.avatar.public_id = myCloud.public_id;
            user.avatar.url = myCloud.secure_url;
        }
        
        await user.save();

        res.status(200).json({
            success: true, 
            message: "Profile updated",
        });
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: err.message,
        });
    }
};

exports.deleteMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followers = user.followers;
        const following = user.following;
        await user.deleteOne();

        // logging out user
        const options = {
            expires: new Date(Date.now()),
            httpOnly: true,
        };

        res.cookie("token", null, options);

        // deleting all posts of user
        for(let postId in posts){
            const post = await Post.findById(posts[postId]);
            await post.deleteOne();
        }

        // removing user from following list of followers
        for (let followerIndex in followers){
            const follower = await User.findById(followers[followerIndex]);
            const followingIndex = follower.following.indexOf(user._id);
            follower.following.splice(followingIndex, 1);
            await follower.save();
        }

        // removing user from followers list of following
        for (let followingIndex in following) {
            const followingUser = await User.findById(following[followingIndex]);
            const followerIndex = followingUser.followers.indexOf(user._id);
            followingUser.followers.splice(followerIndex, 1);
            await followingUser.save();
        }
        res.status(200).json({
            success: true, 
            message: "Profile deleted",
        });
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: err.message,
        });
    }
};


exports.myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("posts followers following");

        res.status(200).json({
            success: true, 
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: err.message
        });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        let user = await User.findById(req.params.id).populate("posts followers following");

        if(!user){
            return res.status(400).json({
                success: false, 
                message: "User not found"
            });
        }

        // user.posts = await Promise.all(
        //     user.posts.map(async post => {
        //         const likes = await Promise.all(
        //             post.likes.map(async likeByUser => {
        //                 const userWhoLiked = await User.findById(likeByUser);
        //                 return userWhoLiked;
        //             })
        //         );
        //         const comments = await Promise.all(
        //             post.comments.map(async comment => {
        //                 const userCommented = await User.findById(comment.user);
        //                 return {...comment, user: userCommented};
        //             })
        //         );
        //         return {...post, likes, comments}
        //     })
        // );
        
        res.status(200).json({
            success: true, 
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: err.message
        });
    }
};

exports.getAllUsers = async ( req, res ) => {
    try {
        const users = await User.find({});

        res.status(200).json({
            success: true, 
            users
        });
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: err.message
        });
    }
};


exports.forgotPassword = async (req, res) => {
    try {
        
        const user = await User.findOne({email: req.body.email});

        if(!user) {
            return res.status(404).json({
                success: false, 
                message: "User Not found"
            });  
        }

        const resetPasswordToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`;
        
        const message = `Reset your password by clicking on the link below: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email, 
                subject: "Reset Password",
                message
            });

            res.status(200).json({
                success: true, 
                message: `Email sent to ${user.email}`,
            });

        } catch (err) {

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            res.status(500).json({
                success: false, 
                message: err.message
            });

        }

    } catch (err) {
        res.status(500).json({
            success: false, 
            message: "Failure in sending email." + err.message
        });
    }
};


exports.resetPassword = async (req, res) => {
    try {

        const resetPasswordToken = crypto
                                    .createHash("sha256")
                                    .update(req.params.token)
                                    .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()},
        });

        if(!user){
            return res.status(401).json({
                success: false, 
                message: "Token is invalid or has expired",
            });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return res.status(201).json({
            success: true, 
            message: "Password updated successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: err.message
        });
    }
};

exports.getMyPosts = async ( req, res ) => {
    try {
        const user = await User.findById(req.user._id);

        const posts = [];

        for(let i=0;i<user.posts.length;i++) {
            const post = await Post.findById(user.posts[i]).populate(
                "likes comments.user owner"
            );
            posts.push(post);
        }

        res.status(200).json({
            success: true, 
            posts,
        });
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: err.message
        });
    }
};