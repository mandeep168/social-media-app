import {React, useEffect} from 'react'
import './Home.css';
import User from '../User/User';
import Post from '../Post/Post';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, getFollowingPosts } from '../../Actions/User';
import Loader from '../Loader/Loader';
import { Typography } from '@mui/material';

const Home = () => {

  const dispatch = useDispatch();

  const { loading, posts, errors } = useSelector(state => state.postOfFollowing);

  const {users, loading: usersLoading} = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(getFollowingPosts());
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    
    loading || usersLoading ? <Loader /> : (
    <div className='home'>
      <div className='homeleft'>
        {
          posts && posts.length > 0 ? posts.map((post) => {
           return <Post 
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
            />

          }) : <Typography variant="h6">No posts yet</Typography>
        }
      </div>

      <div className='homeright'>
        {
          users && users.length > 0 ? users.map((user) => {
           return <User 
            key={user._id}
            userId={user._id}
            name={user.name}
            avatar={"https://img.freepik.com/free-photo/lone-tree_181624-46361.jpg?size=626&ext=jpg"} 
        />
          }) : <Typography>No Users Yet</Typography>
        }
      </div>
    </div>
    )
  )
}

export default Home;
