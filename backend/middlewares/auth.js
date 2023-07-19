const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
    try{
        const { token } = req.cookies;
            if(!token){
                return res.status(401).json({
                    message: "Please login first"
                });
            }
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);

            // we can access used data by `req.user` as long as user is logged in
        req.user = await User.findById(decoded._id);

        next();
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};