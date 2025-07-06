const express = require("express");

const ratingController = require("../controllers/ratingController");

const router = express.Router();

router.route("/ratings/merchant").get(ratingController.getRatingsByMerchant);
router.route("/rating").post(ratingController.addRating);

module.exports = router;
