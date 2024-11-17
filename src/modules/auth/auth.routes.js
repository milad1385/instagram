const express = require("express");
const controller = require("./auth.controller");
const router = express.Router();

router
  .route("/register")
  .post(controller.register)
  .get(controller.getAndShowRegister);

router.route("/login").post(controller.login).get(controller.getAndShowLogin);

router.route("/logout").post(controller.logout);

module.exports = router;
