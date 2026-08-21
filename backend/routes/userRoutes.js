const express = require("express");

const router = express.Router();

const {
    getUsers,

    // Registration OTP
    sendOTP,
    verifyOTP,

    // Login OTP
    sendLoginOTP,
    verifyLoginOTP

} = require("../controllers/userController");


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
// Login OTP
// ==========================================

router.post(
    "/send-login-otp",
    sendLoginOTP
);

router.post(
    "/verify-login-otp",
    verifyLoginOTP
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