const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    qty: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", InventorySchema);
