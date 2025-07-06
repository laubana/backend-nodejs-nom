const mongoose = require("mongoose");

const AdPrice = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdPrice", AdPrice);
