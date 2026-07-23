const Cart=require("../models/Cart");
const Product=require("../models/Product");

// Get Cart

const getCart=async(req,res)=>{

try{

const cart=await Cart.find()

.populate("product");

res.json(cart);

}

catch(error){

res.status(500).json({

message:error.message

});

}

};

// Add Cart

const addCart=async(req,res)=>{

try{

const{

user,

product,

quantity

}=req.body;

const exists=await Cart.findOne({

user,

product

});

if(exists){

exists.quantity+=quantity||1;

await exists.save();

return res.json(exists);

}

const cart=await Cart.create({

user,

product,

quantity

});

res.status(201).json(cart);

}

catch(error){

res.status(500).json({

message:error.message

});

}

};

module.exports={

getCart,

addCart

};