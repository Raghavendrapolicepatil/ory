const express = require("express");

const router = express.Router();

const {

    getBanners,

    addBanner,

    updateBanner,

    deleteBanner

} = require("../controllers/bannerController");

// ==========================================
// Get All Banners
// ==========================================

router.get("/", getBanners);

// ==========================================
// Add Banner
// ==========================================

router.post("/", addBanner);

// ==========================================
// Update Banner
// ==========================================

router.put("/:id", updateBanner);

// ==========================================
// Delete Banner
// ==========================================

router.delete("/:id", deleteBanner);

module.exports = router;