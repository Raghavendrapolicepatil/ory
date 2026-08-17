const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },

    password: {
        type: String,
        required: true
    },

    // Phone OTP verification
    phoneVerified: {
        type: Boolean,
        default: false
    },

    otp: {
        type: String,
        default: null
    },

    otpExpiresAt: {
        type: Date,
        default: null
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);