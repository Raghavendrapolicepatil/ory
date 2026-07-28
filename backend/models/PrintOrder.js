const mongoose = require("mongoose");

const printFileSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    fileName: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    size: {
        type: Number,
        required: true
    }

}, { _id: false });

const printOrderSchema = new mongoose.Schema({

    orderId: {
        type: String,
        unique: true
    },

    customer: {

        name: String,

        phone: String,

        email: String,

        address: String

    },

    files: [printFileSchema],

    paper: {
        type: String,
        default: "A4"
    },

    printType: {
        type: String,
        enum: ["bw", "colour"],
        default: "bw"
    },

    side: {
        type: String,
        default: "Single Side"
    },

    copies: {
        type: Number,
        default: 1
    },

    totalPages: Number,

    totalSheets: Number,

    totalPrice: Number,

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

printOrderSchema.pre("save", function(next){

    if(!this.orderId){

        this.orderId =
            "PR" +
            Date.now();

    }

    next();

});

module.exports =
    mongoose.model(
        "PrintOrder",
        printOrderSchema
    );