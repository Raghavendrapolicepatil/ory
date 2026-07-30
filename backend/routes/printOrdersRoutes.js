const express = require("express");

const router = express.Router();

const PrintOrder = require("../models/PrintOrder");

/* ==========================================
   CREATE PRINT ORDER
========================================== */

router.post("/", async (req, res) => {

    try {

        const order = await PrintOrder.create(req.body);

        res.status(201).json(order);

    }

    catch (error) {

    console.error("PRINT ORDER ERROR:", error);

    res.status(500).json({
        message: error.message,
        stack: error.stack
    });

}

});

/* ==========================================
   GET ALL PRINT ORDERS
========================================== */

router.get("/", async (req, res) => {

    try {

        const orders = await PrintOrder.find()

            .sort({

                createdAt: -1

            });

        res.json(orders);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to fetch print orders."

        });

    }

});

/* ==========================================
   GET SINGLE PRINT ORDER
========================================== */

router.get("/:id", async (req, res) => {

    try {

        const order = await PrintOrder.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                message: "Print order not found."

            });

        }

        res.json(order);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to fetch print order."

        });

    }

});

/* ==========================================
   UPDATE STATUS
========================================== */

router.patch("/:id", async (req, res) => {

    try {

        const order = await PrintOrder.findByIdAndUpdate(

            req.params.id,

            {

                status: req.body.status

            },

            {

                new: true

            }

        );

        if (!order) {

            return res.status(404).json({

                message: "Print order not found."

            });

        }

        res.json(order);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to update print order."

        });

    }

});

/* ==========================================
   DELETE ORDER
========================================== */

router.delete("/:id", async (req, res) => {

    try {

        const order = await PrintOrder.findByIdAndDelete(

            req.params.id

        );

        if (!order) {

            return res.status(404).json({

                message: "Print order not found."

            });

        }

        res.json({

            message: "Print order deleted."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Unable to delete print order."

        });

    }

});

module.exports = router;