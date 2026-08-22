const express = require("express");

const router = express.Router();

const {
    getAdminOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// ==========================================
// Admin Authentication
// ==========================================

router.use(protect);
router.use(admin);

// ==========================================
// Admin Ordersrouter.use(admin);

// ==========================================

router.get("/", getAdminOrders);

router.get("/:id", getOrderById);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

module.exports = router;