const Menu = require("../models/Menu");

const getAllMenu = async (req, res) => {
  try {
    const merchant = req.merchantId;

    if (!merchant) {
      return res.status(400).json({ error: "Merchant not found" });
    }

    const allMenuItems = await Menu.find({ merchant });

    res.status(200).json({ data: allMenuItems });
  } catch (error) {
    console.error("Error getting all menu items:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const addMenuItem = async (req, res) => {
  try {
    const {
      imageUrl,
      name,
      originalPrice,
      description,
      cuisineType,
      isFeatured,
    } = req.body;

    const merchant = req.merchantId;

    if (!merchant) {
      return res.status(400).json({ error: "Merchant not found" });
    }

    if (!name || !originalPrice) {
      return res
        .status(400)
        .json({ message: "Bad Request: Missing required fields." });
    }

    const savedMenuItem = await Menu.create({
      imageUrl,
      name,
      originalPrice,
      description,
      merchant,
      cuisineType,
      isFeatured,
    });

    res.status(201).json({ data: savedMenuItem });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const merchant = req.merchantId;

    const deletedMenuItem = await Menu.findOneAndDelete({
      _id: id,
      merchant,
    });

    if (!merchant) {
      return res.status(400).json({ error: "Merchant not found" });
    }

    if (!deletedMenuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = {
  getAllMenu,
  addMenuItem,
  deleteMenuItem,
};
