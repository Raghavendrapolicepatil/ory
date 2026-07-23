const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({

    title:{

        type:String,

        required:true

    },

    subtitle:{

        type:String,

        default:""

    },

    image:{

        type:String,

        required:true

    },

    link:{

        type:String,

        default:"#"

    },

    status:{

        type:Boolean,

        default:true

    },

    order:{

        type:Number,

        default:1

    }

},{timestamps:true});

module.exports = mongoose.model("Banner",bannerSchema);