const mongoose = require("mongoose");

const Transaction = require("../models/Transaction");
const Payment = require("../models/Payment");

const getAllTransactions = async (req, res) => {
  try {
    const { consumerDiscountId } = req.body;

    if (!consumerDiscountId) {
      return res
        .status(400)
        .json({ message: "consumerDiscountId is required" });
    }

    // Find all transactions for the consumer discount and populate payment and consumerDiscount fields
    const transactions = await Transaction.find({
      consumerDiscount: consumerDiscountId,
    })
      .populate({
        path: "payment",
      })
      .populate({
        path: "consumerDiscount",
        populate: { path: "discount" },
      })
      .lean();

    if (!transactions?.length) {
      return res.status(400).json({ message: "No transactions found" });
    }

    // Return the transactions
    res.status(200).json(transactions);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addTransaction = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, status, consumerDiscountId } = req.body;

    if (
      !amount ||
      !status ||
      !["approved", "canceled"].includes(status) ||
      !consumerDiscountId
    ) {
      return res.status(400).json({
        message: "amount, status, and consumerDiscountId are required",
      });
    }

    const newPayment = await Payment.create(
      [
        {
          amount,
          date: new Date(),
          status,
        },
      ],
      { session }
    );

    const newTransaction = await Transaction.create(
      [
        {
          payment: newPayment[0].id,
          consumerDiscount: consumerDiscountId,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Transaction added successfully",
      newPayment,
      newTransaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllTransactions,
  addTransaction,
};
