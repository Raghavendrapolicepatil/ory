const express = require("express");

const router = express.Router();

const {

    getSettings,

    updateSettings

} = require("../controllers/settingsController");

// ==========================================
// Get Settings
// ==========================================

router.get("/", getSettings);

// ==========================================
// Update Settings
// ==========================================

router.put("/", updateSettings);

module.exports = router;