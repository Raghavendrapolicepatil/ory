const multer = require("multer");
const path = require("path");

// ==========================================
// Storage
// ==========================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// ==========================================
// File Filter
// ==========================================

const fileFilter = (req, file, cb) => {

    const allowed = [

        "image/jpeg",

        "image/png",

        "image/webp"

    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Only JPG, PNG & WEBP allowed"));

    }

};

module.exports = multer({

    storage,

    fileFilter

});