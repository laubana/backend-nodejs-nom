const mongoose = require("mongoose");

const ConsumerDiscountSchema = new mongoose.Schema(
  {
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumer",
      required: true,
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
    },
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
      required: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
    qrIdentification: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["upcoming", "redeemed", "cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ConsumerDiscount", ConsumerDiscountSchema);
