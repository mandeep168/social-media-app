import axios from "axios";

export const loginUser = (email, password) => async (dispatch) => {
    try {

        dispatch ({
            type: "LoginRequest"
        });

        const {data} = await axios.post(
            "/api/v1/login", 
            {email, password}, {
            headers: {
                "Content-Type" : "application/json"
            }
        });

        dispatch ({
            type: "LoginSuccess",
            payload: data.user,
        });
    } catch (err) {
        dispatch ({
            type: "LoginFailure",
            payload:  err.response.data.message,
        })
    }
};

export const registerUser = (name, email, password, avatar) => async (dispatch) => {
    try {

        dispatch ({
            type: "RegisterRequest"
        });

        const {data} = await axios.post(
            "/api/v1/register", 
            {name, email, password, avatar}, {
            headers: {
                "Content-Type" : "application/json"
            }
        });

        dispatch ({
            type: "RegisterSuccess",
            payload: data.user,
        });
    } catch (err) {
        dispatch ({
            type: "RegisterFailure",
            payload:  err.response.data.message,
        })
    }
};

export const loadUser = () => async (dispatch) => {
    try {
        dispatch ({
            type: "LoadUserRequest"
        });

        const {data} = await axios.get(
            "/api/v1/profile");

        dispatch ({
            type: "LoadUserSuccess",
            payload: data.user,
        });
    } catch (err) {
        dispatch ({
            type: "LoadUserFailure",
            payload:  err.response.data.message,
        })
    }
};

export const getFollowingPosts = () => async (dispatch) => {
    try {

        dispatch({
            type: "postOfFollowingRequest",
        });

        const { data } = await axios.get("api/v1/posts");
        dispatch({
            type: "postOfFollowingSuccess",
            payload: data.posts,
        });

    } catch (err) {
        dispatch({
            type: "postOfFollowingFailure",
            payload: err.response.data.message,
        });
    }
};

export const getAllUsers = () => async (dispatch) => {
    try {

        dispatch({
            type: "allUsersRequest",
        });

        const { data } = await axios.get("api/v1/users");
        dispatch({
            type: "allUsersSuccess",
            payload: data.users,
        });

    } catch (err) {
        dispatch({
            type: "allUsersFailure",
            payload: err.response.data.message,
        });
    }
};

export const getMyPosts = () => async (dispatch) => {
    try {

        dispatch({
            type: "myPostsRequest",
        });

        const { data } = await axios.get("api/v1/my/posts");
        dispatch({
            type: "myPostsSuccess",
            payload: data.posts,
        });

    } catch (err) {
        dispatch({
            type: "myPostsFailure",
            payload: err.response.data.message,
        });
    }
};


export const logoutUser = (email, password) => async (dispatch) => {
    try {

        dispatch ({
            type: "LogoutUserRequest"
        });

        const {data} = await axios.get(
            "/api/v1/logout");

        dispatch ({
            type: "LogoutUserSuccess",
        });
    } catch (err) {
        dispatch ({
            type: "LogoutUserFailure",
            payload:  err.response.data.message,
        })
    }
};

export const updateProfile = (name, email, avatar) => async (dispatch) => {
    try {

        dispatch ({
            type: "updateProfileRequest"
        });

        const {data} = await axios.put(
            "/api/v1/update/profile", 
            {name, email, avatar}, {
            headers: {
                "Content-Type" : "application/json"
            }
        });

        dispatch ({
            type: "updateProfileSuccess",
            payload: data.message,
        });
    } catch (err) {
        dispatch ({
            type: "updateProfileFailure",
            payload:  err.response.data.message,
        })
    }
};

export const updatePassword = ( oldPassword, newPassword ) => async (dispatch) => {
    try {

        dispatch ({
            type: "updatePasswordRequest"
        });

        const {data} = await axios.put(
            "/api/v1/update/password", 
            { oldPassword, newPassword }, {
            headers: {
                "Content-Type" : "application/json"
            }
        });

        dispatch ({
            type: "updatePasswordSuccess",
            payload: data.message,
        });
    } catch (err) {
        dispatch ({
            type: "updatePasswordFailure",
            payload:  err.response.data.message,
        })
    }
};