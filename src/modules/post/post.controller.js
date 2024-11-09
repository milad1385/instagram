const PostModel = require("../../models/Post");
const { createNewPostSchema } = require("./post.validator");

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

exports.getPostView = async (req, res, next) => {
  try {
    return res.render("post/create");
  } catch (error) {
    next(error);
  }
};
