const express = require("express");
const controller = require("./auth.controller");
const router = express.Router();

router
  .route("/register")
  .post(controller.register)
  .get(controller.getAndShowRegister);


module.exports = router;
