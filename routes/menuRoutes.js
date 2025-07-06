const express = require("express");

const menuController = require("../controllers/menuController");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

router.use(verifyJWT);

router
  .route("/menu")
  .get(menuController.getAllMenu)
  .post(menuController.addMenuItem);
router.route("/menu/:id").delete(menuController.deleteMenuItem);

module.exports = router;
