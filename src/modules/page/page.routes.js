const express = require("express");
const controller = require("./page.controller");
const auth = require("../../middlewares/auth");
const { multerStorage } = require("../../middlewares/multer");
const router = express.Router();

const multer = multerStorage("public/images/profile");

router.route("/:pageId").get(auth, controller.showPageView);
router.route("/:pageId/follow").post(auth, controller.follow);
router.route("/:pageId/unfollow").post(auth, controller.unfollow);

router
  .route("/profile/edit")
  .get(auth, controller.showUpdatePage)
  .post(auth, multer.single("profile"), controller.updateProfile);

module.exports = router;
