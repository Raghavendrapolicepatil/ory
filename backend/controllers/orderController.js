const Order = require("../models/order");
const Product = require("../models/product");
const Settings = require("../models/settings");
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
        // CHECK DELIVERY LOCATION
        // ==========================

        const settings = await Settings.findOne();

        if (!settings) {

            return res.status(500).json({

                message: "Store delivery settings not available"

            });

        }

        // Delivery disabled from Admin
        if (settings.deliveryEnabled === false) {

            return res.status(403).json({

                message: "Delivery is currently unavailable"

            });

        }

        // Customer location required
        if (
            !location ||
            typeof location.latitude !== "number" ||
            typeof location.longitude !== "number"
        ) {

            return res.status(400).json({

                message: "Please select your delivery location"

            });

        }

        const userLat = location.latitude;
        const userLon = location.longitude;

        const storeLat = Number(settings.storeLatitude);
        const storeLon = Number(settings.storeLongitude);
        const deliveryRadius = Number(settings.deliveryRadius);

        if (
            !Number.isFinite(storeLat) ||
            !Number.isFinite(storeLon) ||
            !Number.isFinite(deliveryRadius) ||
            deliveryRadius <= 0
        ) {

            return res.status(500).json({

                message: "Invalid store delivery location settings"

            });

        }

        // ==========================
        // DISTANCE CALCULATION
        // ==========================

        const R = 6371;

        const dLat =
            (storeLat - userLat) *
            Math.PI / 180;

        const dLon =
            (storeLon - userLon) *
            Math.PI / 180;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(userLat * Math.PI / 180) *
            Math.cos(storeLat * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

        const distance = R * c;

        console.log(
            `Customer distance: ${distance.toFixed(2)} KM`
        );

        console.log(
            `Allowed radius: ${deliveryRadius} KM`
        );


        // ==========================
        // OUTSIDE DELIVERY AREA
        // ==========================

        if (distance > deliveryRadius) {

            return res.status(403).json({

                message:
                    `Sorry, delivery is available only within ${deliveryRadius} KM of Orymart.`,

                distance:
                    Number(distance.toFixed(2)),

                deliveryRadius

            });

        }

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
// Get All Orders - Admin
// ==========================================

const getAdminOrders = async (req, res) => {

    try {

        const orders = await Order.find()

            .populate("user", "name phone email")

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

        const order = await Order.findById(req.params.id)
            .populate("user", "name phone email");

        if (!order) {

            return res.status(404).json({
                message: "Order Not Found"
            });

        }

        res.json(order);

    } catch (error) {

        console.error("Get Order Error:", error);

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

    getAdminOrders,

    getOrderById,

    updateOrder,

    deleteOrder

};