const Product = require("../models/product");
// Get All Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ id: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Product
const getProduct = async (req, res) => {
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

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Add Product
const addProduct = async (req, res) => {

    try {

        const exists = await Product.findOne({

            id: req.body.id

        });

        if (exists) {

            return res.status(400).json({

                message: "Product ID already exists"

            });

        }

        const product = await Product.create(req.body);

        res.status(201).json(product);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {
    getProducts,
    getProduct,
    addProduct
};

const updateProduct = async (req, res) => {

    try {

        const product = await Product.findOneAndUpdate(
            { id: Number(req.params.id) },
            req.body,
            { new: true }
        );

        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const deleteProduct = async (req, res) => {

    try {

        const product = await Product.findOneAndDelete({

            id: Number(req.params.id)

        });

        if (!product) {

            return res.status(404).json({

                message: "Product not found"

            });

        }

        res.json({

            message: "Product Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};
module.exports = {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
};