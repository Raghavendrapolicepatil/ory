const Order = require("../models/order");
const Product = require("../models/product");

// ==========================================
// Place Order
// ==========================================

const placeOrder = async (req, res) => {

    try {

const {
    products,
    address,
    location,
    paymentMethod,
    totalAmount
} = req.body;

const user = req.user._id;

        // ==========================
        // Check Stock
        // ==========================

        for (const item of products) {

            const productId =
    typeof item.productId === "string"
        ? Number(item.productId.split("-")[0])
        : item.productId;

const product = await Product.findOne({

    id: productId

});

            if (!product) {

                return res.status(404).json({

                    message: "Product not found"

                });

            }

            if (product.stock < item.quantity) {

                return res.status(400).json({

                    message: `${product.name} is out of stock`

                });

            }

        }

        // ==========================
        // Reduce Stock
        // ==========================

        for (const item of products) {

            const productId =
    typeof item.productId === "string"
        ? Number(item.productId.split("-")[0])
        : item.productId;

const product = await Product.findOne({

    id: productId

});

            product.stock -= item.quantity;

            await product.save();

        }

        // ==========================
        // Save Order
        // ==========================

const order = await Order.create({

    user,
    products,
    address,
    location,
    paymentMethod,
    totalAmount,
    status: "Pending"

});

        res.status(201).json({

            message: "Order Placed Successfully",

            order

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};
// ==========================================
// Get User Orders
// ==========================================

const getOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            user: req.user._id
        })

        .populate("user", "name phone")

        .sort({
            createdAt: -1
        });

        res.json(orders);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};
// ==========================================
// Get Single Order
// ==========================================

const getOrderById = async (req, res) => {

    try {

        const order = await Order.findOne({

    _id: req.params.id,

    user: req.user._id

})

.populate("user", "name phone");

        if (!order) {

            return res.status(404).json({

                message: "Order Not Found"

            });

        }

        res.json(order);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==========================================
// Update Order Status
// ==========================================

const updateOrder = async (req, res) => {

    try {

       const order = await Order.findByIdAndUpdate(

    req.params.id,

    {
        status: req.body.status
    },

    {
        new: true
    }

);

        res.json({

            message: "Order Updated Successfully",

            order

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==========================================
// Delete Order
// ==========================================

const deleteOrder = async (req, res) => {

    try {

        await Order.findByIdAndDelete(

            req.params.id

        );

        res.json({

            message: "Order Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    placeOrder,

    getOrders,

    getOrderById,

    updateOrder,

    deleteOrder

};