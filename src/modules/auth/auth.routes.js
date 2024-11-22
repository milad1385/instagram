const express = require("express");
const controller = require("./auth.controller");
const router = express.Router();

router
  .route("/register")
  .post(controller.register)
  .get(controller.getAndShowRegister);

router.route("/login").post(controller.login).get(controller.getAndShowLogin);

router.route("/logout").post(controller.logout);

router
  .route("/forget-password")
  .get(controller.showForgetPassword)
  .post(controller.forgetPassword);

router
  .route("/reset-password/:token")
  .get(controller.showResetPassword)
  .post(controller.resetPassword);

module.exports = router;
