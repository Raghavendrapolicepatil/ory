const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema({

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
        sparse: true
    },

    password: {
        type: String,
        required: true
    },

    otp: {
        type: String,
        required: true
    },

    otpExpiresAt: {
        type: Date,
        required: true
    }

}, {
    timestamps: true
});

// Automatically delete pending registration after 10 minutes
pendingRegistrationSchema.index(
    { otpExpiresAt: 1 },
    { expireAfterSeconds: 600 }
);

module.exports = mongoose.model(
    "PendingRegistration",
    pendingRegistrationSchema
);