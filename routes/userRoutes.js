const express = require("express");

const usersController = require("../controllers/usersController");
const uploadMulterToS3 = require("../middlewares/uploadTos3");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

router.use(verifyJWT);

router.route("/consumers").get(usersController.getAllConsumers);
router.route("/merchants").get(usersController.getAllMerchants);
router.route("/merchant").get(usersController.getMerchant);
router
  .route("/upload-multi")
  .post(uploadMulterToS3.array("image"), usersController.uploadFile);

module.exports = router;
