const express = require("express");

const discountController = require("../controllers/discountController");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

router.use(verifyJWT);

router
  .route("/discount")
  .post(discountController.addDiscount)
  .get(discountController.getAllDiscount);
router.route("/active-discount").get(discountController.getAllActiveDiscount);
router
  .route("/active-discounts/merchant")
  .get(discountController.getActiveDiscountsByMerchant);
router.route("/discount/:id").get(discountController.getDiscount);

module.exports = router;
