const Product = require("../models/Product");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Total counts
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();

    // 2. Total stock valuation using aggregation
    const valuationResult = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValuation: { $sum: { $multiply: ["$price", "$quantity"] } },
          totalItems: { $sum: "$quantity" },
        },
      },
    ]);

    const totalValuation =
      valuationResult.length > 0 ? valuationResult[0].totalValuation : 0;
    const totalItems =
      valuationResult.length > 0 ? valuationResult[0].totalItems : 0;

    // 3. Low stock alerts (where quantity <= threshold)
    const lowStockAlerts = await Product.find({
      $expr: { $lte: ["$quantity", "$threshold"] },
    })
      .populate("category", "name")
      .limit(10); // limit to top 10 for widget

    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ["$quantity", "$threshold"] },
    });

    // 4. Recent transactions
    const recentTransactions = await Transaction.find()
      .populate("product", "name sku")
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Category-wise product distribution (for frontend charts)
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $project: {
          _id: 1,
          name: "$categoryInfo.name",
          count: 1,
          totalValue: 1,
        },
      },
    ]);

    res.json({
      summary: {
        totalProducts,
        totalCategories,
        totalItems,
        totalValuation,
        lowStockCount,
      },
      lowStockAlerts,
      recentTransactions,
      categoryDistribution,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
