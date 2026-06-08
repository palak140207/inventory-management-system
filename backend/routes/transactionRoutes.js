const express = require("express");
const router = express.Router();
const {
  stockIn,
  stockOut,
  getTransactions,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

// All transaction routes are protected
router.use(protect);

router.post("/stock-in", stockIn);
router.post("/stock-out", stockOut);
router.get("/", getTransactions);

module.exports = router;
