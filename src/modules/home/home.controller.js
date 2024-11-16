const PostModel = require("../../models/Post");
const LikeModel = require("../../models/like");
const SaveModel = require("../../models/Save");
exports.showHomePage = async (req, res, next) => {
  try {
    const user = req.user;

    
    const posts = await PostModel.find({})
      .populate("user", "name username")
      .sort({ _id: -1 });

    const likes = await LikeModel.find({ user: req.user._id }).populate(
      "post",
      "_id"
    );

    const saves = await SaveModel.find({ user: req.user._id }).populate(
      "post",
      "_id"
    );

    posts.forEach((post) => {
      likes.forEach((like) => {
        if (post._id.toString() === like.post._id.toString()) {
          post.hasLike = true;
        }
      });
    });

    posts.forEach((post) => {
      saves.forEach((save) => {
        if (post._id.toString() === save.post._id.toString()) {
          post.isSave = true;
        }
      });
    });

    return res.render("index", { user, posts });
  } catch (error) {
    next(error);
  }
};
