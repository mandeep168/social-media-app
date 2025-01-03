const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter a name"],
    },
    avatar: {
        public_id: String,
        url: String,
    },
    email:{
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "Email already existed"],
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [8, "Password must be of at least 8 characters"],
        select: false,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}); 

// called before saving an user on the database
userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function (){
    // _id is payload
    return jwt.sign({ _id : this._id }, process.env.JWT_SECRET);
};

userSchema.methods.getResetPasswordToken = function (){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema, "users");