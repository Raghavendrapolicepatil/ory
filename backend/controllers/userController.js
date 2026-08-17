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
            email,
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

        // Check email only if provided
        if (email) {

            const emailExists = await User.findOne({ email });

            if (emailExists) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }

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

            email: email || undefined,

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
// Verify OTP
// ===============================

const verifyOTP = async (req, res) => {

    try {

        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                message: "Phone and OTP are required"
            });
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check OTP
        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // Check expiry
        if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {

            user.otp = null;
            user.otpExpiresAt = null;

            await user.save();

            return res.status(400).json({
                message: "OTP expired"
            });
        }

        // Verify phone
        user.phoneVerified = true;

        // Clear OTP
        user.otp = null;
        user.otpExpiresAt = null;

        await user.save();

        res.json({
            message: "Phone number verified successfully"
        });

    } catch (error) {

        console.error("Verify OTP Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

};


// ===============================
// Register
// ===============================

const registerUser = async (req, res) => {

    try {

        const { name, email, phone, password } = req.body;

        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const phoneExists = await User.findOne({ phone });

        if (phoneExists) {
            return res.status(400).json({
                message: "Phone already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Registration Successful"
        });

    } catch (error) {

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

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Email"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({
                message: "Invalid Password"
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
                email: user.email,
                phone: user.phone,
                phoneVerified: user.phoneVerified,
                role: user.role
            }
        });

    } catch (error) {

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
    verifyOTP
};