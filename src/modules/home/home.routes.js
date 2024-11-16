const express = require("express");
const controller = require("./home.controller");
const auth = require("./../../middlewares/auth");
const router = express.Router();

router.route("/").get(auth, controller.showHomePage);

module.exports = router;
