const express = require("express");
const controller = require("./page.controller");
const router = express.Router();

router.route("/").get(controller.showPageView);

module.exports = router;
