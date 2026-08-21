const User = require("../models/user");
const jwt = require("jsonwebtoken");


// ==========================================
// Helper: Generate OTP
// ==========================================

const generateOTP = () => {

    return Math.floor(
        1000 + Math.random() * 9000
    ).toString();

};


// ==========================================
// Helper: Send SMS OTP using 2Factor
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
// Send OTP
// Login + New User
// ==========================================

const sendOTP = async (req, res) => {

    try {

        const { phone } = req.body;

        if (!phone) {

            return res.status(400).json({
                message: "Phone number is required"
            });

        }

        // Validate phone
        if (!/^[0-9]{10}$/.test(phone)) {

            return res.status(400).json({
                message:
                    "Please enter a valid 10-digit phone number"
            });

        }

        const otp = generateOTP();

        const otpExpiresAt =
            new Date(Date.now() + 5 * 60 * 1000);


        // ======================================
        // Existing user
        // ======================================

        const user = await User.findOne({ phone });


        if (user) {

            user.otp = otp;

            user.otpExpiresAt =
                otpExpiresAt;

            await user.save();

        }


        // ======================================
        // New user
        // ======================================

        // OTP for new users is temporarily stored
        // in memory for this request.
        // We use a temporary collection below.

        else {

            const PendingOTP =
                require("../models/pendingRegistration");

            await PendingOTP.deleteOne({
                phone
            });

            await PendingOTP.create({

                name: "OryMart User",

                phone,

                otp,

                otpExpiresAt

            });

        }


        // ======================================
        // Send SMS
        // ======================================

        try {

            await sendSMSOTP(
                phone,
                otp
            );

        } catch (smsError) {

            if (user) {

                user.otp = null;

                user.otpExpiresAt = null;

                await user.save();

            } else {

                const PendingOTP =
                    require("../models/pendingRegistration");

                await PendingOTP.deleteOne({
                    phone
                });

            }

            throw smsError;

        }


        res.json({

            message:
                "OTP sent successfully"

        });

    } catch (error) {

        console.error(
            "Send OTP Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

};


// ==========================================
// Verify OTP
// Existing User + New User
// ==========================================

const verifyOTP = async (req, res) => {

    try {

        const { phone, otp } = req.body;

        if (!phone || !otp) {

            return res.status(400).json({
                message:
                    "Phone and OTP are required"
            });

        }


        // ======================================
        // Check existing user
        // ======================================

        let user =
            await User.findOne({ phone });


        // ======================================
        // Existing User
        // ======================================

        if (user) {

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

            // Verify phone
            user.phoneVerified = true;

            // Clear OTP
            user.otp = null;

            user.otpExpiresAt = null;

            await user.save();

        }


        // ======================================
        // New User
        // ======================================

        else {

            const PendingOTP =
                require("../models/pendingRegistration");


            const pendingUser =
                await PendingOTP.findOne({
                    phone
                });


            if (!pendingUser) {

                return res.status(404).json({
                    message:
                        "OTP session expired. Please request a new OTP."
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

                await PendingOTP.deleteOne({
                    phone
                });

                return res.status(400).json({
                    message:
                        "OTP expired. Please request a new OTP."
                });

            }


            // Create new user
            user = await User.create({

                name: "OryMart User",

                phone,

                phoneVerified: true

            });


            // Delete pending OTP
            await PendingOTP.deleteOne({
                phone
            });

        }


        // ======================================
        // Generate JWT
        // ======================================

        const token = jwt.sign(

            {
                id: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        // ======================================
        // Response
        // ======================================

        res.json({

            message:
                "Login Successful",

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
            "Verify OTP Error:",
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
    getUsers

};