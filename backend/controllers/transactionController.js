const Transaction = require("../models/Transaction");
const Product = require("../models/Product");

// @desc    Stock In a product
// @route   POST /api/transactions/stock-in
// @access  Private
const stockIn = async (req, res, next) => {
  try {
    const { productId, quantity, reason } = req.body;

    if (!productId || !quantity) {
      res.status(400);
      throw new Error("Product ID and quantity are required");
    }

    const qtyNum = parseInt(quantity, 10);
    if (qtyNum <= 0) {
      res.status(400);
      throw new Error("Quantity must be greater than zero");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Verify ownership
    if (product.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to access this product");
    }

    // Increment product stock
    product.quantity += qtyNum;
    await product.save();

    // Create transaction record
    const transaction = await Transaction.create({
      product: productId,
      type: "IN",
      quantity: qtyNum,
      user: req.user._id,
      createdBy: req.user._id,
      reason: reason || "Restock",
    });

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("product", "name sku price")
      .populate("user", "name");

    res.status(201).json({
      message: "Stock added successfully",
      product,
      transaction: populatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stock Out a product
// @route   POST /api/transactions/stock-out
// @access  Private
const stockOut = async (req, res, next) => {
  try {
    const { productId, quantity, reason } = req.body;

    if (!productId || !quantity) {
      res.status(400);
      throw new Error("Product ID and quantity are required");
    }

    const qtyNum = parseInt(quantity, 10);
    if (qtyNum <= 0) {
      res.status(400);
      throw new Error("Quantity must be greater than zero");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Verify ownership
    if (product.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to access this product");
    }

    // Check stock availability
    if (product.quantity < qtyNum) {
      res.status(400);
      throw new Error(
        `Insufficient stock. Available: ${product.quantity}, Requested: ${qtyNum}`
      );
    }

    // Decrement product stock
    product.quantity -= qtyNum;
    await product.save();

    // Create transaction record
    const transaction = await Transaction.create({
      product: productId,
      type: "OUT",
      quantity: qtyNum,
      user: req.user._id,
      createdBy: req.user._id,
      reason: reason || "Dispatch",
    });

    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate("product", "name sku price")
      .populate("user", "name");

    res.status(201).json({
      message: "Stock dispatched successfully",
      product,
      transaction: populatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all stock transactions history
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ createdBy: req.user._id })
      .populate("product", "name sku price")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  stockIn,
  stockOut,
  getTransactions,
};
