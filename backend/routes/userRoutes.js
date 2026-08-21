const express = require("express");

const router = express.Router();

const {
    sendOTP,
    verifyOTP,
    getUsers
} = require("../controllers/userController");


// Send OTP
router.post(
    "/send-otp",
    sendOTP
);


// Verify OTP
router.post(
    "/verify-otp",
    verifyOTP
);


// Get Users
router.get(
    "/",
    getUsers
);


// Delete User
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