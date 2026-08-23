const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({

    storeName: {

        type: String,

        default: "Orymart"

    },

    storePhone: String,

    storeEmail: String,

    storeAddress: String,

    deliveryCharge: {

        type: Number,

        default: 20

    },

    freeDeliveryAbove: {

        type: Number,

        default: 199

    },

    minimumOrder: {

        type: Number,

        default: 99

    },

    platformFee: {

        type: Number,

        default: 0

    },

    freeGiftAbove: {

        type: Number,

        default: 499

    },

    giftProduct: {

        type: String,

        default: ""

    },

    supportNumber: String,

    whatsappNumber: String,

    deliveryTime: {

        type: String,

        default: "20-30 mins"

    },

    storeStatus: {

        type: String,

        enum: ["Open", "Closed"],

        default: "Open"

    },

        // ==========================================
    // DELIVERY LOCATION SETTINGS
    // ==========================================

    deliveryEnabled: {

        type: Boolean,

        default: true

    },

    serviceArea: {

        type: String,

        default: "Afzalpur"

    },

    deliveryRadius: {

        type: Number,

        default: 5

    },

    storeLatitude: {

        type: Number,

        default: 0

    },

    storeLongitude: {

        type: Number,

        default: 0

    }

}, {

    timestamps: true

});


module.exports = mongoose.model("Settings", settingsSchema);