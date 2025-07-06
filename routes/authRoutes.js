const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

router.route("/register").post(authController.register);
router.route("/change-password").put(authController.changePassword);
router.route("/login").post(authController.login);
router.route("/refresh").post(authController.refresh);
router.route("/logout").post(authController.logout);
router.route("/merchant").post(authController.addMerchant);
router.route("/consumer").post(authController.addConsumer);

module.exports = router;
