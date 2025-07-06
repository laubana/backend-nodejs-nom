const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    template: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    primary: {
      type: String,
      required: true,
    },
    accent: {
      type: String,
      required: true,
    },
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ad", AdSchema);
