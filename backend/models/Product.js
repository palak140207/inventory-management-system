const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    threshold: {
      type: Number,
      default: 10,
      min: [0, "Threshold cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate SKU before validation if not provided
productSchema.pre("validate", function () {
  if (!this.sku) {
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.sku = `SKU-${randomSuffix}`;
  }
});

module.exports = mongoose.model("Product", productSchema);
