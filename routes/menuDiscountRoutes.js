const express = require("express");

const menuDiscountController = require("../controllers/menuDiscountController");

const router = express.Router();

router
  .route("/menu-discount")
  .post(menuDiscountController.addMenuDiscount)
  .get(menuDiscountController.getAllMenuDiscount);
router
  .route("/menu-discounts/merchant/:merchantId/discount/:discountId")
  .get(menuDiscountController.getMenuDiscountsByMerchantAndDiscount);
router
  .route("/menu-discounts/merchant")
  .get(menuDiscountController.getMenuDiscountsByMerchant);
router
  .route("/menu-discounts/discount")
  .get(menuDiscountController.getMenuDiscountsByDiscount);

module.exports = router;
