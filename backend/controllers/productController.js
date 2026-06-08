const Product = require("../models/Product");
const Category = require("../models/Category");

// @desc    Get all products (with search, category filter, sorting, pagination)
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res, next) => {
  try {
    const { search, category, stockStatus, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    // 1. Search Filter (matches name or SKU)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    // 2. Category Filter
    if (category) {
      query.category = category;
    }

    // 3. Stock Status Filter (e.g. low stock alert status)
    if (stockStatus === "low") {
      // Find products where quantity <= threshold
      query.$expr = { $lte: ["$quantity", "$threshold"] };
    }

    // Convert pagination params to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // 4. Sorting
    let sortOptions = { createdAt: -1 }; // default: newest first
    if (sort) {
      if (sort === "name_asc") sortOptions = { name: 1 };
      else if (sort === "name_desc") sortOptions = { name: -1 };
      else if (sort === "price_asc") sortOptions = { price: 1 };
      else if (sort === "price_desc") sortOptions = { price: -1 };
      else if (sort === "qty_asc") sortOptions = { quantity: 1 };
      else if (sort === "qty_desc") sortOptions = { quantity: -1 };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single product details
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    const { name, sku, description, category, price, quantity, threshold } = req.body;

    if (!name || !category || price === undefined) {
      res.status(400);
      throw new Error("Please fill in all required fields (name, category, price)");
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(400);
      throw new Error("Invalid category specified");
    }

    // Check if user specified SKU and it already exists
    if (sku) {
      const skuExists = await Product.findOne({ sku: sku.trim().toUpperCase() });
      if (skuExists) {
        res.status(400);
        throw new Error("Product with this SKU already exists");
      }
    }

    const product = await Product.create({
      name: name.trim(),
      sku: sku ? sku.trim().toUpperCase() : undefined,
      description: description ? description.trim() : "",
      category,
      price: Number(price),
      quantity: quantity !== undefined ? Number(quantity) : 0,
      threshold: threshold !== undefined ? Number(threshold) : 10,
    });

    const populatedProduct = await Product.findById(product._id).populate("category", "name");
    res.status(201).json(populatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
  try {
    const { name, sku, description, category, price, quantity, threshold } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // If changing category, verify category exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        res.status(400);
        throw new Error("Invalid category specified");
      }
      product.category = category;
    }

    // If updating SKU, check uniqueness
    if (sku) {
      const skuExists = await Product.findOne({
        sku: sku.trim().toUpperCase(),
        _id: { $ne: productId },
      });
      if (skuExists) {
        res.status(400);
        throw new Error("Product with this SKU already exists");
      }
      product.sku = sku.trim().toUpperCase();
    }

    if (name) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (quantity !== undefined) product.quantity = Number(quantity);
    if (threshold !== undefined) product.threshold = Number(threshold);

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id).populate("category", "name");
    res.json(populatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
