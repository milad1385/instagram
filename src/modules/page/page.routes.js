const express = require("express");
const controller = require("./page.controller");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.route("/:pageId").get(auth, controller.showPageView);
router.route("/:pageId/follow").post(auth, controller.follow);
router.route("/:pageId/unfollow").post(auth, controller.unfollow);

module.exports = router;
