const express = require("express");

const consumerDiscountController = require("../controllers/consumerDiscountController");

const router = express.Router();

router
  .route("/consumer-discount")
  .get(consumerDiscountController.getConsumerDiscount)
  .post(consumerDiscountController.addConsumerDiscount)
  .put(consumerDiscountController.updateConsumerDiscount);
router
  .route("/consumer-discounts")
  .get(consumerDiscountController.getAllConsumerDiscounts);
router
  .route("/consumer-discounts/merchant")
  .get(consumerDiscountController.getConsumerDiscountsByMerchant);
router
  .route(
    "/consumer-discounts/merchant/:merchantId/consumer/:consumerId/discount/:discountId"
  )
  .get(
    consumerDiscountController.getConsumerDiscountsByMerchantConsumerDiscount
  );

module.exports = router;
