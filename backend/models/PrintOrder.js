const mongoose = require("mongoose");

/* ==========================================
   Print File
========================================== */

const printItemSchema = new mongoose.Schema({

    id: String,

    fileName: String,

    fileType: String,

    fileUrl: String,

    thumbnail: String,

    paperSize: String,

    printType: String,

    side: String,

    pages: Number,

    copies: Number,

    price: Number

}, { _id: false });

/* ==========================================
   Print Order
========================================== */

const printOrderSchema = new mongoose.Schema({

    orderId: {

        type: String,

        unique: true

    },

    user: {

        id: String,

        name: String,

        email: String,

        phone: String

    },

    address: {

        name: String,

        mobile: String,

        house: String,

        street: String,

        city: String,

        pincode: String

    },

    paymentMethod: {

        type: String,

        default: "COD"

    },

    items: [printItemSchema],

    totalFiles: {

        type: Number,

        default: 0

    },

    totalPages: {

        type: Number,

        default: 0

    },

    totalSheets: {

        type: Number,

        default: 0

    },

    totalPrice: {

        type: Number,

        default: 0

    },

    status: {

        type: String,

        enum: [

            "Pending",

            "Printing",

            "Ready",

            "Delivered",

            "Cancelled"

        ],

        default: "Pending"

    }

}, {

    timestamps: true

});

/* ==========================================
   Auto Order ID
========================================== */

printOrderSchema.pre("save", function () {

    if (!this.orderId) {
        this.orderId = "PR" + Date.now();
    }

});

module.exports = mongoose.model(
    "PrintOrder",
    printOrderSchema
);