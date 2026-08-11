const mongoose = require("mongoose");

// =========================
// Variant Schema
// =========================

const variantSchema = new mongoose.Schema({

    name: String,        // 250g, Pack of 2

    weight: String,

    price: Number,

    mrp: Number,

    stock: {
        type: Number,
        default: 0
    },

    image: {
        type: String,
        default: ""
    }

}, { _id: false });


// =========================
// Product Schema
// =========================

const productSchema = new mongoose.Schema({

    id: Number,

    // Basic
    name: String,

    brand: String,

    category: String,

    description: String,

    // Pricing
    price: Number,

    mrp: Number,

    discount: String,

    // Inventory
    weight: String,

    stock: Number,

    sku: {
        type: String,
        default: ""
    },

    // Images
    image: String,

    gallery: {
        type: [String],
        default: []
    },

    // Variants
    variants: {
        type: [variantSchema],
        default: []
    },

    // Ratings
    rating: {
        type: Number,
        default: 4.5
    },

    reviewCount: {
        type: Number,
        default: 0
    },

    // Seller
    seller: {
    type: String,
    default: "Ory Mart"
},

    // Homepage Sections
    todayDeal: {
        type: Boolean,
        default: false
    },

    featured: {
        type: Boolean,
        default: false
    },

    bestSeller: {
        type: Boolean,
        default: false
    },

    newArrival: {
        type: Boolean,
        default: false
    },

    trending: {
        type: Boolean,
        default: false
    },

    // Product Status
    isActive: {
        type: Boolean,
        default: true
    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Product", productSchema);