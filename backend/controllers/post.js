const Post = require("../models/Post");
const User = require("../models/User");
exports.createPost = async(req, res) => {
    try {
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: "req.body.public_id",
                url:"req.body.url"
            },
            owner: req.user._id
        }

        const newPost = await Post.create(newPostData);

        const user = await User.findById(req.user._id);

        user.posts.push(newPost._id);
        await user.save();

        res.status(201).json({
            success: true,
            post: newPost,
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


exports.likeAndUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);

            post.likes.splice(index, 1);

            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post Unliked",
            });
        }

        post.likes.push(req.user._id);

        await post.save();

        res.status(200).json({
            success: true,
            message: "Post Liked",
        });

    } catch (err){
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};




exports.deletePost = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false, 
                message: "Post not found"
            });
        }

        if(post.owner.toString() !== req.user._id.toString()){
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await post.deleteOne();

        const user = await User.findById(req.user._id);

        const index = user.posts.indexOf(req.params.id);

        user.posts.splice(index, 1);

        await user.save();

        res.status(200).json({
            success: true, 
            message: "Post deleted",
        });
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: err.message,
        });
    }
};

exports.getPostsOfFollowing = async (req, res) => {
    try {

        // op1
        // in the user data object, the following field is populated with the posts of users with ids in the following field of logged in user
        // const user = await User.findById(req.user._id).populate("following", "posts");

        // op2
        const user = await User.findById(req.user._id);

        let posts = await Post.find({
            owner: {
                $in: user.following,
            },
        }).lean();

        posts = await Promise.all(
         posts.map(async post =>  {
            const likes = await Promise.all(
                post.likes.map(async likeByUser => {
                    const userWhoLiked = await User.findById(likeByUser);
                    return userWhoLiked;
                })
            );
            const comments = await Promise.all(
                post.comments.map(async comment => {
                    const userCommented = await User.findById(comment.user);
                    return {...comment, user: userCommented};
                })
            );
            const owner = await User.findById(post.owner);
            return {...post, owner, likes, comments};
         })
        );

        res.status(200).json({
            success: true,
            posts: posts.reverse(),
        });
    } catch (err) {
        res.status(500).json({
            success: true,
            message: err.message
        });
    }
};


exports.updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            res.status(404).json({
                success: false,
                message: "post not found"
            });  
        }

        if(post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const {caption} = req.body;
        post.caption = caption;
        await post.save();

        res.status(200).json({
            success: true,
            message: "caption updated"
        });
    } catch (err) {
        res.status(500).json({
            success: true,
            message: err.message
        });
    }
};

exports.commentOnPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = req.body.comment; 
        if(!comment){
            return res.status(400).json({
                message: "Can't post empty comment"
            });
        }
        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post Not found"
            }); 
        }

        let commentIndex = -1;

        // checking if comment already exists
        post.comments.forEach((item, index) => {
            if(item.user.toString() === req.user._id.toString()) {
                commentIndex = index;
            }
        });

        if( commentIndex !== -1 ){
            post.comments[commentIndex].comment = comment;

            await post.save();

            return res.status(200).json({
                success: true, 
                message: "Comment updated",
            });
        } else{
            post.comments.push({
                user: req.user._id,
                comment: req.body.comment
            });

            await post.save();

            return res.status(200).json({
                success: false,
                message: "Comment posted"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if(post.owner.toString() === req.user._id.toString()){ // owner deleting comments on their own post

            if(req.body.commentId === undefined){
                return res.status(400).json({
                    success: false, 
                    message: "comment Id is required"
                });
            }

            post.comments.forEach((item, index) => {
                if(item._id.toString() === req.body.commentId.toString()) {
                    return post.comments.splice(index, 1);
                }
            });

            await post.save();

            return res.status(200).json({
                success: true, 
                message: "Selected comment deleted"
            });

        } else{  // deleting your own comment on another user's post
            post.comments.forEach((item, index) => {
                if(item.user.toString() === req.user._id.toString()){
                    post.comments.splice(index, 1);
                }
            });

            await post.save();

            return res.status(200).json({
                success: true, 
                message: "comment deleted"
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};