const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const printUploadRoutes = require("./routes/printUploadRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const printOrdersRoute = require("./routes/printOrdersRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/print-upload", printUploadRoutes);
app.use("/api/print-orders", printOrdersRoute);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Snackible Backend Running...");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use("/uploads", express.static("uploads"));
