const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

router.post("/", upload.single("image"), (req, res) => {

console.log("UPLOAD ROUTE HIT");

    console.log(req.file); 

    if (!req.file) {

        return res.status(400).json({

            message: "No Image Uploaded"

        });

    }

    res.json({

        message: "Image Uploaded Successfully",

        image: `/uploads/${req.file.filename}`

    });

});

module.exports = router;