const express=require("express");

const router=express.Router();

const{

getCart,

addCart

}=require("../controllers/cartController");

router.get("/",getCart);

router.post("/",addCart);

module.exports=router;