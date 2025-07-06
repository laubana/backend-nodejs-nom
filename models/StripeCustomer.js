const mongoose = require("mongoose");

const StripeCustomer = new mongoose.Schema(
  {
    customerId: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StripeCustomer", StripeCustomer);
