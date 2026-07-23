const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getUsers
} = require("../controllers/userController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

router.get("/", getUsers);

router.delete("/:id", async (req, res) => {

    try {

        const User = require("../models/user");

        await User.findByIdAndDelete(req.params.id);

        res.json({

            message: "User Deleted Successfully"

        });

    } catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

module.exports = router;

