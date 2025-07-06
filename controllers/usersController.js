const { s3UploadV3 } = require("../helpers/s3");
const Consumer = require("../models/Consumer");
const Merchant = require("../models/Merchant");

const getAllConsumers = async (req, res) => {
  try {
    const consumers = await Consumer.find()
      .populate({
        path: "user",
        select: "-password",
      })
      .lean();

    if (!consumers?.length) {
      return res.status(400).json({ message: "No consumers found" });
    }

    res.status(200).json(consumers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMerchants = async (req, res) => {
  try {
    const { keyword } = req.query;

    const merchants = await Merchant.find(
      keyword && {
        name: { $regex: keyword, $options: "i" },
      }
    )
      .populate({
        path: "user",
        select: "-password",
      })
      .lean();

    res.status(200).json(merchants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMerchant = async (req, res) => {
  try {
    const { merchantId } = req.query;

    const merchant = await Merchant.findOne({ _id: merchantId })
      .populate({
        path: "user",
        select: "-password",
      })
      .lean();

    res.status(200).json(merchant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// sample uplaod controller
const uploadFile = async (req, res) => {
  try {
    const results = await s3UploadV3(req.files);
    res.json({ status: "success", results });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

module.exports = {
  getAllConsumers,
  getAllMerchants,
  getMerchant,
  uploadFile,
};
