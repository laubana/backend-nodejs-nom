const express = require("express");

const adController = require("../controllers/adController");

const router = express.Router();

router.route("/ads").get(adController.getAds);
router.route("/ad").post(adController.createAds);
router.route("/ad/generate-ad").post(adController.generateAdText);
router
  .route("/ad/price")
  .get(adController.getAdPrices)
  .post(adController.createAdPrices);

module.exports = router;
