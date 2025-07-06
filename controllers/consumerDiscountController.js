const { generateQrCode } = require("../helpers/qrCode");
const Merchant = require("../helpers/qrCode");
const ConsumerDiscount = require("../models/ConsumerDiscount");
const Discount = require("../models/Discount");

const getAllConsumerDiscounts = async (req, res) => {
  try {
    const consumerId = req.consumerId;

    if (!consumerId) {
      return res
        .status(404)
        .json({ message: "Consumer not found. Please log in" });
    }

    // Find all consumer discounts for the consumer and populate consumer and discount fields
    const consumerDiscounts = await ConsumerDiscount.find({
      consumer: consumerId,
    })
      .populate({
        path: "consumer",
        populate: { path: "user", select: "-password" },
      })
      .populate({
        path: "discount",
        populate: {
          path: "merchant",
          populate: { path: "user", select: "-password" },
        },
      })
      .lean();

    if (!consumerDiscounts?.length) {
      return res.status(400).json({ message: "No consumer discounts found" });
    }

    // Return the consumer discounts
    res.status(200).json(consumerDiscounts);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addConsumerDiscount = async (req, res) => {
  try {
    const consumerId = req.consumerId;

    if (!consumerId) {
      return res
        .status(404)
        .json({ message: "Consumer not found. Please log in" });
    }

    const { merchantId, discountId } = req.body;

    if (!merchantId || !discountId) {
      return res
        .status(400)
        .json({ message: "merchantId and discountId are required" });
    }

    const merchant = await Merchant.findOne({ _id: merchantId }).exec();

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    const discount = await Discount.findOne({ _id: discountId }).exec();

    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }

    const qrCode = await generateQrCode({
      merchant: merchantId,
      consumer: consumerId,
      discount: discountId,
    });

    const qrIdentifications = await ConsumerDiscount.find().lean();

    let qrIdentification;
    while (true) {
      qrIdentification = "";

      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < 6; i++) {
        const index = Math.floor(Math.random() * characters.length);
        qrIdentification += characters[index];
      }

      if (
        !qrIdentifications
          .map((qrIdentificationItem) => qrIdentificationItem.qrIdentification)
          .includes(qrIdentification)
      ) {
        break;
      }
    }

    const newConsumerDiscount = await ConsumerDiscount.create({
      merchant: merchantId,
      consumer: consumerId,
      discount: discountId,
      qrCode,
      qrIdentification,
      status: "upcoming",
    });

    res.status(201).json(newConsumerDiscount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateConsumerDiscount = async (req, res) => {
  try {
    const { consumerDiscount } = req.body;

    if (
      !consumerDiscount ||
      !["upcoming", "redeemed", "cancelled"].includes(consumerDiscount.status)
    ) {
      return res.status(400).json({
        message: "consumerDiscountId and status are required",
      });
    }

    const updatedConsumerDiscount = await ConsumerDiscount.findByIdAndUpdate(
      consumerDiscount._id,
      {
        $set: {
          ...consumerDiscount,
        },
      }
    ).exec();

    if (updatedConsumerDiscount) {
      res.status(200).json(updatedConsumerDiscount);
    } else {
      res.status(400).json({
        message: "Consumer discount has not been updated",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getConsumerDiscount = async (req, res) => {
  try {
    const { consumerDiscountId } = req.query;

    if (!consumerDiscountId) {
      return res.status(400).json({
        message: "consumerDiscountId is required",
      });
    }

    const consumerDiscount = await ConsumerDiscount.findOne({
      _id: consumerDiscountId,
    })
      .populate({
        path: "merchant",
        populate: { path: "user", select: "-password" },
      })
      .populate({
        path: "consumer",
        populate: { path: "user", select: "-password" },
      })
      .populate({
        path: "discount",
      })
      .lean();

    res.status(200).json(consumerDiscount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getConsumerDiscountsByMerchant = async (req, res) => {
  try {
    const { merchantId } = req.query;

    if (!merchantId) {
      return res.status(400).json({ message: "merchantId is required" });
    }

    const consumerDiscounts = await ConsumerDiscount.find({
      merchant: merchantId,
    })
      .populate({
        path: "merchant",
        populate: { path: "user", select: "-password" },
      })
      .populate({
        path: "consumer",
        populate: { path: "user", select: "-password" },
      })
      .populate({
        path: "discount",
      })
      .lean();

    res.status(200).json(consumerDiscounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getConsumerDiscountsByMerchantConsumerDiscount = async (req, res) => {
  try {
    const { merchantId } = req.params;
    const { consumerId } = req.params;
    const { discountId } = req.params;

    if (!merchantId || !consumerId || !discountId) {
      return res.status(400).json({
        message: "merchantId, customerId & idiscountId is required",
      });
    }

    const consumerDiscounts = await ConsumerDiscount.findOne({
      merchant: merchantId,
      consumer: consumerId,
      discount: discountId,
    })
      .populate({
        path: "merchant",
        populate: { path: "user", select: "-password" },
      })
      .populate({
        path: "consumer",
        populate: { path: "user", select: "-password" },
      })
      .populate({
        path: "discount",
      })
      .lean();

    res.status(200).json(consumerDiscounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllConsumerDiscounts,
  getConsumerDiscount,
  addConsumerDiscount,
  updateConsumerDiscount,
  getConsumerDiscountsByMerchant,
  getConsumerDiscountsByMerchantConsumerDiscount,
};
