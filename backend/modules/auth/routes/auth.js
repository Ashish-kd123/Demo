const express = require("express");
const authController = require("../controller/auth");
const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");

const router = express.Router();


router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;