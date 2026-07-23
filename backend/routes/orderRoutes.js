const express = require("express");

const router = express.Router();

const {

    placeOrder,

    getOrders,

    getOrderById,

    updateOrder,

    deleteOrder

} = require("../controllers/orderController");

// ==========================================
// Place Order
// ==========================================

router.post("/", placeOrder);

// ==========================================
// Get All Orders
// ==========================================

router.get("/", getOrders);

// ==========================================
// Get Single Order
// ==========================================

router.get("/:id", getOrderById);

// ==========================================
// Update Order Status
// ==========================================

router.put("/:id", updateOrder);

// ==========================================
// Delete Order
// ==========================================

router.delete("/:id", deleteOrder);

module.exports = router;