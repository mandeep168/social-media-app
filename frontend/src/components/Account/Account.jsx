import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMyPosts, logoutUser } from '../../Actions/User';
import "./Account.css";
import Loader from '../Loader/Loader';
import Post from '../Post/Post';
import User from '../User/User';
import { Avatar, Typography, Button, Dialog } from '@mui/material';
import {Link} from 'react-router-dom';
import { useAlert } from 'react-alert';


const Account = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const {user, loading: userLoading} = useSelector((state) => state.user);
    const {loading, error, posts} = useSelector((state) => state.myPosts);
    const {error: likeError, message} = useSelector((state) => state.like);
    
    const [followersToggle, setFollowersToggle] = useState(false);
    const [followingToggle, setFollowingToggle] = useState(false);
    
    const logoutHandler = () => {
        dispatch(logoutUser());
        alert.success("Logged out successfully");
    }
    useEffect(()=> {
        dispatch(getMyPosts());
    }, [dispatch]);

    useEffect(() => {
        if(error) {
          alert.error(error);
          dispatch({ type: "clearErrors"});
        }
        if(likeError) {
          alert.error(likeError);
          dispatch({ type: "clearErrors"});
        }
    
        if(message) {
          alert.success(message);
          dispatch({ type: "clearMessage"});
        }
      }, [alert, error, message, likeError, dispatch]);


  return (
    (loading || userLoading) ? (
    <Loader />)
     : (
        <div className='account'>
        <div className='accountleft'>
            {
                posts && posts.length > 0 ? posts.map(post => {
                    return (<Post 
                        key={post._id}
                        postImage={"https://img.freepik.com/free-photo/lone-tree_181624-46361.jpg?size=626&ext=jpg"} 
                        // ownerName={'MandeepKaur'} 
                        postId={post._id}
                        caption={post.caption}
                        // postImage={post.image.url}
                        likes={post.likes}
                        comments={post.comments}
                        ownerImage={"https://img.freepik.com/free-photo/lone-tree_181624-46361.jpg?size=626&ext=jpg"}
                        ownerName={post.owner.name}
                        ownerId={post.owner._id}
                        />)

                    }) : <Typography variant="h6">No posts yet</Typography>
            }
        </div>
        <div className='accountright'>
            <Avatar src={user.avatar.url}/>
            <Typography variant="h5">{user.name}</Typography>

            <div>
                <button onClick={() => setFollowersToggle(!followersToggle)}>
                    <Typography>followers</Typography>
                </button>
                <Typography>{user.followers.length}</Typography>
            </div>
            <div>
                <button onClick={() => setFollowingToggle(!followingToggle)}>
                    <Typography>following</Typography>
                </button>
                <Typography>{user.following.length}</Typography>
            </div>
            <div>
                <Typography>Posts</Typography>
                <Typography>{user.posts.length}</Typography>
            </div>

            <Button variant="contained" onClick={logoutHandler}>Logout</Button>

            <Link to="/update/profile"> Edit Profile </Link>
            <Link to="/update/password"> Change Password </Link>

            <Button variant="text" style={{ color: "red", margin: "2vmax"}}>
                Delete My Profile
            </Button>

            <Dialog 
                open={followersToggle}
                onClose={() => setFollowersToggle(!followersToggle)}
                >
                    <div className='DialogBox'>
                    <Typography variant="h4"> Followers </Typography>
                    
                    
                    {
                        user && user.followers.length > 0 ? (
                            user.followers.map((follower) => {
                                return <User 
                                    key={follower._id}
                                    userId={follower._id}
                                    name={follower.name}
                                    avatar={"https://img.freepik.com/free-photo/lone-tree_181624-46361.jpg?size=626&ext=jpg"} 
                                />
                            })
                        ) : (
                            <Typography style={{ margin: "2vmax" }}> You have no followers </Typography>
                        )
                    }
            
                    </div>
            </Dialog>

            <Dialog 
                open={followingToggle}
                onClose={() => setFollowingToggle(!followingToggle)}
                >
                    <div className='DialogBox'>
                    <Typography variant="h4"> Following </Typography>
                    
                    
                    {
                        user && user.following.length > 0 ? (
                            user.following.map((follow) => {
                                return <User 
                                    key={follow._id}
                                    userId={follow._id}
                                    name={follow.name}
                                    avatar={"https://img.freepik.com/free-photo/lone-tree_181624-46361.jpg?size=626&ext=jpg"} 
                                />
                            })
                        ) : (
                            <Typography style={{ margin: "2vmax" }}> You have no followings </Typography>
                        )
                    }
            
                    </div>
            </Dialog>
        </div>
    </div>
    )
  )
}

export default Account;
