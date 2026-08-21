const express = require("express");

const router = express.Router();

const {

    placeOrder,

    getOrders,

    getOrderById,

    updateOrder,

    deleteOrder

} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

// ==========================================
// Place Order
// ==========================================

router.post("/", protect, placeOrder);

// ==========================================
// Get All Orders
// ==========================================

router.get("/", protect, getOrders);

// ==========================================
// Get Single Order
// ==========================================

router.get("/:id", protect, getOrderById);

// ==========================================
// Update Order Status
// ==========================================

router.put("/:id", updateOrder);

// ==========================================
// Delete Order
// ==========================================

router.delete("/:id", deleteOrder);

module.exports = router;