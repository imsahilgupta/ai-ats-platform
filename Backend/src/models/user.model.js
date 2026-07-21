const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username already taken"],
        required: true
    },
    email: {
        type: String,
        unique: [true, "Account already exists with this email address"],
        required: true
    },
    password: {
        type: String,
        required: [true, "Password is requireed"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationCodeHash: {
        type: String,
        default: null,
    },
    emailVerificationExpires: {
        type: Date,
        default: null,
    },
    passwordResetCodeHash: {
        type: String,
        default: null,
    },
    passwordResetExpires: {
        type: Date,
        default: null,
    },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;