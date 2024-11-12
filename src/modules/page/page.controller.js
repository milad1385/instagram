const { isValidObjectId } = require("mongoose");
const FollowModel = require("../../models/follow");
const UserModel = require("../../models/User");
const PostModel = require("../../models/Post");
const isAllowToSeePage = require("../../utils/isAllowToSeePage");

exports.showPageView = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const hasAccessToPage = await isAllowToSeePage(req.user._id, pageId);
    const followed = await FollowModel.findOne({
      follower: req.user._id,
      following: pageId,
    });

    let followers = await FollowModel.find({ following: pageId }).populate(
      "follower"
    );

    followers = followers.map((item) => item.follower);

    let followings = await FollowModel.find({ follower: pageId }).populate(
      "following"
    );

    followings = followings.map((item) => item.following);

    const page = await UserModel.findOne(
      { _id: pageId },
      "name username biography isVerified"
    );

    const ownPage = req.user._id.toString() === pageId;

    const posts = await PostModel.find({ user: pageId })
      .populate("user", "username name email")
      .sort({ _id: -1 });

    if (!hasAccessToPage) {
      req.flash("error", "This page is private !!!");
      return res.render("page/profile", {
        followed: Boolean(followed),
        pageId,
        page,
        followers,
        followings,
        hasAccess: hasAccessToPage,
        ownPage,
        posts: [],
      });
    }

    return res.render("page/profile", {
      followed: Boolean(followed),
      pageId,
      page,
      followers,
      followings,
      hasAccess: hasAccessToPage,
      ownPage,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

exports.follow = async (req, res, next) => {
  try {
    const { pageId } = req.params;

    if (!isValidObjectId(pageId)) {
      req.flash("error", "page id is not valid");
      return res.redirect("/");
    }

    const page = await UserModel.findOne({ _id: pageId });

    if (!page) {
      req.flash("error", "page not found :(");
      return res.redirect("/");
    }

    const existFollowing = await FollowModel.findOne({
      follower: req.user._id,
      following: pageId,
    });

    if (existFollowing) {
      req.flash("error", "You have followed this user");
      return res.redirect(`/page/${pageId}`);
    }

    if (req.user._id.toString() === pageId.toString()) {
      req.flash("error", "you cant follow your self");
      return res.redirect(`/page/${pageId}`);
    }

    await FollowModel.create({
      follower: req.user._id,
      following: pageId,
    });

    req.flash("success", "follow user successfully :)");
    return res.redirect(`/page/${pageId}`);
  } catch (error) {
    next(error);
  }
};

exports.unfollow = async (req, res, next) => {
  try {
    const { pageId } = req.params;

    if (!isValidObjectId(pageId)) {
      req.flash("error", "page id is not valid");
      return res.redirect("/");
    }

    const page = await FollowModel.findOneAndDelete({
      follower: req.user._id,
      following: pageId,
    });

    if (!page) {
      req.flash("error", "page not found");
      return res.redirect("/");
    }

    req.flash("success", "unfollow user successfully :)");
    return res.redirect(`/page/${pageId}`);
  } catch (error) {
    next(error);
  }
};
