const Address = require("../models/address");

// Get All Addresses

const getAddresses = async (req,res)=>{

    try{

        const addresses = await Address.find();

        res.json(addresses);

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

// Add Address

const addAddress = async (req,res)=>{

    try{

        const address = await Address.create(req.body);

        res.status(201).json(address);

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

module.exports = {

    getAddresses,

    addAddress

};