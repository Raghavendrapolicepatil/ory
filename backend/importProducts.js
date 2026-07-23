const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Product = require("./models/product");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const importProducts = async () => {
    try {

        const data = JSON.parse(
            fs.readFileSync("../frontend/assets/data/products.json", "utf-8")
        );

        await Product.deleteMany();

        const productsWithId = data.map((product, index) => ({
  id: index + 1,
  ...product
}));

await Product.deleteMany();
await Product.insertMany(productsWithId);

        console.log("✅ Products Imported Successfully");

        process.exit();

    } catch (error) {

        console.log(error);

        process.exit(1);

    }
};

importProducts();