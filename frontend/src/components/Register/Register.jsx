import React, { useState, useEffect } from 'react'
import "./Register.css";
import { Avatar, Button, Typography } from '@mui/material';
import {Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { registerUser } from '../../Actions/User';

const Register = () =>  {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error } = useSelector(state => state.user);


    const handleImageChange = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();

        Reader.readAsDataURL(file);

        Reader.onload = (e) => {
            if(Reader.readyState === 2) {
                setAvatar(Reader.result);
            }
        };
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(registerUser(name, email, password, avatar));
    }

    
    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch({ type: 'clearErrors' });
        }
    }, [dispatch, alert, error])
  return (
    <div className='register'>
        <form className='registerForm' onSubmit={submitHandler}>
            <Typography variant='h3' style={{ padding: "2vmax" }}>
                Social App
            </Typography>

            <Avatar 
                src={avatar}
                alt="User"
                sx={{ height: "10vmax", width: "10vmax" }}
            />


            <input type="file" accept="image/*" onChange={handleImageChange}/>

            <input  
                type="text"
                required
                placeholder='Name'
                value={name}
                className='registerInputs'
                onChange={(e) => setName(e.target.value)}
            />

            <input 
                type="email"
                placeholder='Email'
                required
                value={email}
                className='registerInputs'
                onChange={(e) => setEmail(e.target.value)}
            />

            <input 
                type="password"
                placeholder='Password'
                required
                value={password}
                className='registerInputs'
                onChange={(e) => setPassword(e.target.value) }
            />

            <Link to="/">
                <Typography>Already Signed Up? Login Here</Typography>
            </Link>
            <Button disabled={loading} type="submit"> Sign Up </Button>
        </form>
    </div>
  )
}

export default Register;
