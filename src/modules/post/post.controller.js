const PostModel = require("../../models/Post");
const LikeModel = require("../../models/like");
const isAllowToSeePage = require("../../utils/isAllowToSeePage");
const { createNewPostSchema } = require("./post.validator");

exports.getPostView = async (req, res, next) => {
  try {
    return res.render("post/create");
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { description, hashtags } = req.body;

    await createNewPostSchema.validate({ description }, { abortEarly: false });

    if (!req.file) {
      req.flash("error", "Please upload image");
      return res.redirect("/post");
    }

    const tags = hashtags.split(",");

    const post = await PostModel.create({
      description,
      media: {
        filename: req.file.filename,
        path: `images/post/${req.file.filename}`,
      },
      hashtags: tags,
      user: req.user._id,
    });

    req.flash("success", "Post created successfully :)");

    return res.redirect("/post");
  } catch (error) {
    next(error);
  }
};

exports.like = async (req, res, next) => {
  try {
    const user = req.user;
    const { postId } = req.params;

    const post = await PostModel.findOne({ _id: postId });

    if (!post) {
      req.flash("error", "Post is not found");
      return res.redirect("back");
    }

    const isLikeExist = await LikeModel.findOne({
      user: user._id,
      post: postId,
    });

    if (isLikeExist) {
      req.flash("error", "You like this post already :(");
      return res.redirect("back");
    }

    const hasAccess = await isAllowToSeePage(user._id, postId);

    if (!hasAccess) {
      req.flash("You cant like private page post");
      return res.redirect("back");
    }

    await LikeModel.create({
      post: postId,
      user: user._id,
    });

    res.redirect("back");
  } catch (error) {
    next(error);
  }
};
