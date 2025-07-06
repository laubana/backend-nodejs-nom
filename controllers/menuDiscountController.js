const MenuDiscount = require("../models/MenuDiscount");

// after submitting the coupon created by merchant the discount id will be passed here including the menus selected where coupon was linked
const addMenuDiscount = async (req, res) => {
  try {
    const { discountId, menuIds } = req.body;

    if (!discountId || !menuIds || !Array.isArray(menuIds)) {
      return res
        .status(400)
        .json({ error: "Discoint id and menu id required" });
    }

    const menuDiscounts = menuIds.map((menuId) => ({
      discountId,
      menuId,
    }));

    const newMenuDiscount = await MenuDiscount.create(menuDiscounts);

    res.status(200).json({
      message: "Menu discount successfully created.",
      newMenuDiscount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getAllMenuDiscount = async (req, res) => {
  try {
    const merchantId = req.merchantId;

    if (!merchantId) {
      return res.status(400).json({ error: "Merchant not found" });
    }

    const menuDiscounts = await MenuDiscount.find()
      // wiil remove comment once we have the Menu table
      // .populate({
      //     path: "menuId",
      //     select: "name price",
      // })
      .populate({
        path: "discountId",
        select: "label percentDiscount",
      })
      .lean();

    res.status(200).json(menuDiscounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getMenuDiscountsByMerchant = async (req, res) => {
  try {
    const { merchantId } = req.query;

    if (!merchantId) {
      return res.status(400).json({ message: "merchantId is required" });
    }

    const menuDiscounts = await MenuDiscount.find({ merchant: merchantId })
      .populate({
        path: "menu",
      })
      .populate({
        path: "discount",
      })
      .populate({
        path: "merchant",
      })
      .lean();

    res.status(200).json(menuDiscounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMenuDiscountsByMerchantAndDiscount = async (req, res) => {
  try {
    const { merchantId, discountId } = req.params;

    if (!merchantId && !discountId) {
      return res
        .status(400)
        .json({ message: "merchantId & discountId is required" });
    }

    const menuDiscounts = await MenuDiscount.find({
      merchant: merchantId,
      discount: discountId,
    })
      .populate({
        path: "menu",
      })
      .populate({
        path: "discount",
      })
      .populate({
        path: "merchant",
      })
      .lean();

    res.status(200).json(menuDiscounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMenuDiscountsByDiscount = async (req, res) => {
  try {
    const { discountId } = req.query;

    if (!discountId) {
      return res.status(400).json({ message: "discountId is required" });
    }

    const menuDiscounts = await MenuDiscount.find({ discount: discountId })
      .populate({
        path: "menu",
      })
      .populate({
        path: "discount",
      })
      .populate({
        path: "merchant",
      })
      .lean();

    res.status(200).json(menuDiscounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addMenuDiscount,
  getAllMenuDiscount,
  getMenuDiscountsByMerchant,
  getMenuDiscountsByMerchantAndDiscount,
  getMenuDiscountsByDiscount,
};
