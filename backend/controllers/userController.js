const PendingRegistration = require("../models/pendingRegistration");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// Send OTP using 2Factor
// ===============================

// ===============================
// Send OTP for Registration
// ===============================

const sendOTP = async (req, res) => {

    try {

        const {
            name,
            phone,
            password
        } = req.body;

        // Required fields
        if (!name || !phone || !password) {
            return res.status(400).json({
                message: "Name, phone and password are required"
            });
        }

        // Check phone already registered
        const phoneExists = await User.findOne({ phone });

        if (phoneExists) {
            return res.status(400).json({
                message: "Phone already registered"
            });
        }

        // Generate 4 digit OTP
        const otp =
            Math.floor(1000 + Math.random() * 9000).toString();

        // OTP valid for 5 minutes
        const otpExpiresAt =
            new Date(Date.now() + 5 * 60 * 1000);

        // Hash password before temporary storage
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Remove old pending registration
        await PendingRegistration.deleteOne({ phone });

        // Create pending registration
        await PendingRegistration.create({

            name,

            phone,

           

            password: hashedPassword,

            otp,

            otpExpiresAt

        });

        // Add +91 if required
        let phoneNumber = phone;

        if (!phoneNumber.startsWith("+")) {
            phoneNumber = "+91" + phoneNumber;
        }

        // 2Factor OTP API
        const url =
            `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/` +
            `${encodeURIComponent(phoneNumber)}/${otp}/OTP1`;

        const response = await fetch(url);

        const data = await response.text();

        console.log("2Factor Response:", data);

        if (!response.ok) {

            await PendingRegistration.deleteOne({ phone });

            return res.status(500).json({
                message: "Failed to send OTP"
            });

        }

        res.json({
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.error("Send OTP Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

};
// ===============================
// Verify OTP & Complete Registration
// ===============================

const verifyOTP = async (req, res) => {

    try {

        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                message: "Phone and OTP are required"
            });
        }

        // Find pending registration
        const pendingUser = await PendingRegistration.findOne({ phone });

        if (!pendingUser) {
            return res.status(404).json({
                message: "Registration session not found. Please request a new OTP."
            });
        }

        // Check OTP
        if (pendingUser.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // Check OTP expiry
        if (
            !pendingUser.otpExpiresAt ||
            pendingUser.otpExpiresAt < new Date()
        ) {

            await PendingRegistration.deleteOne({
                phone
            });

            return res.status(400).json({
                message: "OTP expired. Please request a new OTP."
            });
        }

        // Create actual user after OTP verification
        const user = await User.create({

            name: pendingUser.name,

            phone: pendingUser.phone,

            password: pendingUser.password,

            phoneVerified: true

        });

        // Delete temporary registration
        await PendingRegistration.deleteOne({
            phone
        });

        res.status(201).json({
            message: "Registration Successful",
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                phoneVerified: user.phoneVerified,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Verify OTP Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

};

// ===============================
// Send OTP for Forgot Password
// ===============================

const sendForgotPasswordOTP = async (req, res) => {

    try {

        const { phone } = req.body;


        // Required field
        if (!phone) {

            return res.status(400).json({
                message: "Phone number is required"
            });

        }


        // Find user
        const user =
            await User.findOne({ phone });


        if (!user) {

            return res.status(404).json({
                message: "Phone number is not registered"
            });

        }


        // Generate 4 digit OTP
        const otp =
            Math.floor(
                1000 + Math.random() * 9000
            ).toString();


        // OTP valid for 5 minutes
        const otpExpiresAt =
            new Date(
                Date.now() + 5 * 60 * 1000
            );


        // Save OTP
        user.otp = otp;

        user.otpExpiresAt =
            otpExpiresAt;

        await user.save();


        // Add +91
        let phoneNumber = phone;


        if (!phoneNumber.startsWith("+")) {

            phoneNumber =
                "+91" + phoneNumber;

        }


        // 2Factor API
        const url =
            `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/` +
            `${encodeURIComponent(phoneNumber)}/${otp}/OTP1`;


        const response =
            await fetch(url);


        const data =
            await response.text();


        console.log(
            "Forgot Password 2Factor Response:",
            data
        );


        if (!response.ok) {

            user.otp = null;
            user.otpExpiresAt = null;

            await user.save();


            return res.status(500).json({
                message:
                    "Failed to send OTP"
            });

        }


        res.json({
            message:
                "OTP sent successfully"
        });


    } catch (error) {

        console.error(
            "Forgot Password OTP Error:",
            error
        );


        res.status(500).json({
            message:
                error.message
        });

    }

};// ===============================
// Reset Password
// ===============================

const resetPassword = async (req, res) => {

    try {

        const {
            phone,
            otp,
            password
        } = req.body;


        // Required fields
        if (!phone || !otp || !password) {

            return res.status(400).json({
                message:
                    "Phone, OTP and password are required"
            });

        }


        // Find user
        const user =
            await User.findOne({ phone });


        if (!user) {

            return res.status(404).json({
                message:
                    "User not found"
            });

        }


        // Check OTP
        if (user.otp !== otp) {

            return res.status(400).json({
                message:
                    "Invalid OTP"
            });

        }


        // Check OTP expiry
        if (
            !user.otpExpiresAt ||
            user.otpExpiresAt < new Date()
        ) {

            user.otp = null;
            user.otpExpiresAt = null;

            await user.save();


            return res.status(400).json({
                message:
                    "OTP expired. Please request a new OTP."
            });

        }


        // Password length
        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });

        }


        // Hash new password
        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // Update password
        user.password =
            hashedPassword;


        // Clear OTP
        user.otp = null;

        user.otpExpiresAt = null;


        await user.save();


        res.json({

            message:
                "Password reset successfully"

        });


    } catch (error) {

        console.error(
            "Reset Password Error:",
            error
        );


        res.status(500).json({
            message:
                error.message
        });

    }

};

// ===============================
// Register
// ===============================
const registerUser = async (req, res) => {

    try {

        const {
            name,
            phone,
            password
        } = req.body;


        if (!name || !phone || !password) {

            return res.status(400).json({
                message:
                    "Name, phone and password are required"
            });

        }


        const phoneExists =
            await User.findOne({ phone });


        if (phoneExists) {

            return res.status(400).json({
                message:
                    "Phone already registered"
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        await User.create({

            name,

            phone,

            password: hashedPassword,

            phoneVerified: false

        });


        res.status(201).json({

            message:
                "Registration Successful"

        });


    } catch (error) {

        console.error(
            "Register Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

};


// ===============================
// Login
// ===============================
const loginUser = async (req, res) => {

    try {

        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                message: "Phone number and password are required"
            });
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Phone Number"
            });
        }

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        if (!user.phoneVerified) {
            return res.status(400).json({
                message: "Please verify your phone number first"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                phoneVerified: user.phoneVerified,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Login Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ===============================
// Get Users
// ===============================

const getUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password -otp");

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {
    registerUser,
    loginUser,
    getUsers,
    sendOTP,
    verifyOTP,
    sendForgotPasswordOTP,
    resetPassword
};