const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    consumerDiscount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConsumerDiscount",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
