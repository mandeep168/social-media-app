import React, {useEffect, useState} from 'react'
import "./UpdatePassword.css";
import { Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../Actions/User';
import { useAlert } from 'react-alert';


const UpdatePassword = () => {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    const dispatch = useDispatch();

    const alert = useAlert();

    const { error, loading, message, error: loginError } = useSelector(state => state.like);

    const submitHandler = (e) => {
        e.preventDefault();  
        dispatch(updatePassword(oldPassword, newPassword));
    };

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        }
        if(loginError) {
            alert.error(loginError);
            dispatch({ type: "clearErrors" });
        }
        if(message) {
            alert.success(message);
            dispatch({ type: "clearMessages" });
        }
    }, [dispatch, error, message, loginError, alert]);

  return (
    <div className="updatePassword">
        <form className="updatePasswordForm" onSubmit={submitHandler}>
            <Typography variant="h3" style={{ padding: "2vmax" }}>
                Social App
            </Typography>
            <input 
                className='updatePasswordInputs'
                type="password" 
                placeholder="Old Password" 
                required 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />

            <input 
                className='updatePasswordInputs'
                type="password" 
                placeholder="New Password" 
                required 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />


            <Button disabled={loading} type="submit"> 
            Change Password </Button>

        </form>
    </div>
  )
}

export default UpdatePassword;
