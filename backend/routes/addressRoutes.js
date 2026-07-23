const express = require("express");

const router = express.Router();

const {

    getAddresses,

    addAddress

} = require("../controllers/addressController");

router.get("/", getAddresses);

router.post("/", addAddress);

module.exports = router;

// Get Orders By User
router.get("/user/:userId", async (req, res) => {

    try {

        const Order = require("../models/Order");

        const orders = await Order.find({

            user: req.params.userId

        }).sort({ createdAt: -1 });

        res.json(orders);

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});