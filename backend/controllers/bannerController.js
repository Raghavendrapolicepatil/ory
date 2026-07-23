const Banner = require("../models/Banner");

// ==========================================
// Get All Banners
// ==========================================

const getBanners = async (req, res) => {

    try {

        const banners = await Banner.find()

            .sort({ order: 1 });

        res.json(banners);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==========================================
// Add Banner
// ==========================================

const addBanner = async (req, res) => {

    try {

        const banner = await Banner.create(req.body);

        res.status(201).json({

            message: "Banner Added Successfully",

            banner

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==========================================
// Update Banner
// ==========================================

const updateBanner = async (req, res) => {

    try {

        const banner = await Banner.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true

            }

        );

        res.json({

            message: "Banner Updated Successfully",

            banner

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==========================================
// Delete Banner
// ==========================================


const deleteBanner = async (req, res) => {

    try {

        console.log("DELETE ID:", req.params.id);

        const banner = await Banner.findById(req.params.id);

        console.log("FOUND:", banner);

        const deleted = await Banner.findByIdAndDelete(req.params.id);

        console.log("DELETED:", deleted);

        if (!deleted) {

            return res.status(404).json({
                message: "Banner not found"
            });

        }

        res.json({
            message: "Banner Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {

    getBanners,

    addBanner,

    updateBanner,

    deleteBanner

};