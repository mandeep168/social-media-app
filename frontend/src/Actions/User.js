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