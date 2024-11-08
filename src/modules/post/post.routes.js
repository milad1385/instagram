const express = require("express");
const controller = require("../../modules/post/post.controller");
const router = express.Router();
const auth = require("../../middlewares/auth");

router
  .route("/")
  .post(auth, controller.create)
  .get(auth, controller.getPostView);

module.exports = router;
