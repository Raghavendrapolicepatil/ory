const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// ==========================================
// GET ALL PRODUCTS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const products = await Product
            .find()
            .sort({ id: 1 });

        res.json(products);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// ==========================================
// GET SINGLE PRODUCT
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const product = await Product.findOne({
            id: Number(req.params.id)
        });

        if (!product) {

            return res.status(404).json({
                message: "Product Not Found"
            });

        }

        res.json(product);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// ==========================================
// ADD PRODUCT
// ==========================================

router.post("/", async (req, res) => {

    try {

        if (!req.body.name)
            return res.status(400).json({
                message: "Product Name Required"
            });

        if (!req.body.category)
            return res.status(400).json({
                message: "Category Required"
            });

        if (req.body.price == null)
            return res.status(400).json({
                message: "Price Required"
            });

        if (req.body.mrp == null)
            return res.status(400).json({
                message: "MRP Required"
            });

            // First Order Offer Validation
if (req.body.firstOrderOffer) {

    const offerPrice = Number(req.body.firstOrderOfferPrice);
    const regularPrice = Number(req.body.price);

    if (
        !offerPrice ||
        offerPrice <= 0 ||
        offerPrice >= regularPrice
    ) {
        return res.status(400).json({
            message: "Offer price must be greater than 0 and less than regular price"
        });
    }

}

        const lastProduct = await Product
            .findOne()
            .sort({ id: -1 });

        const nextId = lastProduct
            ? lastProduct.id + 1
            : 1;

        const product = new Product({

            id: nextId,

            name: req.body.name,

            brand: req.body.brand || "",

            category: req.body.category,

            description: req.body.description || "",

            price: req.body.price,

mrp: req.body.mrp,

discount: req.body.discount || "",

// First Order Offer
firstOrderOffer: req.body.firstOrderOffer || false,

firstOrderOfferPrice: req.body.firstOrderOffer
    ? Number(req.body.firstOrderOfferPrice)
    : null,

            stock: req.body.stock || 0,

            weight: req.body.weight || "",

            sku: req.body.sku || "",

            image: req.body.image || "",

            gallery: req.body.gallery || [],

            variants: req.body.variants || [],

            rating: req.body.rating || 4.5,

            reviewCount: req.body.reviewCount || 0,

            seller: req.body.seller || "Snackible Grocery",

            todayDeal: req.body.todayDeal || false,

            featured: req.body.featured || false,

            bestSeller: req.body.bestSeller || false,

            newArrival: req.body.newArrival || false,

            trending: req.body.trending || false,

            isActive: req.body.isActive ?? true

        });

        await product.save();

        res.status(201).json({

            message: "Product Added Successfully",

            product

        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// ==========================================
// UPDATE PRODUCT
// ==========================================

router.put("/:id", async (req, res) => {

    try {

        // First Order Offer Validation
if (req.body.firstOrderOffer) {

    const offerPrice = Number(req.body.firstOrderOfferPrice);
    const regularPrice = Number(req.body.price);

    if (
        !offerPrice ||
        offerPrice <= 0 ||
        offerPrice >= regularPrice
    ) {
        return res.status(400).json({
            message: "Offer price must be greater than 0 and less than regular price"
        });
    }

}
        const product = await Product.findOneAndUpdate(

            {
                id: Number(req.params.id)
            },

            req.body,

            {
                new: true,
                runValidators: true
            }

        );

        if (!product) {

            return res.status(404).json({

                message: "Product Not Found"

            });

        }

        res.json({

            message: "Product Updated Successfully",

            product

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

// ==========================================
// DELETE PRODUCT
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const product = await Product.findOneAndDelete({

            id: Number(req.params.id)

        });

        if (!product) {

            return res.status(404).json({

                message: "Product Not Found"

            });

        }

        res.json({

            message: "Product Deleted Successfully"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

module.exports = router;