const express = require("express");
const controller = require("../../modules/post/post.controller");
const router = express.Router();

router.route("/").post(controller.create).get(controller.getPostView);

module.exports = router;
