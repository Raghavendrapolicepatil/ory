const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },

    products: [
  {
    productId: Number,

    variant: {
      type: String,
      default: ""
    },

    weight: String,

    name: String,

    image: String,

    quantity: Number,

    price: Number
  }
],

    totalAmount: Number,

    address: String,

location: {

    city: {

        type: String

    },

    latitude: {

        type: Number

    },

    longitude: {

        type: Number

    }

},

    paymentMethod: {

        type: String,
        default: "Cash on Delivery"

    },

    deliveryPartner: {

        name: {

            type: String,
            default: ""

        },

        phone: {

            type: String,
            default: ""

        }

    },

    status: {

        type: String,

        enum: [

            "Pending",

            "Packed",

            "Out for Delivery",

            "Delivered",

            "Cancelled"

        ],

        default: "Pending"

    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Order", orderSchema);