const Category = require("../models/Category");
const Product = require("../models/Product");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ createdBy: req.user._id }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Category name is required");
    }

    // Check if category name exists for this user
    const categoryExists = await Category.findOne({ name: name.trim(), createdBy: req.user._id });
    if (categoryExists) {
      res.status(400);
      throw new Error("Category already exists");
    }

    const category = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : "",
      createdBy: req.user._id,
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    // Verify ownership
    if (category.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to access this category");
    }

    if (name) {
      const categoryExists = await Category.findOne({
        name: name.trim(),
        createdBy: req.user._id,
        _id: { $ne: categoryId },
      });
      if (categoryExists) {
        res.status(400);
        throw new Error("Category name already exists");
      }
      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    // Verify ownership
    if (category.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to access this category");
    }

    // Safety check: check if any products belong to this category under this user
    const productsCount = await Product.countDocuments({ category: categoryId, createdBy: req.user._id });
    if (productsCount > 0) {
      res.status(400);
      throw new Error(
        `Cannot delete category. There are ${productsCount} product(s) linked to this category.`
      );
    }

    await Category.findByIdAndDelete(categoryId);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
