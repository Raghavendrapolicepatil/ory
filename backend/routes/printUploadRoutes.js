const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ==========================================
   CREATE PRINT FOLDER
========================================== */

const uploadDir = path.join(__dirname, "../uploads/print");

if (!fs.existsSync(uploadDir)) {

    fs.mkdirSync(uploadDir, { recursive: true });

}

/* ==========================================
   STORAGE
========================================== */

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadDir);

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1000000) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

const upload = multer({

    storage

});
/* ==========================================
   FILE FILTER
========================================== */

const allowedTypes = [

    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"

];

const fileFilter = (req, file, cb) => {

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Only PDF, JPG, PNG and WEBP files are allowed."));

    }

};

/* ==========================================
   MULTER CONFIGURATION
========================================== */

const printUpload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 20 * 1024 * 1024 // 20 MB

    }

});
/* ==========================================
   PRINT UPLOAD API
========================================== */

router.post(

    "/",

    printUpload.array("files", 20),

    (req, res) => {

        try {

            if (!req.files || req.files.length === 0) {

                return res.status(400).json({

                    success: false,

                    message: "No files uploaded."

                });

            }

            const uploadedFiles = req.files.map(file => ({

                originalName: file.originalname,

                fileName: file.filename,

                mimeType: file.mimetype,

                size: file.size,

                url: `/uploads/print/${file.filename}`

            }));

            res.status(200).json({

                success: true,

                message: "Files uploaded successfully.",

                files: uploadedFiles

            });

        }

        catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message: "Upload failed."

            });

        }

    }

);
/* ==========================================
   ERROR HANDLER
========================================== */

router.use((err, req, res, next) => {

    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {

            return res.status(400).json({

                success: false,

                message: "Maximum file size is 20 MB."

            });

        }

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

    if (err) {

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

    next();

});

/* ==========================================
   EXPORT
========================================== */

module.exports = router;