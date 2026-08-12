const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name:{

        type:String,

        required:true,

        unique:true

    },

    slug:{

        type:String,

        required:true,

        unique:true

    },

    image:{

        type:String,

        default:""

    },

    status:{

    type:Boolean,

    default:true

},

sortOrder:{

    type:Number,

    default:999

}

},{timestamps:true});

module.exports = mongoose.model("Category",categorySchema);