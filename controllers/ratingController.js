const Rating = require("../models/Rating");

const getRatingsByMerchant = async (req, res) => {
  try {
    const { merchantId } = req.query;

    if (!merchantId) {
      return res.status(400).json({ message: "merchantId is required" });
    }

    const ratings = await Rating.find({ merchant: merchantId })
      .populate({
        path: "merchant",
        populate: { path: "user", select: "-password" },
      })
      .populate({
        path: "consumer",
        populate: { path: "user", select: "-password" },
      })
      .lean();

    res.status(200).json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addRating = async (req, res) => {
  try {
    const { rating, comment, merchantId } = req.body;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }
    const newRating = await Rating.create({
      rating,
      comment,
      consumer: req.consumerId,
      merchant: merchantId,
    });

    res.status(201).json({
      message: "Rating added successfully",
      newRating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getRatingsByMerchant,
  addRating,
};
