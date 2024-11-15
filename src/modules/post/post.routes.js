const express = require("express");
const controller = require("../../modules/post/post.controller");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { multerStorage } = require("./../../middlewares/multer");
const isVerifyAccount = require("../../middlewares/VerifyAccount");

const multer = multerStorage("public/images/post");

router
  .route("/")
  .post(auth, multer.single("media"), controller.create)
  .get(auth, isVerifyAccount, controller.getPostView);

router.route("/:postId/like").post(auth, controller.like);
router.route("/:postId/dislike").post(auth, controller.dislike);
router.route("/:postId/save").post(auth, controller.saveAndUnSave);



module.exports = router;
