const stripe = require("stripe")(process.env.STRIPE_SECRET);
const { extractedInfo } = require("../helpers/stripe");
const StripeCustomer = require("../models/StripeCustomer");

const errorHandler = async (err) => {
  switch (err.type) {
    case "StripeCardError":
      // A declined card error
      // eslint-disable-next-line no-unused-expressions
      err.message; // => e.g. "Your card's expiration year is invalid."
      break;
    case "StripeRateLimitError":
      // Too many requests made to the API too quickly
      break;
    case "StripeInvalidRequestError":
      // Invalid parameters were supplied to Stripe's API
      break;
    case "StripeAPIError":
      // An error occurred internally with Stripe's API
      break;
    case "StripeConnectionError":
      // Some kind of error occurred during the HTTPS communication
      break;
    case "StripeAuthenticationError":
      // You probably used an incorrect API key
      break;
    default:
      // Handle any other types of unexpected errors
      break;
  }
};

const createCustomer = async (req, res) => {
  try {
    const { address } = req.body;
    // Create a customer
    const customer = await stripe.customers.create({
      email: req.user,
      address: {
        line1: address,
      },
    });

    const stripeCustomer = await StripeCustomer.create({
      customerId: customer.id,
      user: req.id,
    });

    res.status(201).json({ stripeCustomer });
    res.status(200).json();
  } catch (error) {
    errorHandler(error);
    res.status(400).json({ message: error.message });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await StripeCustomer.findOne({
      user: req.id,
    });

    if (customer) res.status(200).res.json({ customerId: customer.customerId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// add a new card to the customer
const addNewCardToCustomer = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    // Find the StripeCustomer using the user ID
    const customer = await StripeCustomer.findOne({
      user: req.id,
    });
    if (customer) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.customerId,
      });

      return res.status(200).json({ message: "Card added successfully" });
    } else {
      return res.status(400).json({ message: "Customer not found" });
    }
  } catch (err) {
    errorHandler(err);

    // Handle specific error cases if needed
    const response = {
      message: err.message,
      data: err.decline_code,
    };

    return res.status(500).json(response);
  }
};

// Get list of all saved card of the customer
const getCustomerPaymentMethods = async (req, res) => {
  try {
    // Find the StripeCustomer using the user ID
    const customer = await StripeCustomer.findOne({
      user: req.id,
    });

    if (customer) {
      const savedCards = await stripe.customers.listPaymentMethods(
        customer.customerId,
        { limit: 3 }
      );

      const cardDetails = (await savedCards).data;
      const data = extractedInfo(cardDetails);

      return res.status(200).json(data);
    }
  } catch (error) {
    errorHandler(error);
    return res.status(500).json(error);
  }
};

const chargeCard = async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;
    // Find the StripeCustomer using the user ID
    const customer = await StripeCustomer.findOne({
      user: req.id,
    });
    const receipt = await stripe.customers.retrieve(customer.customerId);

    if (amount > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "cad",
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
        payment_method: paymentMethodId,
        customer: customer.customerId,
        description: `Stripe charge of amount $${Number(amount)} for payment`,
        confirm: true,
        receipt_email: receipt.email ? receipt.email : req.user,
      });
      return res
        .status(200)
        .json({ receipt: "Payment Successful!", paymentIntent });
    }
  } catch (error) {
    errorHandler(error);
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  createCustomer,
  addNewCardToCustomer,
  getCustomerPaymentMethods,
  chargeCard,
  getCustomer,
};
