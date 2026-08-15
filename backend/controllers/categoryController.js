const Category = require("../models/category");
const Product = require("../models/product");
// ======================================
// Get All Categories
// ======================================

const getCategories = async (req, res) => {

    try {

        const categories = await Category.find().sort({ sortOrder: 1 });

        res.json(categories);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================
// Add Category
// ======================================

const addCategory = async (req, res) => {

    try {

        const category = await Category.create(req.body);

        res.status(201).json({

            message: "Category Added Successfully",

            category

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================
// Update Category
// ======================================

const updateCategory = async (req, res) => {

    try {

        // Pehle old category find karo
        const oldCategory = await Category.findById(req.params.id);

        if (!oldCategory) {

            return res.status(404).json({
                message: "Category not found"
            });

        }

        const oldName = oldCategory.name;

        const newName = req.body.name;

        // Category update
        const category = await Category.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        // ======================================
        // Update Products Category Name
        // ======================================

        if (newName && oldName !== newName) {

            await Product.updateMany(

                { category: oldName },

                {
                    $set: {
                        category: newName
                    }
                }

            );

        }

        res.json({

            message: "Category Updated Successfully",

            category

        });

    } catch (error) {

        console.error("Category Update Error:", error);

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================
// Delete Category
// ======================================

const deleteCategory = async (req, res) => {

    try {

        await Category.findByIdAndDelete(req.params.id);

        res.json({

            message: "Category Deleted Successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    getCategories,

    addCategory,

    updateCategory,

    deleteCategory

};