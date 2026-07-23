const Settings = require("../models/settings");

// ==========================================
// Get Settings
// ==========================================

const getSettings = async (req, res) => {

    try {

        let settings = await Settings.findOne();

        if (!settings) {

            settings = await Settings.create({

                storeName: "Patil Groceries",

                storePhone: "",

                storeEmail: "",

                storeAddress: "",

                deliveryCharge: 20,

                freeDeliveryAbove: 199,

                minimumOrder: 99,

                platformFee: 0,

                freeGiftAbove: 499,

                giftProduct: "",

                supportNumber: "",

                whatsappNumber: "",

                deliveryTime: "20-30 mins",

                storeStatus: "Open"

            });

        }

        res.json(settings);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==========================================
// Update Settings
// ==========================================

const updateSettings = async (req, res) => {

    try {

        let settings = await Settings.findOne();

        if (!settings) {

            settings = await Settings.create(req.body);

        } else {

            settings = await Settings.findByIdAndUpdate(

                settings._id,

                req.body,

                {

                    new: true,

                    runValidators: true

                }

            );

        }

        res.json({

            message: "Settings Updated Successfully",

            settings

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    getSettings,

    updateSettings

};