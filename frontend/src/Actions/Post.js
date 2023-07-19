import axios from "axios";

export const likePost = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "likeRequest",
        });

        const { data } = await axios.get(`/api/v1/post/${id}`);

        dispatch({
            type: "likeSuccess",
            payload: data.message,
        });
    } catch (err) {
        dispatch({
            type: "likeFailure",
            payload: err.response.data.message,
        });
    }
};