import  React, { useState } from 'react';
import './Post.css';
import { Typography, Avatar, Button } from '@mui/material';
import {Link} from 'react-router-dom';
import {
  MoreVert,
  Favorite,
  FavouriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
  FavoriteBorder,
  More,
} from "@mui/icons-material";
import { useDispatch } from 'react-redux';
import {
  likePost,
}
from "../../Actions/Post";

const Post = ({
    postId, 
    caption, 
    postImage,
    likes=[],
    comments=[],
    ownerImage,
    ownerName, 
    ownerId,
    isDelete = false,
    isAccount = false,
}) => {

  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const handleLike = () => {
    setLiked(!liked);

    dispatch(likePost(postId));
  }
  return (
    <div className="post">
      <div className="postHeader">
        {
          isAccount && <Button>
              <MoreVert />
          </Button>
        }
      </div>
        <img src={postImage} alt="Post" />
        
        <div className="postDetails">
            <Avatar 
              src={ownerImage} 
              alt="User" 
              sx={{
                height: "3vmax", 
                weight: "3vmax",
              }} />

            <Link to={`/user/${ownerId}`} >
                <Typography fontWeight={700}>{ownerName}</Typography>
            </Link>

            <Typography
                fontWeight={100}
                color="rgba(0,0,0,0.582)"
                style={{alignSelf: "center"}}
            >
                {caption}
            </Typography>
        </div>

        <button 
          style = {{
            border: "none",
            backgroundColor: "white",
            cursor: "pointer",
            margin: "1vmax 2vmax",
          }}
        >
          <Typography> 5 Likes </Typography>
        </button>


        <div className="postFooter">
          <Button onClick={handleLike}>
            { liked ? <Favorite style={{color: "red"}}/> : <FavoriteBorder /> }
          </Button>

          <Button>
            <ChatBubbleOutline />
          </Button>

          {
            isDelete && <Button>
                          <DeleteOutline />
                        </Button>
          }
        </div>
    </div>
  )
}

export default Post;
