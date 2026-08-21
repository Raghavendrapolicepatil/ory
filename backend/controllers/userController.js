const PendingRegistration = require("../models/pendingRegistration");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


// ==========================================
// Helper: Send SMS OTP
// ==========================================

const sendSMSOTP = async (phone, otp) => {

    let phoneNumber = phone;

    if (!phoneNumber.startsWith("+")) {
        phoneNumber = "+91" + phoneNumber;
    }

    const url =
        `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/` +
        `${encodeURIComponent(phoneNumber)}/${otp}/OTP1`;

    const response = await fetch(url);

    const data = await response.text();

    console.log("2Factor Response:", data);

    if (!response.ok) {
        throw new Error("Failed to send OTP");
    }

    return data;
};


// ==========================================
// Generate OTP
// ==========================================

const generateOTP = () => {

    return Math.floor(
        1000 + Math.random() * 9000
    ).toString();

};


// ==========================================
// Registration - Send OTP
// ==========================================

const sendOTP = async (req, res) => {

    try {

        const { name, phone } = req.body;

        if (!name || !phone) {

            return res.status(400).json({
                message: "Name and phone number are required"
            });

        }

        // Check existing user
        const phoneExists =
            await User.findOne({ phone });

        if (phoneExists) {

            return res.status(400).json({
                message: "Phone already registered"
            });

        }

        const otp = generateOTP();

        const otpExpiresAt =
            new Date(Date.now() + 5 * 60 * 1000);

        // Remove old pending registration
        await PendingRegistration.deleteOne({
            phone
        });

        // Create pending registration
        await PendingRegistration.create({

            name,
            phone,
            otp,
            otpExpiresAt

        });

        // Send SMS
        try {

            await sendSMSOTP(phone, otp);

        } catch (smsError) {

            await PendingRegistration.deleteOne({
                phone
            });

            throw smsError;

        }

        res.json({
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.error(
            "Registration OTP Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// Registration - Verify OTP
// ==========================================

const verifyOTP = async (req, res) => {

    try {

        const { phone, otp } = req.body;

        if (!phone || !otp) {

            return res.status(400).json({
                message: "Phone and OTP are required"
            });

        }

        const pendingUser =
            await PendingRegistration.findOne({
                phone
            });

        if (!pendingUser) {

            return res.status(404).json({
                message:
                    "Registration session not found. Please request a new OTP."
            });

        }

        // Check OTP
        if (pendingUser.otp !== otp) {

            return res.status(400).json({
                message: "Invalid OTP"
            });

        }

        // Check expiry
        if (
            !pendingUser.otpExpiresAt ||
            pendingUser.otpExpiresAt < new Date()
        ) {

            await PendingRegistration.deleteOne({
                phone
            });

            return res.status(400).json({
                message:
                    "OTP expired. Please request a new OTP."
            });

        }

        // Create user
        const user = await User.create({

            name: pendingUser.name,

            phone: pendingUser.phone,

            phoneVerified: true

        });

        // Remove pending registration
        await PendingRegistration.deleteOne({
            phone
        });

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({

            message: "Registration Successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                phone: user.phone,

                phoneVerified:
                    user.phoneVerified,

                role: user.role

            }

        });

    } catch (error) {

        console.error(
            "Verify Registration OTP Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// Login - Send OTP
// ==========================================

const sendLoginOTP = async (req, res) => {

    try {

        const { phone } = req.body;

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
                message:
                    "Phone number is not registered"
            });

        }

        if (!user.phoneVerified) {

            return res.status(400).json({
                message:
                    "Please verify your phone number first"
            });

        }

        const otp = generateOTP();

        const otpExpiresAt =
            new Date(Date.now() + 5 * 60 * 1000);

        user.otp = otp;

        user.otpExpiresAt =
            otpExpiresAt;

        await user.save();

        try {

            await sendSMSOTP(phone, otp);

        } catch (smsError) {

            user.otp = null;
            user.otpExpiresAt = null;

            await user.save();

            throw smsError;

        }

        res.json({
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.error(
            "Login OTP Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// Login - Verify OTP
// ==========================================

const verifyLoginOTP = async (req, res) => {

    try {

        const { phone, otp } = req.body;

        if (!phone || !otp) {

            return res.status(400).json({
                message:
                    "Phone and OTP are required"
            });

        }

        const user =
            await User.findOne({ phone });

        if (!user) {

            return res.status(404).json({
                message:
                    "Phone number is not registered"
            });

        }

        // Check OTP
        if (user.otp !== otp) {

            return res.status(400).json({
                message: "Invalid OTP"
            });

        }

        // Check expiry
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

        // Clear OTP
        user.otp = null;
        user.otpExpiresAt = null;

        await user.save();

        // Generate JWT
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

                phoneVerified:
                    user.phoneVerified,

                role: user.role

            }

        });

    } catch (error) {

        console.error(
            "Verify Login OTP Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// Get All Users
// ==========================================

const getUsers = async (req, res) => {

    try {

        const users =
            await User.find().select("-otp");

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// Exports
// ==========================================

module.exports = {

    sendOTP,
    verifyOTP,

    sendLoginOTP,
    verifyLoginOTP,

    getUsers

};