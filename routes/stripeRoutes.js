const express = require("express");

const stripeController = require("../controllers/stripeController");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

router.use(verifyJWT);

router
  .route("/stripe-customer")
  .post(stripeController.createCustomer)
  .get(stripeController.getCustomer);
router.route("/stripe-card").post(stripeController.addNewCardToCustomer);
router
  .route("/stripe-saved-cards")
  .get(stripeController.getCustomerPaymentMethods);
router.route("/stripe-charge-card").post(stripeController.chargeCard);

module.exports = router;
