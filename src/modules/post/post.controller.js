const { isValidObjectId } = require("mongoose");
const PostModel = require("../../models/Post");
const LikeModel = require("../../models/like");
const SaveModel = require("../../models/Save");
const isAllowToSeePage = require("../../utils/isAllowToSeePage");
const { createNewPostSchema } = require("./post.validator");
const deletePic = require("../../utils/deletePic");

exports.getPostView = async (req, res, next) => {
  try {
    return res.render("post/create");
  } catch (error) {
    next(error);
  }
};

exports.getSaveView = async (req, res, next) => {
  try {
    const saves = await SaveModel.find({ user: req.user._id })
      .populate({
        path: "post",
        populate: {
          path: "user",
        },
      })
      .sort({ _id: -1 });

    const likes = await LikeModel.find({ user: req.user._id }).populate(
      "post",
      "_id"
    );

    saves.forEach((save) => {
      likes.forEach((like) => {
        if (save.post._id.toString() === like.post._id.toString()) {
          save.post.hasLike = true;
        }
      });
    });

    return res.render("post/saves", {
      saves,
    });
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

    if (!isValidObjectId(postId)) {
      req.flash("error", "Post id is not valid :(");
      return res.redirect("back");
    }

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

    const hasAccess = await isAllowToSeePage(user._id, post.user);

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

exports.dislike = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!isValidObjectId(postId)) {
      req.flash("error", "Post id is not valid :(");
      return res.redirect("back");
    }

    const user = req.user;

    const post = await PostModel.findOne({ _id: postId });

    if (!post) {
      req.flash("error", "post is not found :(");
      return res.redirect("back");
    }

    await LikeModel.findOneAndDelete({ post: postId, user: user._id });

    return res.redirect("back");
  } catch (error) {
    next(error);
  }
};

exports.saveAndUnSave = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const user = req.user;

    if (!isValidObjectId(postId)) {
      req.flash("error", "Post id is not valid :(");
      return res.redirect("back");
    }

    const post = await PostModel.findOne({ _id: postId });

    if (!post) {
      req.flash("error", "Post is not found :(");

      return res.redirect("back");
    }

    const existSaving = await SaveModel.findOne({
      post: postId,
      user: user._id,
    });

    if (existSaving) {
      await SaveModel.findOneAndDelete({ user: user._id, post: postId });
      return res.redirect("back");
    }

    const hasAccess = await isAllowToSeePage(user._id, post.user);

    if (!hasAccess) {
      req.flash("error", "You cant save private page post");
      return res.redirect("back");
    }

    await SaveModel.create({
      post: postId,
      user: user._id,
    });

    return res.redirect("back");
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      req.flash("error", "Please send valid id");
      return res.redirect("back");
    }

    const post = await PostModel.findOne({ _id: id });

    if (!post) {
      req.flash("error", "post is not found :(");
      return res.redirect("back");
    }

    if (req.user._id.toString() !== post.user.toString()) {
      req.flash("You cant delete another account post");
      return res.redirect("back");
    }

    deletePic(post.media.filename, "post");

    await PostModel.findOneAndDelete({ _id: id });

    await SaveModel.deleteMany({ post: id });
    await LikeModel.deleteMany({ post: id });

    req.flash("success", "Post deleted successfully :)");
    return res.redirect("back");
  } catch (error) {
    next(error);
  }
};
