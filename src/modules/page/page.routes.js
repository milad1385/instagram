const express = require("express");
const controller = require("./page.controller");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.route("/:pageId").get(auth, controller.showPageView);

module.exports = router;
