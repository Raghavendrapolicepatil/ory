const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getUsers,
    sendOTP,
    verifyOTP
} = require("../controllers/userController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// OTP
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// Get all users
router.get("/", getUsers);

// Delete user
router.delete("/:id", async (req, res) => {

    try {

        const User = require("../models/user");

        await User.findByIdAndDelete(req.params.id);

        res.json({
            message: "User Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

module.exports = router;