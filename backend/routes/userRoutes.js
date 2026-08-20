const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getUsers,
    sendOTP,
    verifyOTP,
    sendForgotPasswordOTP,
    resetPassword
} = require("../controllers/userController");


// ==========================================
// Register
// ==========================================

router.post(
    "/register",
    registerUser
);


// ==========================================
// Login
// ==========================================

router.post(
    "/login",
    loginUser
);


// ==========================================
// Registration OTP
// ==========================================

router.post(
    "/send-otp",
    sendOTP
);

router.post(
    "/verify-otp",
    verifyOTP
);


// ==========================================
// Forgot Password OTP
// ==========================================

router.post(
    "/forgot-password/send-otp",
    sendForgotPasswordOTP
);

router.post(
    "/forgot-password/reset",
    resetPassword
);


// ==========================================
// Get All Users
// ==========================================

router.get(
    "/",
    getUsers
);


// ==========================================
// Delete User
// ==========================================

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const User =
                require("../models/user");

            await User.findByIdAndDelete(
                req.params.id
            );

            res.json({
                message:
                    "User Deleted Successfully"
            });

        } catch (err) {

            res.status(500).json({
                message: err.message
            });

        }

    }
);


module.exports = router;