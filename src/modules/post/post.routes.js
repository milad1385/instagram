const express = require("express");
const controller = require("../../modules/post/post.controller");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { multerStorage } = require("./../../middlewares/multer");

const multer = multerStorage("public/images/post");

router
  .route("/")
  .post(auth, multer.single("media"), controller.create)
  .get(auth, controller.getPostView);

module.exports = router;
